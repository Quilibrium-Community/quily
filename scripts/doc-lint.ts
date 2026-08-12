#!/usr/bin/env tsx
/**
 * doc-lint — show how a doc will actually be chunked for retrieval, and flag
 * chunks that would mislead someone who sees only that chunk.
 *
 * Usage:
 *   yarn doc:lint docs/custom/Some-Doc.md
 *   yarn doc:lint docs/custom/Some-Doc.md --full     # print whole chunk bodies
 *   yarn doc:lint docs/custom/Some-Doc.md --strict   # exit 1 if anything is flagged
 *
 * Why this exists
 * ---------------
 * A retriever hands the model individual chunks, never the document. So the
 * unit that has to be correct is the chunk, not the file — and chunk boundaries
 * are invisible while writing.
 *
 * On 2026-08-12 `Mainnet-Status-What-Is-Live.md` split into exactly two chunks
 * and the boundary landed on the "## Live and working today" heading. Chunk one
 * was therefore a pure list of everything that does NOT work. Retrieved alone it
 * could only produce "the network isn't ready", which is badly wrong: Quorum,
 * QStorage, QKMS, QNS, MegaRPC, Klearu and MetaVM had all shipped. The document
 * read fine end to end. No amount of proofreading would have caught it, because
 * the defect only exists once the splitter runs.
 *
 * This imports the REAL loader and the REAL chunker rather than reimplementing
 * either, so the boundaries shown here are the boundaries that get embedded. A
 * lint with its own copy of the chunking config would drift and then lie, which
 * is worse than no lint at all.
 */

import { resolve, relative, sep } from 'path';
import { existsSync } from 'fs';
import { loadDocuments } from './ingest/loader.js';
import { chunkDocuments } from './ingest/chunker.js';

const DOCS_ROOT = resolve(__dirname, '../docs');

const argv = process.argv.slice(2);
const STRICT = argv.includes('--strict');
const FULL = argv.includes('--full');
const target = argv.find((a) => !a.startsWith('--'));

if (!target) {
  console.error('Usage: yarn doc:lint <path-to-markdown> [--full] [--strict]');
  console.error('Example: yarn doc:lint docs/custom/Quilibrium-Service-Classification.md');
  process.exit(1);
}

// ── Heuristics ───────────────────────────────────────────────────────────────

// Words too common to identify a subject. A chunk containing only these has not
// actually named what it is about.
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'what', 'that', 'this', 'from', 'into', 'about',
  'your', 'you', 'are', 'not', 'but', 'how', 'why', 'when', 'where', 'which',
  'is', 'it', 'a', 'an', 'of', 'to', 'in', 'on', 'or', 'vs', 'guide',
  'reference', 'overview', 'introduction', 'notes', 'doc', 'docs', 'status',
]);

/**
 * Claims that something does not work. Deliberately narrow: these are phrases
 * that assert unavailability, not merely any use of the word "not".
 */
const NEGATIVE = /\b(not live|isn't live|is not live|are not live|not yet|not available|not functional|not enabled|not currently|no longer|cannot|can't|unavailable|gated on|blocked by|still locked|coming soon|404|NOT\b)/gi;

/** Claims that something does work. */
const POSITIVE = /\b(is live|are live|went live|shipped|usable|available today|works today|working today|in production|running|launched|active|already)\b/gi;

/**
 * A chunk counts as one-sided when the dominant polarity outnumbers the other by
 * this much. Calibrated against the real failure: the pre-fix status doc's lead
 * chunk measured 20 negative to 2 positive (10x), while the fixed lead chunk —
 * the one carrying the both-sides summary table — measured 8 to 19 (2.4x). The
 * threshold sits between those, closer to the passing case so that genuinely
 * mixed prose is not flagged.
 */
const SKEW_RATIO = 3;

/** Below this, the chunk is too sparse in status language for the ratio to mean anything. */
const SKEW_MIN_HITS = 4;

function countMatches(text: string, re: RegExp): number {
  return (text.match(re) || []).length;
}

function subjectTerms(title: string, path: string): string[] {
  const source = `${title} ${path.split(/[\\/]/).pop() ?? ''}`;
  return [
    ...new Set(
      source
        .replace(/\.md$/i, '')
        .split(/[^A-Za-z0-9]+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 2 && !STOPWORDS.has(w.toLowerCase()))
        .map((w) => w.toLowerCase())
    ),
  ];
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const abs = resolve(target!);
  if (!existsSync(abs)) {
    console.error(`No such file: ${target}`);
    process.exit(1);
  }

  // Load through the real loader so frontmatter is stripped exactly as it is at
  // ingest time. Frontmatter shifts every downstream offset, so parsing it
  // differently here would move every boundary.
  const all = await loadDocuments(DOCS_ROOT);
  const wantedPath = relative(DOCS_ROOT, abs).split(sep).join('/');
  const doc = all.find((d) => d.path === wantedPath);

  if (!doc) {
    console.error(`Loaded ${all.length} docs but none matched "${wantedPath}".`);
    console.error('The file must live under docs/ and have non-empty body content.');
    process.exit(1);
  }

  const chunks = await chunkDocuments([doc], 'doc-lint');
  const title = String(doc.frontmatter?.title ?? '').replace(/^["']|["']$/g, '');
  const terms = subjectTerms(title || wantedPath, wantedPath);

  const docText = doc.content;
  const docIsMixed = NEGATIVE.test(docText) && POSITIVE.test(docText);

  console.log(`\n${wantedPath}`);
  console.log(`${chunks.length} chunk(s)${title ? ` · "${title}"` : ''}`);
  if (terms.length) console.log(`subject terms: ${terms.slice(0, 8).join(', ')}`);
  console.log('─'.repeat(72));

  const warnings: string[] = [];

  chunks.forEach((c, i) => {
    const body = c.content;
    const firstLine = body.split('\n').find((l) => l.trim())?.trim() ?? '';

    console.log(`\n[${i + 1}/${chunks.length}] ${c.metadata.token_count} tokens`);
    console.log(`  heading: ${c.metadata.heading_path || '(none)'}`);
    console.log(`  starts:  ${firstLine.slice(0, 90)}`);
    if (FULL) {
      console.log('  ┌─');
      body.split('\n').forEach((l) => console.log(`  │ ${l}`));
      console.log('  └─');
    }

    // Check 1 — orphan subject.
    // A chunk that never names its own subject is unattributable once it is
    // pulled out of the document and shown on its own.
    const named = terms.filter((t) => body.toLowerCase().includes(t));
    if (terms.length && named.length === 0) {
      const msg = `chunk ${i + 1} never names its subject (${terms.slice(0, 4).join(', ')}) — unattributable when retrieved alone`;
      warnings.push(msg);
      console.log(`  ⚠ ${msg}`);
    }

    // Check 2 — one-sided status claim.
    // Only meaningful when the DOCUMENT presents both sides: a wholly negative
    // doc is allowed wholly negative chunks. The bug is a balanced doc whose
    // balance does not survive chunking.
    //
    // Presence alone is useless here, which is why this counts. The chunk that
    // caused the incident DID contain the word "running", so a does-it-mention-
    // anything-positive test passed it. What was actually wrong was proportion:
    // it asserted unavailability twenty times and named no shipped product.
    if (docIsMixed) {
      const neg = countMatches(body, NEGATIVE);
      const pos = countMatches(body, POSITIVE);
      const [hi, lo] = neg >= pos ? [neg, pos] : [pos, neg];
      const skewed = hi >= SKEW_MIN_HITS && hi >= (lo || 0.5) * SKEW_RATIO;

      console.log(`  status:  ${pos} positive / ${neg} negative${skewed ? '  ← skewed' : ''}`);

      if (skewed) {
        const side = neg > pos ? 'NEGATIVE' : 'POSITIVE';

        // Only the LEAD chunk is an error. Skew in a later, topic-scoped section
        // is expected and fine — a "what is not live" section is supposed to be
        // negative, and a query specifically about a gated feature is well served
        // by it. What broke was the lead chunk: it holds the title and intro, so
        // it is what a broad "what is the status" query lands on, and it ranked
        // first in the incident. Warning on every one-sided section instead would
        // fire on well-formed documents and train people to ignore the output.
        if (i === 0) {
          const msg = `LEAD chunk is ${hi}:${lo} ${side} while the doc covers both sides — a broad query lands here first and gets half the picture`;
          warnings.push(msg);
          console.log(`  ⚠ ${msg}`);
        } else {
          console.log(`  · one-sided (${hi}:${lo} ${side}) — fine for a topic-scoped section, as long as it points at the other side`);
        }
      }
    }
  });

  console.log(`\n${'─'.repeat(72)}`);
  if (warnings.length === 0) {
    console.log('No issues found.');
  } else {
    console.log(`${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`  ⚠ ${w}`));
    console.log('\nUsual fix: put a compact both-sides summary near the top, inside a single');
    console.log('table row or paragraph, so any chunk that surfaces carries the whole claim.');
  }

  process.exit(STRICT && warnings.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('doc-lint failed:', err?.message || err);
  process.exit(1);
});
