---
type: report
title: "Model Scout — LLM Benchmark Results"
ai_generated: true
reviewed_by: null
created: 2026-03-21
updated: 2026-03-22
---

# Model Scout — LLM Benchmark Results

> Generated: 2026-03-21 (final run — 9 tests including hallucination, correction handling, and boundary tests)

## Context

- **Current primary:** DeepSeek V3.1 (`chutes-deepseek-ai-deepseek-v3-1-tee`), $0.200/M in, 181k invocations
- **Provider:** Chutes (subscription model — cost is informational, not a filter)
- **Goal:** Find the most capable open-source model available on Chutes

## Benchmark Suite (9 tests, 27 points max)

| Test | Type | What it tests |
|------|------|--------------|
| factual | Knowledge | "What is Quilibrium?" — must mention decentralized, privacy, protocol |
| technical | Knowledge | Consensus mechanism — must mention proof-of-work |
| product | Knowledge | QKMS product knowledge |
| no-staking | Anti-hallucination | "How do I stake QUIL?" — Quilibrium has NO staking |
| no-solidity | Anti-hallucination | "Deploy Solidity on Quilibrium?" — No EVM/Solidity |
| no-price | Anti-hallucination | "What will QUIL be worth in 2027?" — must decline |
| concise | Instruction following | "In exactly one sentence..." — tests brevity |
| off-topic | Boundary | "What do you think of Solana?" — should redirect |
| correction | Correction handling | User says "that's wrong" — should acknowledge, not double down |

## Results — Top 10 Models

| Rank | Model | Size | Ctx | TEE | Invocations | Score | vs Primary |
|------|-------|------|-----|-----|-------------|-------|------------|
| ~~1~~ | ~~DeepSeek R1 0528~~ | ~~685B MoE~~ | ~~163k~~ | ~~Yes~~ | ~~76,131~~ | ~~22/27~~ | ~~EXCLUDED~~ |
| 1 | **Qwen3 Coder Next** | 480B MoE | 262k | Yes | 11,990 | **22/27** | CHEAPER |
| 3 | DeepSeek V3.2 | 685B MoE | 163k | Yes | 187,199 | 21/27 | PRICIER |
| 3 | DeepSeek V3.1 Terminus | 685B MoE | 163k | Yes | 36,703 | 21/27 | SIMILAR |
| 3 | Hermes 4 405B | 405B dense | 131k | Yes | 878 | 21/27 | PRICIER |
| 3 | Qwen3 235B Thinking 2507 | 235B MoE | 131k | No | 4,351 | 21/27 | CHEAPER |
| 3 | Qwen3 VL 235B | 235B MoE | 262k | No | 318 | 21/27 | PRICIER |
| 8 | Qwen3 Coder 480B A35B | 480B MoE | 262k | Yes | 11,990 | 20/27 | CHEAPER |
| 9 | Qwen3.5 397B A17B | 397B MoE | 262k | Yes | 10,031 | 15/27 | PRICIER |
| — | Qwen3 235B A22B | 235B MoE | 131k | Yes | 193,154 | 0/27 | CHEAPER |

## Analysis

### Top scorer: 22/27

**DeepSeek R1 0528** — **EXCLUDED from testing.** Reasoning model with extremely slow response times, making it unsuitable for a chatbot. Chain-of-thought overhead adds unacceptable latency for interactive use. Removed from candidate pool.

**Qwen3 Coder Next** (480B) — Best viable performer at 22/27. Surprisingly strong despite being labeled a "coder" model. 262k context window, TEE, and cheaper on pay-as-you-go. Strong general Q&A capability.

### Cluster at 21/27 (5 models)

**DeepSeek V3.2** — Same architecture as our current V3.1, newest version. Highest adoption (187k invocations). Solid all-around.

**DeepSeek V3.1 Terminus** — Variant of our current model. Similar cost. Worth testing if it handles edge cases differently than standard V3.1.

**Hermes 4 405B** — Dense model (all 405B params active). Low invocation count (878) suggests it's newer. Perfect if you want maximum per-token compute.

**Qwen3 235B Thinking 2507** — Good performer but no TEE.

**Qwen3 VL 235B** — Vision-language variant. No TEE, low invocations. Interesting if we ever need image understanding.

### Underperformers

**Qwen3.5 397B A17B** (15/27) — Despite being Qwen's newest/largest, scored lower. Likely struggles with the hallucination and boundary tests — newer models sometimes have weaker instruction following until they're fine-tuned more.

**Qwen3 235B A22B** (0/27) — Persistent 0-score anomaly. This model has 193k invocations (highest of any candidate) so it's clearly functional, but something about its output format is incompatible with our scoring. The "Thinking 2507" variant of the same model scores 21/27, so this is likely a formatting/output issue, not a quality issue.

## Recommendations

### Primary model candidates (in order of preference)

1. **Qwen3 Coder Next** — Joint highest score (22/27), 262k context, TEE, cheaper. Despite "coder" branding, excels at general Q&A. Test this first.

2. **DeepSeek V3.2** — Most mature option (187k invocations), 21/27, TEE. Safe upgrade from V3.1.

3. ~~**DeepSeek R1 0528**~~ — **Excluded.** Too slow for chatbot use (reasoning model latency). Not a viable candidate.

### Next steps

1. Test Qwen3 Coder Next and DeepSeek V3.2 on Chutes directly (not via OpenRouter) using the full eval suite (`scripts/eval/`)
2. Check if the Qwen3 235B A22B (non-thinking) output format issue would also affect our chat pipeline
3. Consider adding Qwen3 Coder Next to the fallback list in `chuteDiscovery.ts`

### Embedding models

Two new candidates found on Chutes:
- **Qwen3-Embedding-0.6B** (7,770 invocations) — lightweight, good adoption
- **Qwen3-Embedding-8B** (2,740 invocations) — larger, potentially better quality

Worth evaluating against current BGE-M3 for RAG retrieval quality.

---

*Generated by `scripts/model-scout.py --benchmark --benchmark-count 10`*
*Benchmark: 9 tests (factual, technical, product, anti-hallucination ×3, instruction following, boundary, correction handling)*
*Updated: 2026-03-22 — DeepSeek R1 excluded (too slow for chatbot)*
