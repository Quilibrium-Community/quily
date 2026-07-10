/**
 * Misura la latenza dei singoli stadi della pipeline RAG di /api/chat, chiamandoli
 * direttamente (senza auth/route). Serve per il baseline e il confronto before/after
 * (task 2026-07-10-chat-latency-optimization). Nessun valore di env viene stampato.
 *
 *   yarn measure:latency
 *
 * Nota: i valori assoluti da locale differiscono da Vercel (regione), ma il confronto
 * relativo before/after è valido.
 */
import 'dotenv/config';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { embed } from 'ai';
import { retrieveWithReranking } from '../src/lib/rag/retriever';
import { prepareQuery } from '../src/lib/rag/service';

const QUERY = 'How does Quilibrium consensus work and what is the hypergraph?';
const EMBEDDING_MODEL = process.env.OPENROUTER_EMBEDDING_MODEL || 'baai/bge-m3';
const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

async function time(label: string, fn: () => Promise<unknown>, runs = 3): Promise<number> {
  const ms: number[] = [];
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    await fn();
    ms.push(Math.round(performance.now() - t0));
  }
  const med = median(ms);
  console.log(`${label.padEnd(48)} median ${String(med).padStart(6)}ms   (runs: ${ms.join(', ')})`);
  return med;
}

async function ttftOpenRouter(pinned: boolean): Promise<void> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY non impostata');
  const controller = new AbortController();
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.NEXT_PUBLIC_DEFAULT_MODEL_ID || 'deepseek/deepseek-v4-flash',
      messages: [{ role: 'user', content: QUERY }],
      stream: true,
      max_tokens: 16,
      ...(pinned && { provider: { sort: 'latency' } }),
    }),
    signal: controller.signal,
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (decoder.decode(value).includes('"content"')) break;
  }
  controller.abort();
}

async function embedOnly(): Promise<void> {
  const apiKey = process.env.OPENROUTER_API_KEY!;
  const openrouter = createOpenRouter({ apiKey });
  await embed({ model: openrouter.textEmbeddingModel(EMBEDDING_MODEL), value: QUERY });
}

async function main() {
  console.log('— Baseline latenza pipeline Quily —\n');
  const ropts = {
    embeddingProvider: 'openrouter' as const,
    embeddingApiKey: process.env.OPENROUTER_API_KEY,
    cohereApiKey: process.env.COHERE_API_KEY,
  };
  await time('embedQuery (OpenRouter bge-m3)', () => embedOnly());
  await time('retrieveWithReranking (embed+pgvector+rerank)', () => retrieveWithReranking(QUERY, ropts));
  await time('prepareQuery (full RAG prep)', () =>
    prepareQuery({ query: QUERY, conversationHistory: [], ...ropts }));
  await time('TTFT chat OpenRouter (default routing)', () => ttftOpenRouter(false));
  await time('TTFT chat OpenRouter (sort:latency)', () => ttftOpenRouter(true));
}

main().catch((e) => { console.error(e); process.exit(1); });
