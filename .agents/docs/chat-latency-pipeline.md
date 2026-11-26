---
type: doc
title: "Chat latency pipeline: what drives time-to-first-token and the guardrails"
description: "How /api/chat keeps first-token latency low: LLM provider pinning by latency, embedding provider pinning, aggressive rerank timeouts with similarity fallback, per-phase timing logs, and the tools to measure regressions."
status: done
ai_generated: true
reviewed_by: null
created: 2026-07-10
updated: 2026-07-10
related_docs:
  - "rag-knowledge-base-workflow.md"
  - "rag-query-decomposition.md"
  - "cloudflare-workers-ai-reranker.md"
related_tasks:
  - "2026-07-10-chat-latency-optimization.md"
---

# Chat latency pipeline

> **⚠️ AI-Generated**: May contain errors. Verify before use.

How `/api/chat` keeps the time to the first visible token low, and the guardrails that protect it from
regressions. For the diagnosis and before/after numbers see the
[report](../reports/2026-07-10-chat-latency-optimization.md).

## The critical path

On the production hot path (`NEXT_PUBLIC_FREE_MODE=true`, server OpenRouter key), the balance check is
skipped, so the serial chain before the first token is:

```
[Turnstile: cookie-cached, usually skipped]
  → embed query        (OpenRouter baai/bge-m3)
  → pgvector RPC       (Supabase match_document_chunks_chutes)
  → rerank             (Cohere, else Cloudflare, else similarity fallback)
  → LLM streamText     (OpenRouter, streamed token-by-token)
first_token = embed + pgvector + rerank + LLM-TTFT   (all serial)
```

The LLM call dominates. Measured medians (local, 2026-07-10):

| Component | Expected | If much worse, look at… |
|-----------|----------|-------------------------|
| embed query (OpenRouter bge-m3) | ~0.5-0.7s | the OpenRouter provider pool (see guardrail 2) |
| pgvector RPC (Supabase) | ~0.2-0.7s | Supabase region / load |
| rerank (Cloudflare) | ~0.3-0.5s (cap 1.2s) | Workers AI queue; the fallback covers it |
| LLM TTFT (deepseek-v4-flash) | ~0.6-1.0s with sort:latency | the chat provider pool (guardrail 1) |

## The guardrails

### 1. LLM provider routing by latency (the biggest win)

Web and Discord use the same [OpenRouter routing policy](../../src/lib/openrouter-routing.ts).
OpenRouter ranks providers for the requested model by latency and can fail over between eligible
providers. In the original web measurements, default routing had a median time to first token of
~4.4s and a worst run of ~11s. Latency sorting brought the median down to ~0.7s.

The quantization allowlist (`fp8, fp16, bf16, fp32, int8, unknown`) **excludes fp4** on purpose:
DeepInfra and AtlasCloud serve `deepseek-v4-flash` at fp4 (faster but degraded quality), and a naked
latency sort could route there. The filter keeps the speed without the quality trade.

Set the same `OPENROUTER_SORT`, `OPENROUTER_MAX_LATENCY_P90`, `OPENROUTER_IGNORE`,
`OPENROUTER_ZDR` and `OPENROUTER_REASONING` values on both deployments. A blank
`OPENROUTER_SORT` uses OpenRouter's default routing with the configured ZDR policy.
The p90 setting is a provider preference for time to first token. Discord also gives each
non-final model half the remaining time before moving to the next model.

Discord originally pinned SiliconFlow and DeepInfra after DeepSeek V3.2 requests took
78–142 seconds against a 60-second deadline. Neither provider was listed as ZDR-eligible for
DeepSeek V4 Flash 0731 or V4.1 Flash 1017 when checked on November 26, 2026.
For production model parity, clear any inherited PM2 `BOT_MODEL` override or match it to the
web app's `FREE_MODE_DEFAULT_MODEL`. Both paths default to the V4 Flash family alias.

### 2. Embedding provider routing (removes the slow-provider tail)

The query embedding ([src/lib/rag/retriever.ts](../../src/lib/rag/retriever.ts) `generateEmbedding`)
pins `provider: { order: ['SiliconFlow', 'DeepInfra'] }`. This runs on **every** query. Unpinned, the
embed measured ~870ms median with high variance; pinned, ~633ms with tight variance.

⚠️ **Constraint:** same model for ingest and query — the vectors must stay compatible with the index.
Changing the *provider* of the same model is safe because `baai/bge-m3` is deterministic; this was
verified by a retrieval-parity check (identical chunk IDs before/after across multiple queries).
Changing the *model* would require a full re-ingest.

Toggle: `OPENROUTER_EMBED_ORDER=""` disables pinning; a comma-separated list overrides the order.

### 3. Aggressive rerank timeout with similarity fallback

Reranking is a fail-safe refinement, not a hard dependency: on any error or timeout, retrieval falls
back to similarity ordering. Both rerankers now cap at **1200ms** (`RERANK_TIMEOUT_MS`):

- **Cloudflare** ([cloudflare-reranker.ts](../../src/lib/rag/cloudflare-reranker.ts)): the timeout is
  now a parameter (was a hard-coded 10s). Measured p50 ~270-515ms, but with an ~8.5s pathological tail
  that the old 10s ceiling let through and block the whole response.
- **Cohere** ([retriever.ts](../../src/lib/rag/retriever.ts)): the AI SDK `rerank()` exposes no timeout,
  so it's wrapped in a `Promise.race` against a 1200ms timer. On timeout it falls through to Cloudflare,
  then to similarity — the existing error path.

1200ms is ~2-4x the observed p50: real reranks pass, only the pathological tail is clipped.

### 4. Per-phase timing log

At the first streamed token, the route logs one line: `[chat] timing rag=..ms first_token=..ms`
(visible in Vercel runtime logs). No user text, only milliseconds. Wired into both the OpenRouter path
(`streamText` `onChunk`) and the Chutes path (first content chunk) so `first_token` reflects real TTFT
regardless of provider.

## Tools

- **`yarn measure:latency`** ([scripts/measure-latency.ts](../../scripts/measure-latency.ts)):
  per-stage medians (embed, retrieve, prepareQuery, TTFT with and without `sort:latency`). Re-run after
  any change to the pipeline. Absolute values differ from Vercel (region), but the relative before/after
  comparison is valid.

## Playbook: "the bot got slow again"

1. Check the `[chat] timing` lines in Vercel runtime logs — which phase grew?
2. `rag` high → run `yarn measure:latency`; the usual suspect is the embedding provider (guardrail 2)
   or a slow pgvector RPC. The OpenRouter provider pool changes over time, so the pinned preference can
   age — re-check which providers serve `baai/bge-m3` fast.
3. `first_token` high but `rag` normal → the chat provider. Check
   `GET openrouter.ai/api/v1/models/<slug>/endpoints` and the effect of `OPENROUTER_SORT`.
4. Everything low in logs but users perceive slowness → client-side rendering/streaming, not this pipeline.

*Last updated: 2026-11-26*
