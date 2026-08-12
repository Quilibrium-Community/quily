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
 */

import type { LoadedDocument, ChunkWithContext } from './types.js';

export interface ChunkIssue {
  doc: string;
  chunk: number;
  totalChunks: number;
  kind: 'orphan-subject' | 'one-sided-lead';
  message: string;
}

/** Words too common to identify a subject. */
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'what', 'that', 'this', 'from', 'into', 'about',
  'your', 'you', 'are', 'not', 'but', 'how', 'why', 'when', 'where', 'which',
  'is', 'it', 'a', 'an', 'of', 'to', 'in', 'on', 'or', 'vs', 'guide',
  'reference', 'overview', 'introduction', 'notes', 'doc', 'docs', 'status',
]);

/**
 * Claims that something does not work. Deliberately narrow: phrases asserting
 * unavailability, not merely any use of the word "not".
 */
const NEGATIVE = /\b(not live|isn't live|is not live|are not live|not yet|not available|not functional|not enabled|not currently|no longer|cannot|can't|unavailable|gated on|blocked by|still locked|coming soon|404|NOT\b)/gi;

/** Claims that something does work. */
const POSITIVE = /\b(is live|are live|went live|shipped|usable|available today|works today|working today|in production|running|launched|active|already)\b/gi;

/**
 * Calibrated against the real failure: the pre-fix status doc's lead chunk
 * measured 23 negative to 6 positive, while the fixed lead chunk — the one
 * carrying the both-sides summary table — measured 8 to 7. The threshold sits
 * between those so genuinely mixed prose is not flagged.
 */
const SKEW_RATIO = 3;

/** Below this the chunk is too sparse in status language for a ratio to mean anything. */
const SKEW_MIN_HITS = 4;

function countMatches(text: string, re: RegExp): number {
  return (text.match(re) || []).length;
}

export function subjectTerms(title: string, path: string): string[] {
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

/** Polarity counts for a chunk, exposed so doc-lint can display them. */
export function polarity(body: string): { pos: number; neg: number; skewed: boolean } {
  const pos = countMatches(body, POSITIVE);
  const neg = countMatches(body, NEGATIVE);
  const [hi, lo] = neg >= pos ? [neg, pos] : [pos, neg];
  return { pos, neg, skewed: hi >= SKEW_MIN_HITS && hi >= (lo || 0.5) * SKEW_RATIO };
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

  const title = String(doc.frontmatter?.title ?? '').replace(/^["']|["']$/g, '');
  const terms = subjectTerms(title || doc.path, doc.path);

  // Only meaningful when the DOCUMENT presents both sides. A wholly negative doc
  // is allowed wholly negative chunks; the bug is a balanced doc whose balance
  // does not survive chunking.
  const docPol = polarity(doc.content);
  const docIsMixed = docPol.pos > 0 && docPol.neg > 0;

  chunks.forEach((c, i) => {
    const body = c.content;

    // A chunk that never names its own subject is unattributable once shown alone.
    if (terms.length && !terms.some((t) => body.toLowerCase().includes(t))) {
      issues.push({
        doc: doc.path,
        chunk: i + 1,
        totalChunks: chunks.length,
        kind: 'orphan-subject',
        message: `chunk ${i + 1}/${chunks.length} never names its subject (${terms.slice(0, 4).join(', ')})`,
      });
    }

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
      if (skewed) {
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
