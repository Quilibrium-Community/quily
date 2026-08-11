/**
 * Retrieval regression harness.
 *
 * Asserts on the chunks the retriever actually hands to the LLM, NOT on the
 * LLM's prose. That makes every case deterministic and free: no model call, no
 * judge, no API spend. The eval suite (`yarn eval:run`) measures answer quality
 * and needs an LLM; this measures whether the right documents were even found,
 * which is the layer where retrieval bugs actually live.
 *
 * Why it exists: on 2026-08-11 the bot claimed it had no licensing docs for
 * "tell us about the AGPL license for Q and its services", 8 minutes after
 * docs/custom/Quilibrium-Licensing.md was ingested. The single word "services"
 * matched BROAD_QUERY_KEYWORDS, which decomposed the query into all 10
 * KNOWN_ENTITIES sub-queries, built a 199-chunk pool, blew the 1200ms rerank
 * budget, and fell back to sorting by similarity scores computed against
 * different sub-query embeddings. The 7 licensing chunks landed at rank 109+.
 * The eval suite could not have caught this: its `must_cite` criterion counts
 * [N] markers, not which documents were retrieved.
 *
 * Usage:
 *   yarn retrieval:check              # run every case
 *   yarn retrieval:check licensing    # run cases whose id contains "licensing"
 *   yarn retrieval:check --verbose    # also dump every retrieved chunk
 *   yarn retrieval:check --no-rerank  # force the no-reranker path (see below)
 *
 * --no-rerank strips the rerank credentials for the run, so retrieval falls back to its
 * degraded ordering. This is not hypothetical: the Vercel deployment had no reranker
 * configured at all until 2026-08-11, so the fallback was its real ranking, while local runs
 * always reranked and looked fine. Every case should pass in BOTH modes.
 */

import 'dotenv/config';
import { prepareQuery } from '../src/lib/rag/service';
import type { RetrievedChunk } from '../src/lib/rag/types';

// ─── Entity → documentation mapping ─────────────────────────────────────────
// Used by the coverage cases. Bridge/QPing/QQ share a single document, so they
// count as one group: a coverage assertion has to be satisfiable in principle,
// and no retrieval can surface three distinct docs that don't exist. Quark is
// deliberately absent — it has no dedicated doc (see the "lightly documented"
// note in KNOWN_ENTITIES), so requiring it would make the test unpassable.
// Patterns are matched case-INSENSITIVELY and span every documentation root, not just
// docs/custom/. An earlier version of this map listed only the custom/ filenames and matched
// case-sensitively, so it scored a genuinely broad result set (klearu.md, quilibrium-kms.md,
// ecosystem/quorum.md) as covering 2 entities when it actually covered 5. A coverage metric
// that under-reports is worse than none: it condemns a working fix.
const ENTITY_DOCS: Record<string, string[]> = {
  QStorage: ['qstorage', 'q-storage'],
  QKMS: ['qkms', 'quilibrium-kms'],
  QNS: ['qns-faq', 'ecosystem/qns'],
  Quorum: ['quorum-farcaster', 'quorum-notifications', 'ecosystem/quorum'],
  Hypersnap: ['hypersnap'],
  Klearu: ['klearu'],
  MetaVM: ['metavm'],
  QCL: ['qcl-quilibrium-compute-language', 'q-compute-language'],
  Balance: ['balance-programming-language'],
  MegaRPC: ['megarpc'],
  QConsole: ['qconsole', 'q-console'],
  // Bridge, QPing and QQ are three separate services, but the knowledge base documents all
  // three in a single file (Bridge-QPing-QQ-Services.md), so retrieval cannot surface one
  // without the others and coverage cannot distinguish them. They are counted as one group
  // to keep this metric honest — splitting the doc per service is the real fix, and would
  // also give each service its own retrieval target.
  'Bridge+QPing+QQ (shared doc)': ['bridge-qping-qq', 'quilibrium-bridge'],
};

function entitiesCovered(chunks: RetrievedChunk[]): string[] {
  const covered = new Set<string>();
  for (const [entity, patterns] of Object.entries(ENTITY_DOCS)) {
    if (chunks.some((c) => patterns.some((p) => c.source_file.toLowerCase().includes(p)))) {
      covered.add(entity);
    }
  }
  return [...covered];
}

// ─── Cases ──────────────────────────────────────────────────────────────────

interface Expectation {
  /** At least `count` retrieved chunks must come from a file matching this substring. */
  minChunksFrom?: { file: string; count: number };
  /** At least this many distinct ENTITY_DOCS groups must be represented. */
  minDistinctEntities?: number;
  /** The relevance signal handed to the LLM, which drives the low-confidence warning. */
  quality?: 'high' | 'low' | 'none';
}

interface Case {
  id: string;
  query: string;
  description: string;
  expect: Expectation;
  /**
   * True when the case is a reproduction of an open bug and is EXPECTED to fail
   * until the fix lands. A case marked this way that starts passing is reported
   * as FIXED, and one that was never failing is reported loudly — a regression
   * test that cannot fail is worse than none, because it manufactures
   * confidence. Flip this to false once the fix ships.
   */
  expectedToFailOnMain?: boolean;
}

const CASES: Case[] = [
  {
    id: 'licensing-agpl-with-services',
    query: 'tell us about the AGPL license for Q and its services',
    description: 'REGRESSION (2026-08-11): the exact Discord question that returned "I have no licensing docs"',
    expect: { minChunksFrom: { file: 'Quilibrium-Licensing', count: 3 } },
  },
  {
    id: 'licensing-agpl-control',
    query: 'tell us about the AGPL license for Q',
    description: 'CONTROL: same question without the word "services" — must already pass',
    expect: { minChunksFrom: { file: 'Quilibrium-Licensing', count: 3 } },
  },
  {
    id: 'licensing-can-i-fork',
    query: 'can I fork Quilibrium and build a closed source app on top of it',
    description: 'Licensing reachable by natural phrasing, no broad keyword involved',
    expect: { minChunksFrom: { file: 'Quilibrium-Licensing', count: 2 } },
  },
  {
    id: 'coverage-all-products',
    query: 'tell me about all Quilibrium products',
    description: 'GUARD: the scenario decomposition was built for — must not regress',
    // Baseline before the 2026-08-11 retrieval fix was 4. Observed 6-8 after. Set to 5 rather
    // than the observed maximum: reranking is a network call and occasionally times out, so a
    // guard pinned to the best run would flake, and a flaky guard gets ignored.
    expect: { minDistinctEntities: 5 },
  },
  {
    id: 'coverage-what-services',
    query: 'what services does Quilibrium offer',
    description: 'GUARD: legitimately broad use of "services" — must keep decomposing well',
    expect: { minDistinctEntities: 4 },
  },
  {
    id: 'quality-offtopic-broad-must-hedge',
    query: 'list all the best pizza toppings and delivery services',
    description:
      'Off-topic but broad: "all"/"services" force decomposition, so entity sub-queries pull ' +
      'product docs scoring ~0.75 against THEIR OWN sub-query. Quality must not read those as ' +
      'confidence about pizza, or the bot answers assertively from irrelevant context.',
    expect: { quality: 'low' },
  },
];

// ─── Runner ─────────────────────────────────────────────────────────────────

interface CaseOutcome {
  case: Case;
  passed: boolean;
  failures: string[];
  chunks: RetrievedChunk[];
  ragQuality: string;
  decomposed: boolean;
  rerankFailed: boolean;
  durationMs: number;
}

/**
 * Run one case while capturing the retriever's console output. Those log lines
 * are the only place decomposition and rerank failure are visible from outside,
 * and they are exactly the diagnostics that made the original bug findable.
 */
async function runCase(c: Case): Promise<CaseOutcome> {
  const logged: string[] = [];
  const origLog = console.log;
  const origWarn = console.warn;
  const capture = (...args: unknown[]) => { logged.push(args.map(String).join(' ')); };
  console.log = capture;
  console.warn = capture;

  const started = Date.now();
  let prepared;
  try {
    prepared = await prepareQuery({
      query: c.query,
      conversationHistory: [],
      embeddingProvider: 'openrouter',
      embeddingApiKey: process.env.OPENROUTER_API_KEY,
      cohereApiKey: process.env.COHERE_API_KEY,
    });
  } finally {
    console.log = origLog;
    console.warn = origWarn;
  }
  const durationMs = Date.now() - started;

  const chunks = prepared.retrievedChunks;
  const failures: string[] = [];

  if (c.expect.minChunksFrom) {
    const { file, count } = c.expect.minChunksFrom;
    const got = chunks.filter((ch) => ch.source_file.includes(file)).length;
    if (got < count) failures.push(`expected >=${count} chunks from "${file}", got ${got}`);
  }

  if (c.expect.minDistinctEntities !== undefined) {
    const covered = entitiesCovered(chunks);
    if (covered.length < c.expect.minDistinctEntities) {
      failures.push(
        `expected >=${c.expect.minDistinctEntities} distinct entity docs, got ${covered.length} [${covered.join(', ')}]`
      );
    }
  }

  if (c.expect.quality !== undefined && prepared.ragQuality !== c.expect.quality) {
    failures.push(`expected quality "${c.expect.quality}", got "${prepared.ragQuality}"`);
  }

  return {
    case: c,
    passed: failures.length === 0,
    failures,
    chunks,
    ragQuality: prepared.ragQuality,
    decomposed: logged.some((l) => l.includes('Query decomposition triggered')),
    rerankFailed: logged.some((l) => l.includes('reranking failed')),
    durationMs,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  if (args.includes('--no-rerank')) {
    // Cleared before any retrieval runs; the retriever reads these at call time and treats
    // an absent key as "this provider is unavailable".
    delete process.env.COHERE_API_KEY;
    delete process.env.CLOUDFLARE_ACCOUNT_ID;
    delete process.env.CLOUDFLARE_API_TOKEN;
    console.log('Running with rerankers DISABLED — exercising the fallback ordering.');
  }
  const filter = args.find((a) => !a.startsWith('--'));
  const selected = filter ? CASES.filter((c) => c.id.includes(filter)) : CASES;

  if (selected.length === 0) {
    console.error(`No cases match "${filter}". Available: ${CASES.map((c) => c.id).join(', ')}`);
    process.exit(1);
  }

  console.log(`\nRetrieval regression — ${selected.length} case(s)\n`);

  const outcomes: CaseOutcome[] = [];
  for (const c of selected) {
    const outcome = await runCase(c);
    outcomes.push(outcome);

    const known = c.expectedToFailOnMain;
    const mark = outcome.passed ? (known ? 'FIXED' : 'PASS') : known ? 'KNOWN-FAIL' : 'FAIL';
    console.log(`[${mark}] ${c.id}  (${outcome.durationMs}ms)`);
    console.log(`        ${c.description}`);
    console.log(
      `        query: "${c.query}"\n` +
      `        chunks=${outcome.chunks.length} quality=${outcome.ragQuality} ` +
      `decomposed=${outcome.decomposed} rerankFailed=${outcome.rerankFailed}`
    );
    if (c.expect.minDistinctEntities !== undefined) {
      console.log(`        entities covered: [${entitiesCovered(outcome.chunks).join(', ') || 'none'}]`);
    }
    for (const f of outcome.failures) console.log(`        ✗ ${f}`);
    if (verbose) {
      for (const ch of outcome.chunks) {
        console.log(`          [${ch.citationIndex}] sim=${ch.similarity.toFixed(4)} ${ch.source_file}`);
      }
    }
    console.log();
  }

  // A case flagged as a known bug that passes without a fix means the
  // assertion is not actually exercising the bug — report it rather than
  // quietly counting it as a win.
  const falseGuards = outcomes.filter((o) => o.case.expectedToFailOnMain && o.passed);
  const realFailures = outcomes.filter((o) => !o.passed && !o.case.expectedToFailOnMain);
  const knownFailures = outcomes.filter((o) => !o.passed && o.case.expectedToFailOnMain);

  console.log('─'.repeat(70));
  console.log(
    `passed=${outcomes.filter((o) => o.passed).length}/${outcomes.length}  ` +
    `regressions=${realFailures.length}  known-failing=${knownFailures.length}`
  );
  for (const o of falseGuards) {
    console.log(`\n⚠️  ${o.case.id} is marked expectedToFailOnMain but PASSED.`);
    console.log('   Either the fix already landed (clear the flag) or the assertion is too weak to catch the bug.');
  }

  process.exit(realFailures.length > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
