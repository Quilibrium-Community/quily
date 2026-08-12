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
 * A retriever hands the model individual chunks, never the document. So the unit
 * that has to be correct on its own is the chunk, and chunk boundaries are
 * invisible while writing.
 *
 * On 2026-08-12 `Mainnet-Status-What-Is-Live.md` split into exactly two chunks
 * and the boundary landed on the "## Live and working today" heading. The lead
 * chunk asserted unavailability 23 times and named zero shipped products.
 * Retrieved alone it could only produce "the network isn't ready", which is badly
 * wrong: Quorum, QStorage, QKMS, QNS, MegaRPC, Klearu and MetaVM had all shipped.
 * The document read fine end to end. No proofreading would have caught it,
 * because the defect only exists once the splitter runs.
 *
 * This imports the REAL loader and the REAL chunker rather than reimplementing
 * either, so the boundaries shown here are the boundaries that get embedded. The
 * checks live in ingest/chunk-health.ts and are shared with the ingest pipeline,
 * so the on-demand and automatic paths cannot disagree.
 */

import { resolve, relative, sep } from 'path';
import { existsSync } from 'fs';
import { loadDocuments } from './ingest/loader.js';
import { chunkDocuments } from './ingest/chunker.js';
import { findChunkIssues, polarity } from './ingest/chunk-health.js';

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
  const issues = findChunkIssues(doc, chunks);

  console.log(`\n${wantedPath}`);
  console.log(`${chunks.length} chunk(s)${title ? ` · "${title}"` : ''}`);
  if (chunks.length === 1) {
    console.log('single chunk — chunking cannot have split anything apart');
  }
  console.log('─'.repeat(72));

  chunks.forEach((c, i) => {
    const body = c.content;
    const firstLine = body.split('\n').find((l) => l.trim())?.trim() ?? '';
    const { pos, neg, skewed, negTerms, posTerms } = polarity(body);
    const mine = issues.filter((x) => x.chunk === i + 1);

    console.log(`\n[${i + 1}/${chunks.length}] ${c.metadata.token_count} tokens`);
    console.log(`  heading: ${c.metadata.heading_path || '(none)'}`);
    console.log(`  starts:  ${firstLine.slice(0, 90)}`);
    console.log(`  status:  ${pos} positive / ${neg} negative${skewed ? '  ← skewed' : ''}`);

    // Show what actually matched when skewed. Without this you cannot tell a real
    // "this thing is unavailable" chunk from a comparison table full of "not
    // supported" describing a competitor, and the two need opposite responses.
    if (skewed) {
      if (negTerms.length) console.log(`  neg hits: ${negTerms.join(', ')}`);
      if (posTerms.length) console.log(`  pos hits: ${posTerms.join(', ')}`);
    }

    if (FULL) {
      console.log('  ┌─');
      body.split('\n').forEach((l) => console.log(`  │ ${l}`));
      console.log('  └─');
    }

    mine.forEach((x) => console.log(`  ⚠ ${x.message}`));

    // Skew that is not an issue still gets a note, so the reason it was allowed
    // is visible rather than looking like the check missed it.
    if (skewed && mine.every((x) => x.kind !== 'one-sided-lead')) {
      const [hi, lo] = neg >= pos ? [neg, pos] : [pos, neg];
      const why =
        chunks.length === 1
          ? 'single-chunk doc, nothing was split'
          : 'topic-scoped section, fine as long as it points at the other side';
      console.log(`  · one-sided (${hi}:${lo}) — ${why}`);
    }
  });

  console.log(`\n${'─'.repeat(72)}`);
  if (issues.length === 0) {
    console.log('No issues found.');
  } else {
    console.log(`${issues.length} issue(s):`);
    issues.forEach((x) => console.log(`  ⚠ chunk ${x.chunk}: ${x.message}`));
    console.log('\nUsual fix: put a compact both-sides summary near the top, inside a single');
    console.log('table row or paragraph, so any chunk that surfaces carries the whole claim.');
  }

  process.exit(STRICT && issues.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('doc-lint failed:', err?.message || err);
  process.exit(1);
});
