/**
 * Chunk health checks — flag chunks that mislead when read on their own.
 *
 * The retriever hands the model individual chunks, never the document, so the
 * unit that has to be correct in isolation is the chunk. Chunk boundaries are
 * invisible while writing, which is how `Mainnet-Status-What-Is-Live.md` shipped
 * with its split landing exactly on "## Live and working today", leaving a lead
 * chunk that asserted unavailability 23 times and named zero shipped products.
 * Retrieved alone it could only produce "the network isn't ready", which was
 * badly wrong.
 *
 * Shared by `scripts/doc-lint.ts` (on demand, one file) and the ingest pipeline
 * (automatically, every run). One copy of the rules so the two cannot disagree.
 *
 * Two checks are live:
 *   - `one-sided-lead` — the lead chunk lost the balance the document has.
 *   - `link-appendix`  — the document ENDS with a "Related docs" / "External
 *                        sources" link list. Added 2026-09-03 while authoring
 *                        Privacy-Pools-vs-Quilibrium-Privacy.md, whose draft ended
 *                        with a 9-link appendix that chunked out on its own.
 *
 * `link-appendix` deliberately inspects the DOCUMENT, not the chunks, and that is
 * the whole point of its design. The first version examined the final chunk, and an
 * independent review measured it into the ground:
 *   - A short appendix (a 3-link `## Related docs`) is ALWAYS merged into the
 *     preceding section by the splitter's greedy merge step, so the commonest form
 *     of the defect could never be seen.
 *   - For a long appendix, isolation depends on how much prose happens to precede
 *     it. Sweeping filler length against a fixed 10-link appendix produced 10 runs
 *     where the appendix was fully isolated: 5 fired, 5 did not.
 *   - It flagged a fragment of an appendix while missing the whole one, and its
 *     message asserted "carries no answer" about chunks holding real prose.
 * Reading the source structure instead is deterministic: an appendix is either
 * written or it is not, and the answer does not move when a paragraph above it
 * grows. The harm is still about chunking (an isolated reference chunk spends an
 * embedding slot on something that cannot answer), but whether today's layout
 * happens to isolate it is luck, and a doc that is safe now becomes unsafe the next
 * time someone adds a paragraph.
 *
 * There was a second check here, "orphan subject", flagging chunks that never
 * named their own document's subject. It was removed after checking how chunks
 * actually reach the model: for docs under `custom/`, prompt.ts renders every one
 * as `[N] Source: [<frontmatter title>](url)` immediately above its content, so
 * the subject is always attributed regardless of the body text. (Corpus-wide the
 * rendering varies — prompt.ts:86-88 falls back to heading_path or a path-derived
 * title, hardcodes 'Livestream' for transcripts, and drops the markdown link when
 * no URL resolves — but `getRepoDocsUrl` always yields a URL for authored docs, so
 * the claim holds where this check applied.) All 59 hand-authored
 * docs carry a frontmatter title, so the check could never fire meaningfully — it
 * flagged 5 harmless chunks and would only ever have produced false positives.
 */

import type { LoadedDocument, ChunkWithContext } from './types.js';

export interface ChunkIssue {
  doc: string;
  chunk: number;
  totalChunks: number;
  kind: 'one-sided-lead' | 'link-appendix';
  message: string;
}

/**
 * Claims that something is unavailable.
 *
 * Every alternative here must be a statement about AVAILABILITY. The first
 * version of this pattern included a bare `NOT\b` for emphatic "**NOT** live",
 * but the case-insensitive flag turned it into "match the word not", so it
 * counted ordinary prose negation. Measured on the real corpus, 9 of the 9
 * "negative" hits in QKMS-Key-Management-Service.md were the word "not" inside
 * an AWS comparison table ("Not supported", "Not offered") describing what a
 * COMPETITOR lacks. The check was reporting a live service as unavailable.
 *
 * `cannot` and `can't` are excluded for the same reason: they describe capability
 * limits ("Ethereum cannot store payloads this large"), not deployment state.
 */
const NEGATIVE_PHRASES = /\b(not live|isn't live|is not live|are not live|not yet live|not yet available|not yet functional|not yet enabled|not yet|not available|not functional|not enabled|not currently|no longer available|unavailable|gated on|blocked by|still locked|not been published|coming soon)\b/gi;

/** Emphatic, shouty NOT. Case-SENSITIVE — this is the one the `i` flag broke. */
const NEGATIVE_EMPHATIC = /\bNOT\b/g;

/**
 * Claims that something does work.
 *
 * Same discipline: bare `running` and `active` are excluded because "running a
 * node" and "active provers" saturate this corpus without saying anything about
 * whether a product is available.
 */
const POSITIVE = /\b(is live|are live|went live|now live|launched|shipped|in production|available today|works today|working today|usable today|already available|generally available)\b/gi;

/**
 * Calibrated against the real failure: the pre-fix status doc's lead chunk
 * measured 23 negative to 6 positive, while the fixed lead chunk — the one
 * carrying the both-sides summary table — measured 8 to 7. The threshold sits
 * between those so genuinely mixed prose is not flagged.
 */
const SKEW_RATIO = 3;

/** Below this the chunk is too sparse in status language for a ratio to mean anything. */
const SKEW_MIN_HITS = 4;

/** Polarity counts for a chunk, exposed so doc-lint can display them. */
export function polarity(body: string): {
  pos: number;
  neg: number;
  skewed: boolean;
  negTerms: string[];
  posTerms: string[];
} {
  const negTerms = [...(body.match(NEGATIVE_PHRASES) ?? []), ...(body.match(NEGATIVE_EMPHATIC) ?? [])];
  const posTerms = body.match(POSITIVE) ?? [];
  const pos = posTerms.length;
  const neg = negTerms.length;
  const [hi, lo] = neg >= pos ? [neg, pos] : [pos, neg];
  return {
    pos,
    neg,
    skewed: hi >= SKEW_MIN_HITS && hi >= (lo || 0.5) * SKEW_RATIO,
    negTerms,
    posTerms,
  };
}

const MD_LINK = /\[[^\]]*\]\([^)]*\)/g;
const BARE_URL = /https?:\/\/\S+/g;
const CODE_SPAN = /`[^`]*`/g;

/**
 * Drop fenced code blocks, delimiters included.
 *
 * Without this, a shell block is read as prose and markup: `# Download the release`
 * parses as a heading, and the `curl https://…` lines below it count as links, so an
 * install guide ending in a download block is reported as "document ends with a
 * reference list". Measured 2026-09-03: 9 of 59 authored docs already contain `#`
 * comments inside fences, including Cluster-Configuration-Guide.md.
 *
 * Done line by line rather than with a backreferenced regex so unbalanced or nested
 * fences degrade to "drop the rest" instead of matching across half the document.
 */
function stripFencedBlocks(content: string): string {
  const out: string[] = [];
  let fence: string | null = null;
  for (const line of content.split('\n')) {
    const m = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence) {
      // A closing fence must use the same character and be at least as long.
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null;
      continue;
    }
    if (m) {
      fence = m[1];
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

/**
 * Split a chunk into "references" (links, URLs, backticked paths) and the prose
 * left over once those are removed. A chunk made only of references cannot answer
 * anything on its own, however good the links are.
 */
export function linkDensity(body: string): { links: number; words: number; ratio: number } {
  // Code is neither a reference nor prose; a `curl https://…` line is not a citation.
  const source = stripFencedBlocks(body.replace(/\r\n/g, '\n'));

  // Markdown links must be consumed BEFORE bare URLs are counted. Running both
  // regexes over the original body counts `[text](https://x)` twice, because
  // BARE_URL's \S+ matches the href inside the parentheses. That made every
  // external link weigh 2 while a relative link weighed 1, so `links` was not a
  // count of anything and the threshold silently halved for external-link lists.
  const mdLinks = (source.match(MD_LINK) ?? []).length;
  const withoutMd = source.replace(MD_LINK, ' ');
  const links = mdLinks + (withoutMd.match(BARE_URL) ?? []).length;

  const prose = withoutMd
    .replace(BARE_URL, ' ')
    .replace(CODE_SPAN, ' ')
    // Footer strip must precede the list/quote-marker strip below: that one eats
    // the leading `*` of `*Last updated: …*`, after which this pattern can never
    // match. It was dead code, leaving "Last updated:" counted as 2 prose words in
    // the tail chunk of the 39 authored docs that carry the footer.
    .replace(/\*Last updated:[^*]*\*/gi, ' ')
    .replace(/^#{1,6}\s+.*$/gm, ' ') // headings
    .replace(/^[\s>*+-]+/gm, ' ') // list and quote markers
    // Table ROWS are kept, only the pipes and separator rules go. Deleting whole
    // rows set words to 0 for any section whose links sit in a table, which made
    // every such section score as a pure reference list no matter how much
    // explanation its cells carried. A links-in-a-table section is exactly the
    // shape an exchange-listing or endpoint table takes.
    .replace(/^\s*\|?[\s:|-]*\|[\s:|-]*$/gm, ' ') // table separator rules only
    .replace(/[*_~`#|>-]/g, ' ');
  // Require two letters so bullet leftovers and stray punctuation are not words.
  const words = prose.split(/\s+/).filter((w) => /[a-z]{2,}/i.test(w)).length;
  return { links, words, ratio: links === 0 ? Infinity : words / links };
}

/** ATX heading, with optional closing hashes (`## Title ##`) stripped from the text. */
const HEADING_LINE = /^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/;

/**
 * Split a markdown body into sections at every heading.
 *
 * CRLF is normalised first. Without it a `$`-anchored per-line match silently
 * fails on every CRLF file, because JS `.` does not match `\r`, so the whole
 * document collapses into one section and nothing is ever flagged. Several docs in
 * this repo are CRLF; the prototype of this check undercounted by 2 of 5 until the
 * normalisation was added.
 *
 * Fenced code is removed before splitting, so a `# comment` inside a shell block is
 * not mistaken for a section heading. Trailing `##` (closing ATX hashes) are dropped
 * from the heading text so they do not leak into the reported message.
 *
 * Setext headings (`Title` over `=====`) are NOT recognised. No authored doc uses
 * them, and treating a `---` rule as a heading would split on every horizontal rule.
 * The consequence is that an appendix written with setext headings is invisible to
 * this check; the authoring rule in the `add-doc` skill covers that case.
 */
function splitSections(content: string): { heading: string; body: string }[] {
  const out: { heading: string; body: string }[] = [];
  let cur = { heading: '', body: '' };
  for (const line of stripFencedBlocks(content.replace(/\r\n/g, '\n')).split('\n')) {
    const m = line.match(HEADING_LINE);
    if (m) {
      out.push(cur);
      cur = { heading: m[2], body: '' };
    } else {
      cur.body += line + '\n';
    }
  }
  out.push(cur);
  return out.filter((s) => s.heading || s.body.trim());
}

/** A section is a reference list once it holds at least this many links... */
const SECTION_MIN_LINKS = 3;
/**
 * ...and its prose amounts to no more than a short label per link.
 *
 * This ratio, rather than an absolute word count, is what separates a glossed link
 * list ("- [Doc](url) — why there is no issuer") from a real section that happens
 * to cite sources. Measured 2026-09-03: the flagged appendices sit at 2-4 words per
 * link, while Cluster-Configuration-Guide.md's genuine `## Important Notes`
 * (operator warnings, no links) and the prose sections of every other doc are far
 * above it. An absolute word threshold was tried first and was one deleted bullet
 * away from flagging those operator warnings with a message claiming they carried
 * no answer.
 */
const MAX_WORDS_PER_LINK = 12;
/**
 * The document must still be a real explainer once the appendix is removed,
 * otherwise it is a link directory and the links ARE the content.
 *
 * Honest scope, measured 2026-09-03: no doc in the current corpus actually reaches
 * this test, so it is untested against real data. Quilibrium-Public-Repositories.md,
 * the directory this was meant to protect, is protected by something else entirely:
 * its last section is `## Notes` (61 words, no links), so the backwards walk stops
 * immediately and returns at the `trailing.length === 0` exit. Give that same
 * directory a 200-word preamble and remove the trailing Notes and it WOULD flag.
 * Treat this constant as a stated intention, not as a validated boundary.
 */
const REMAINDER_MIN_WORDS = 200;

/**
 * Find chunks in one document that would mislead if retrieved alone.
 */
export function findChunkIssues(
  doc: LoadedDocument,
  chunks: ChunkWithContext[]
): ChunkIssue[] {
  const issues: ChunkIssue[] = [];
  if (chunks.length === 0) return issues;

  // Only meaningful when the DOCUMENT presents both sides. A wholly negative doc
  // is allowed wholly negative chunks; the bug is a balanced doc whose balance
  // does not survive chunking.
  const docPol = polarity(doc.content);
  const docIsMixed = docPol.pos > 0 && docPol.neg > 0;

  chunks.forEach((c, i) => {
    const body = c.content;

    // Only the LEAD chunk is an issue. Later sections are allowed to be
    // one-sided: a "what is not live" section is supposed to be negative, and a
    // question about a gated feature is well served by it. The lead chunk is
    // different because it holds the title and is what broad queries land on —
    // which is exactly what happened in the incident.
    //
    // Skipped entirely for single-chunk documents. The premise of this check is
    // that balance present in the document was destroyed by the split; with no
    // split there is no such defect, and the chunk IS the document. Without this
    // guard the check fires on any short doc that leans negative — QUIL-Token-
    // Quick-Reference.md is one 779-token chunk and scored 13:2, which reports a
    // chunking problem that cannot exist.
    if (i === 0 && docIsMixed && chunks.length > 1) {
      const { pos, neg, skewed } = polarity(body);

      // NEGATIVE skew only, deliberately asymmetric.
      //
      // A negative-skewed lead is the incident: the chunk says a dozen things are
      // unavailable, names nothing that works, and the bot answers "the network
      // isn't ready". A positive-skewed lead is the ordinary shape of almost every
      // product doc — describe the thing, caveat it further down — and flagging it
      // fires constantly on healthy documents.
      //
      // Nothing real is lost by the asymmetry. Overclaiming ("the bridge works")
      // came from docs with no negative content at all, so docIsMixed is false and
      // this check never applied to them either way.
      //
      // This also stops the check punishing the very fix it recommends: a good
      // both-sides summary table states "not live yet" once in a column header
      // rather than per row, so it reads as positive-skewed by phrase count.
      if (skewed && neg > pos) {
        const [hi, lo] = neg >= pos ? [neg, pos] : [pos, neg];
        issues.push({
          doc: doc.path,
          chunk: 1,
          totalChunks: chunks.length,
          kind: 'one-sided-lead',
          message: `lead chunk is ${hi}:${lo} ${neg > pos ? 'NEGATIVE' : 'POSITIVE'} while the doc covers both sides`,
        });
      }
    }
  });

  // A document whose final section is nothing but references.
  //
  // Docs habitually end with "Related docs" and "External sources" link lists.
  // Those are useful to a human reading the file top to bottom, and useless to a
  // retriever whenever the splitter leaves one isolated: that chunk is then one of
  // the document's embedding slots holding no explanation at all. Worse, URLs are
  // not semantically inert — a list containing getmonero.org/2024/04/27/fcmps.html
  // can win a query about Monero's membership proofs and hand the model links
  // instead of facts.
  //
  // Read from the SOURCE STRUCTURE, not from the chunks. Whether today's layout
  // happens to isolate the appendix is luck, and a doc that looks safe now becomes
  // unsafe the next time a paragraph above it grows. See the note at the top of
  // this file for the measurements that killed the chunk-based version.
  //
  // The fix is not to delete the links. It is to put each one next to the claim
  // it supports, so it travels in the same chunk as the sentence it proves.
  const appendix = findLinkAppendix(doc.content);
  if (appendix) {
    // Point at the chunk the appendix starts in so doc-lint annotates the right one.
    //
    // Match the heading as a heading and take the LAST chunk that contains it. A
    // plain substring search over chunk text hands the report to whichever chunk
    // mentions the phrase first, so a table of contents listing "Related docs", or
    // any cross-reference to it, steals the attribution and sends the author to the
    // title chunk. Falls back to the last chunk when nothing matches.
    const headingPattern = new RegExp(
      `(^|\\n)#{1,6}[ \\t]+${appendix.firstHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
    );
    const startsIn = chunks.reduce(
      (found, c, idx) => (headingPattern.test(c.content) ? idx : found),
      -1
    );
    issues.push({
      doc: doc.path,
      chunk: (startsIn === -1 ? chunks.length - 1 : startsIn) + 1,
      totalChunks: chunks.length,
      kind: 'link-appendix',
      message: `document ends with a reference list (${appendix.headings
        .map((h) => `"${h}"`)
        .join(' + ')}, ${appendix.links} links) — cite inline instead`,
    });
  }

  return issues;
}

/**
 * Walk backwards over a document's sections, collecting the trailing run that are
 * reference lists. Returns null when the document does not end in one, or when
 * removing them would leave no real explainer behind.
 */
function findLinkAppendix(
  content: string
): { headings: string[]; links: number; firstHeading: string } | null {
  const secs = splitSections(content);
  const trailing: { heading: string; body: string }[] = [];
  let i = secs.length - 1;

  while (i >= 0) {
    const d = linkDensity(secs[i].body);
    if (!(d.links >= SECTION_MIN_LINKS && d.words / d.links < MAX_WORDS_PER_LINK)) break;
    trailing.unshift(secs[i]);
    i--;
  }
  if (trailing.length === 0) return null;

  const links = trailing.reduce((n, s) => n + linkDensity(s.body).links, 0);
  if (links < SECTION_MIN_LINKS) return null;

  const remainder = secs
    .slice(0, i + 1)
    .map((s) => `${s.heading}\n${s.body}`)
    .join('\n');
  if (linkDensity(remainder).words < REMAINDER_MIN_WORDS) return null;

  return {
    headings: trailing.map((s) => s.heading || '(untitled section)'),
    links,
    firstHeading: trailing[0].heading,
  };
}

/**
 * Sweep every hand-authored doc in an ingest run.
 *
 * Scoped to `custom/` minus `custom/auto/`: everything else (official mirror,
 * transcripts, Discord scrapes, generated ecosystem cards) is machine-produced
 * and cannot be fixed by editing it here, so flagging it would be pure noise
 * that trains people to ignore the output.
 */
export function findIngestChunkIssues(
  documents: LoadedDocument[],
  allChunks: ChunkWithContext[]
): ChunkIssue[] {
  const authored = documents.filter(
    (d) => d.path.startsWith('custom/') && !d.path.startsWith('custom/auto/')
  );

  const byDoc = new Map<string, ChunkWithContext[]>();
  for (const c of allChunks) {
    const key = c.metadata.source_file;
    if (!byDoc.has(key)) byDoc.set(key, []);
    byDoc.get(key)!.push(c);
  }

  return authored.flatMap((doc) => {
    const chunks = (byDoc.get(doc.path) ?? []).sort(
      (a, b) => a.metadata.chunk_index - b.metadata.chunk_index
    );
    return findChunkIssues(doc, chunks);
  });
}
