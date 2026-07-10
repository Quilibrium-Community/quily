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

The web streaming path ([app/api/chat/route.ts](../../app/api/chat/route.ts), OpenRouter branch) pins
`provider: { sort: 'latency', quantizations: [...] }`. Default OpenRouter load-balancing measured a
TTFT p50 of ~4.4s with a worst run of ~11s; `sort: 'latency'` cuts p50 to ~0.7s and removes the tail.

The quantization allowlist (`fp8, fp16, bf16, fp32, int8, unknown`) **excludes fp4** on purpose:
DeepInfra and AtlasCloud serve `deepseek-v4-flash` at fp4 (faster but degraded quality), and a naked
latency sort could route there. The filter keeps the speed without the quality trade.

Toggle: `OPENROUTER_SORT=""` disables the sort via env.

> Note: the Discord/bot path ([src/lib/rag/service.ts](../../src/lib/rag/service.ts)) already pinned
> providers via `OPENROUTER_PRIMARY_PROVIDER_ORDER` + `allow_fallbacks: false`. This guardrail closes
> the same gap on the web path, which is the one users actually hit.

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

*Last updated: 2026-07-10*
