// Context-size comparison on live retrieval. Each case runs production
// retrieval twice: the current sizes and a wider final context. Every listed
// answer model answers both contexts with the same prompt code and history.
// The frames topic patch stays hidden, as in the other accuracy replays.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { getOpenRouterChatRouting } from '../../src/lib/openrouter-routing';
import { reasoningSettings } from '../../src/lib/openrouter-reasoning';
import { ANSWER_ONLY_INSTRUCTION } from '../../src/lib/rag/visibleText';
import { isBroadQuery } from '../../src/lib/rag/retriever';
import { normalizeQuery } from '../../src/lib/rag/queryNormalizer';
import { confirmation, controls, evidence, incident, selectionHoldout, type AccuracyCase } from './accuracy-cases';
import { answer, isHidden, loadHistory, retrievalTransport, type EvalRouting, type Message, type Trace } from './accuracy-replay';

type Input = { history: Message[]; prioritySources: Array<{ id: number; file: string }> };

async function main() {
  const { values } = parseArgs({ options: {
    archive: { type: 'string' }, output: { type: 'string' }, models: { type: 'string' },
    'max-usd': { type: 'string' }, only: { type: 'string' },
  } });
  assert(values.archive && values.output && values.models, 'Supply --archive, --output and --models');
  const budget = Number(values['max-usd']);
  assert(Number.isFinite(budget) && budget > 0, 'Supply --max-usd');
  process.env.OPENROUTER_ZDR = 'true';
  const policy = getOpenRouterChatRouting() as EvalRouting;
  assert.equal(policy?.zdr, true);
  assert.equal(reasoningSettings().reasoning?.enabled, false, 'Reasoning must be off');
  const apiKey = process.env.OPENROUTER_API_KEY;
  assert(apiKey && process.env.CLOUDFLARE_API_TOKEN && process.env.SUPABASE_SERVICE_ROLE_KEY, 'Load credentials');
  assert(!process.env.COHERE_API_KEY, 'Use Cloudflare reranking for parity with production');
  const models = values.models.split(',').map(model => model.trim()).filter(Boolean);
  const { prepareQuery, MAX_OUTPUT_TOKENS } = await import('../../src/lib/rag/service');
  const { inputs } = await loadHistory(values.archive);

  const cases: Array<{ test: AccuracyCase; input: Input }> = [
    ...incident.map((test, index) => ({ test, input: inputs[index] })),
    ...controls.map(test => ({ test, input: { history: [], prioritySources: [] } })),
    ...confirmation.map(test => ({ test, input: {
      history: test.previousUser ? [{ role: 'user' as const, content: test.previousUser }] : [], prioritySources: [] } })),
    ...selectionHoldout.map(test => ({ test, input: { history: [], prioritySources: [] } })),
  ].filter(({ test }) => !values.only || values.only.split(',').includes(test.id));

  let spent = 0;
  const originalFetch = globalThis.fetch;
  // Stop before a request once the reported spend reaches the cap. Answer
  // calls are sequential, so overshoot is bounded by one response.
  const send: typeof fetch = async (input, init) => {
    assert(spent < budget, `Spend cap reached ($${spent.toFixed(4)})`);
    const url = new URL(input instanceof Request ? input.url : String(input));
    const response = await originalFetch(input, init);
    if (response.ok && url.hostname === 'openrouter.ai') {
      const cost = (await response.clone().json().catch(() => null))?.usage?.cost;
      if (typeof cost === 'number') spent += cost;
    }
    return response;
  };
  const db = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin;
  await mkdir(values.output, { recursive: false });
  const save = (name: string, data: unknown) =>
    writeFile(`${values.output}/${name}.json`, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
  await save('manifest', { models, policy, cases: cases.map(({ test }) => test.id), maxUsd: budget,
    arms: { standard: 'production defaults', wide: 'narrow 15 -> 15 (no rerank cutoff), broad 25 -> 20' } });

  for (const { test, input } of cases) {
    const messages: Message[] = [...input.history, { role: 'user', content: test.question }];
    const broad = isBroadQuery(normalizeQuery(test.question));
    for (const arm of ['standard', 'wide'] as const) {
      const trace: Trace = { vector: [], priority: [], recent: [], stageErrors: [], embeddingCost: [] };
      globalThis.fetch = retrievalTransport(send, db, trace);
      const started = performance.now();
      const prepared = await prepareQuery({ query: test.question, conversationHistory: input.history,
        priorityDocIds: input.prioritySources.map(source => source.id), embeddingApiKey: apiKey,
        // Narrow: keep every candidate, which skips the reranker cutoff. Broad: keep 20.
        retrievalExperiment: arm === 'wide' ? { initialCount: broad ? 25 : 15, finalCount: broad ? 20 : 15 } : undefined,
      }).finally(() => { globalThis.fetch = originalFetch; });
      const retrievalMs = Math.round(performance.now() - started);
      assert(!trace.stageErrors.length, `Incomplete retrieval for ${test.id}: ${trace.stageErrors.join(', ')}`);
      assert(prepared.retrievedChunks.every(chunk => !isHidden(chunk.source_file)), 'Hidden source leaked');
      const anchors = evidence.filter(span => prepared.retrievedChunks.some(chunk => chunk.source_file === span.file &&
        [span.anchor, ...(span.alternativeAnchors ?? [])].some(anchor => chunk.content.includes(anchor))))
        .map(span => span.id);
      await save(`${test.id}-${arm}-retrieval`, { broad, retrievalMs, rerankFailure: trace.rerank?.failure ?? null,
        rerankInputs: trace.rerank?.texts.length ?? 0, anchors, final: prepared.retrievedChunks,
        contextChars: prepared.systemPrompt.length });
      for (const model of models) {
        const result = await answer(send, apiKey, policy, `${prepared.systemPrompt}\n\n${ANSWER_ONLY_INSTRUCTION}`,
          messages, MAX_OUTPUT_TOKENS, false, model);
        await save(`${test.id}-${arm}-${model.replace(/[/:]/g, '_')}`, { ...result, sources: prepared.retrievedChunks });
      }
      console.log(`${test.id} ${arm}: ${prepared.retrievedChunks.length} chunks, ${retrievalMs} ms, anchors [${anchors}], spent $${spent.toFixed(4)}`);
    }
  }
}

if (require.main === module) main().catch(error => {
  console.error(error instanceof Error ? `${error.name}: ${error.message.slice(0, 400)}` : 'Stopped');
  process.exitCode = 1;
});
