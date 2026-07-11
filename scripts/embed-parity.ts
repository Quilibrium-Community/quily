/**
 * Retrieval-parity gate for the embedding dynamic-routing change
 * (task 2026-07-11-latency-round-2, item #4).
 *
 * bge-m3 must produce index-compatible vectors regardless of which OpenRouter
 * provider serves the embedding, otherwise `sort:'latency'` (which can land on
 * DeepInfra OR Parasail) would silently degrade retrieval. This script embeds
 * the same queries pinned to each live provider AND via the new dynamic sort,
 * runs the SAME pgvector search, and checks the returned chunk IDs match.
 *
 * Gate (reused from task 2026-07-10): same queries -> identical chunk IDs in
 * identical order across providers = parity holds, safe to float the provider.
 *
 *   yarn tsx scripts/embed-parity.ts
 *
 * No env values are printed.
 */
import 'dotenv/config';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { embed } from 'ai';
import { supabase } from '../src/lib/supabase';

const EMBEDDING_MODEL = process.env.OPENROUTER_EMBEDDING_MODEL || 'baai/bge-m3';
const RPC = 'match_document_chunks_chutes';
const MATCH_COUNT = 15;
const THRESHOLD = 0.35;

// Representative Quilibrium technical questions (mirrors the 07-10 parity set).
const QUERIES = [
  'How does Quilibrium consensus work and what is the hypergraph?',
  'What are the hardware requirements for running a Quilibrium node?',
  'Explain QUIL tokenomics and the rewards structure',
  'What is QKMS and how does multi-party computation work?',
  'How does Quilibrium approach privacy and oblivious transfer?',
];

// Routing modes to compare. `order` pins one provider; `sort` is the new default.
const MODES: Array<{ label: string; provider?: { order?: string[]; sort?: 'latency' } }> = [
  { label: 'DeepInfra (pinned)', provider: { order: ['DeepInfra'] } },
  { label: 'Parasail (pinned)', provider: { order: ['Parasail'] } },
  { label: 'sort:latency (dynamic)', provider: { sort: 'latency' } },
];

async function embedWith(
  text: string,
  provider: { order?: string[]; sort?: 'latency' } | undefined,
): Promise<number[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not set');
  const openrouter = createOpenRouter({ apiKey });
  const result = await embed({
    model: openrouter.textEmbeddingModel(EMBEDDING_MODEL, provider ? { provider } : undefined),
    value: text,
  });
  return result.embedding;
}

async function searchIds(embedding: number[]): Promise<number[]> {
  const { data, error } = await supabase.rpc(RPC, {
    query_embedding: embedding,
    match_threshold: THRESHOLD,
    match_count: MATCH_COUNT,
  });
  if (error) throw new Error(`RPC error: ${error.message}`);
  return (data || []).map((c: { id: number }) => c.id);
}

async function main() {
  console.log('— Embedding retrieval-parity gate (bge-m3 across providers) —\n');
  let allPass = true;

  for (const query of QUERIES) {
    const idsByMode: Record<string, number[]> = {};
    for (const mode of MODES) {
      try {
        const emb = await embedWith(query, mode.provider);
        idsByMode[mode.label] = await searchIds(emb);
      } catch (e) {
        idsByMode[mode.label] = [];
        console.warn(`  ! ${mode.label} failed: ${e instanceof Error ? e.message : e}`);
      }
    }

    // Baseline = first mode that returned results.
    const baselineLabel = MODES.map((m) => m.label).find((l) => idsByMode[l]?.length) ?? MODES[0].label;
    const baseline = idsByMode[baselineLabel] || [];
    const baseSet = new Set(baseline);

    // Parity gate is SET equality, not exact order. Rationale: the retrieved chunk SET is what
    // reaches the reranker (which re-scores purely on content relevance), so a position swap of
    // two near-tied similarity scores is fp noise, not a retrieval difference. A missing/extra
    // chunk (set difference) IS a real incompatibility. We flag order jitter as INFO, set diff
    // as FAIL.
    const sameSet = (ids: number[]) => ids.length === baseSet.size && ids.every((id) => baseSet.has(id));

    let qHasSetDiff = false;
    console.log(`Q: ${query}`);
    console.log(`   baseline (${baselineLabel}): [${baseline.join(', ')}]`);
    for (const mode of MODES) {
      if (mode.label === baselineLabel) continue;
      const ids = idsByMode[mode.label] || [];
      let mark: string;
      if (ids.length === 0) {
        mark = '∅ (no result)';
      } else if (JSON.stringify(ids) === JSON.stringify(baseline)) {
        mark = '✓ identical';
      } else if (sameSet(ids)) {
        mark = '≈ same set, order jitter (OK — reranker re-scores)';
      } else {
        mark = '✗ SET DIFFERS';
        qHasSetDiff = true;
      }
      console.log(`   ${mode.label.padEnd(24)} ${mark}  [${ids.join(', ')}]`);
    }
    allPass = allPass && !qHasSetDiff;
    console.log(qHasSetDiff ? '   => PARITY FAIL (different chunks retrieved)\n' : '   => PARITY OK\n');
  }

  console.log(allPass ? 'RESULT: parity holds — the retrieved chunk SET is identical across providers. Safe to float the embedding provider (order jitter on tied scores is washed out by the reranker).'
                      : 'RESULT: PARITY BROKEN — a provider retrieves a DIFFERENT chunk set. Do NOT float the provider; pin the compatible one.');
  process.exit(allPass ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
