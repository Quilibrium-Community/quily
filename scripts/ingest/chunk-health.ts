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
 * There was a second check here, "orphan subject", flagging chunks that never
 * named their own document's subject. It was removed after checking how chunks
 * actually reach the model: prompt.ts renders every one as
 * `[N] Source: [<frontmatter title>](url)` immediately above its content, so the
 * subject is always attributed regardless of the body text. All 54 hand-authored
 * docs carry a frontmatter title, so the check could never fire meaningfully — it
 * flagged 5 harmless chunks and would only ever have produced false positives.
 */

import type { LoadedDocument, ChunkWithContext } from './types.js';

export interface ChunkIssue {
  doc: string;
  chunk: number;
  totalChunks: number;
  kind: 'one-sided-lead';
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

  return issues;
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
