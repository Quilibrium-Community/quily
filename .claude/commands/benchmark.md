---
name: benchmark
description: Run the eval suite across multiple models and compare results. Use for model selection decisions.
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
  - Grep
  - AskUserQuestion
  - WebFetch
---

<objective>
Run the full eval suite against multiple candidate models, then compare results side-by-side to help decide whether to switch from the current primary model.
</objective>

<process>

<step name="identify-models">
**Determine which models to benchmark:**

Ask the user which models they want to test. They may provide:
- Exact model IDs (OpenRouter or Chutes slugs)
- Model names (you'll need to resolve the IDs)

**Important:** Exclude reasoning/thinking models (DeepSeek R1, QwQ, models with "thinking" in the name) — they are too slow for chatbot use. If the user suggests one, warn them and recommend skipping it.

The **baseline model** (current primary) is always included automatically:
- Chutes: `chutes-deepseek-ai-deepseek-v3-1-tee` (DeepSeek V3.1)
- OpenRouter: `deepseek/deepseek-chat-v3-0324`

**Resolving model IDs:**

For **Chutes** models, slugs follow the pattern `chutes-<org>-<model>-tee` (TEE) or `chutes-<org>-<model>`. Common mappings:
- DeepSeek V3.1: `chutes-deepseek-ai-deepseek-v3-1-tee`
- DeepSeek V3.2: `chutes-deepseek-ai-deepseek-v3-2-tee`
- DeepSeek R1: `chutes-deepseek-ai-deepseek-r1-tee`
- DeepSeek R1 0528: `chutes-deepseek-ai-deepseek-r1-0528-tee`
- Qwen3 Coder Next: `chutes-qwen-qwen3-coder-next-tee`
- Kimi K2.5: `chutes-moonshotai-kimi-k2-5-tee`

If unsure about a Chutes slug, verify by checking the Chutes API:
```bash
curl -s "https://chutes.ai/app/api/chutes?public=true&limit=20&search=<model-name>" | python3 -c "import json,sys; [print(c['slug']) for c in json.load(sys.stdin).get('data',[])]"
```

For **OpenRouter** models, IDs look like `deepseek/deepseek-r1-0528`. Check at openrouter.ai/models if unsure.

Present the resolved model list to the user for confirmation:
```
Benchmark plan:
  Baseline: chutes-deepseek-ai-deepseek-v3-1-tee (DeepSeek V3.1 — current primary)
  Candidate 1: chutes-deepseek-ai-deepseek-r1-0528-tee (DeepSeek R1 0528)
  Candidate 2: chutes-qwen-qwen3-coder-next-tee (Qwen3 Coder Next)
  Candidate 3: chutes-deepseek-ai-deepseek-v3-2-tee (DeepSeek V3.2)

Provider: chutes
Judge: Claude (via collect mode — $0 cost)
Suite: full (34 tests)

Confirm? (y/adjust)
```
</step>

<step name="choose-judge">
**Determine judging method:**

Two options:
1. **Automated judge** — Uses OpenRouter API key to call Claude as judge (~$0.15/run per model). Fast but costs money.
2. **Collect + Claude judge** — Collects all responses, then Claude Code acts as judge in-session. Free but requires more interaction.

For multi-model benchmarks, recommend **collect mode** since we're running N models and automated judging would cost ~$0.15 × N.

Check if `OPENROUTER_API_KEY` is set:
```bash
grep -c "OPENROUTER_API_KEY" .env 2>/dev/null || echo "0"
```

If set, offer both options. If not, use collect mode.
</step>

<step name="ensure-server">
**Ensure the dev server is running:**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/ 2>/dev/null || echo "down"
```

If not running, tell the user to start it:
```
Dev server needed on port 4000. Start with:
  NEXT_PUBLIC_FREE_MODE=true yarn dev -p 4000
```

Wait for confirmation before proceeding.
</step>

<step name="run-evals">
**Run the eval suite for each model sequentially:**

For each model (baseline first, then candidates):

```bash
yarn eval:run --provider <provider> --model <model-slug> --collect --auto-start --url http://localhost:4000
```

Or for automated judge mode:
```bash
yarn eval:run --provider <provider> --model <model-slug> --auto-start --url http://localhost:4000
```

After each run, report progress:
```
✓ Model 1/4: DeepSeek V3.1 (baseline) — collected 34 responses
✓ Model 2/4: DeepSeek R1 0528 — collected 34 responses
  Running 3/4: Qwen3 Coder Next...
```

**Important:** If a model errors on most tests (e.g., 503s from Chutes), report it and skip:
```
⚠ DeepSeek R1 0528: 28/34 tests returned errors (likely unavailable on Chutes)
  Skip this model? (y/n)
```
</step>

<step name="judge">
**Judge all collected responses:**

If using collect mode, for each model's judgment file:
1. Read the judgment file
2. For each criterion needing judgment, evaluate based on the response text and rubric
3. Fill in passed/score/reasoning
4. Run `yarn eval judge <judgment-file>` to produce the scored report

If using automated judge mode, reports are already scored — skip this step.
</step>

<step name="compare">
**Generate comparison report:**

Read all JSON reports from `./results/` for this benchmark session. Build a comparison table:

```
╔══════════════════════════════════════════════════════════════╗
║  Model Benchmark Comparison — <date>                        ║
╠══════════════════════════════════════════════════════════════╣

Overall Results:
┌────────────────────────┬───────┬────────┬─────────┬────────┐
│ Model                  │ Pass  │ Score  │ Latency │ Errors │
├────────────────────────┼───────┼────────┼─────────┼────────┤
│ DeepSeek V3.1 (base)   │ 30/34 │ 88.2%  │ 2.1s    │ 0      │
│ DeepSeek R1 0528       │ 32/34 │ 92.1%  │ 4.8s    │ 0      │
│ Qwen3 Coder Next       │ 31/34 │ 90.5%  │ 1.9s    │ 0      │
│ DeepSeek V3.2          │ 31/34 │ 89.7%  │ 2.3s    │ 0      │
└────────────────────────┴───────┴────────┴─────────┴────────┘

Category Breakdown:
┌────────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Category               │ V3.1 (base)  │ R1 0528      │ Qwen3 Coder  │ V3.2         │
├────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ factual (9)            │ 9/9          │ 9/9          │ 8/9          │ 9/9          │
│ hallucination (14)     │ 11/14        │ 13/14        │ 12/14        │ 12/14        │
│ multi_hop (6)          │ 5/6          │ 5/6          │ 6/6          │ 5/6          │
└────────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

Head-to-Head: Tests Where Models Differ:
  nodeops-port-numbers:      V3.1 ✓  R1 ✓  Qwen ✗  V3.2 ✓
  techalluc-metavm-acronym:  V3.1 ✗  R1 ✓  Qwen ✓  V3.2 ✗
  ...
```

Focus the analysis on:
1. **Hallucination category** — this is the primary decision factor
2. **Node ops accuracy** — second priority
3. **Tests where models differ** — these are the discriminating tests
4. **Latency** — tie-breaker between similar scores

Provide a clear recommendation:
```
Recommendation:
  [Model X] scores +N points over baseline, primarily from better hallucination
  resistance on [specific tests]. Latency is [comparable/slower/faster].

  Tradeoff: [any downsides — e.g., reasoning model = slower, or lower factual score]

  Verdict: [Switch / Stay / Test more]
```
</step>

<step name="save-report">
**ALWAYS save a comparison report — this step is mandatory:**

Save to `.agents/reports/<date>-model-benchmark.md` using this frontmatter:

```yaml
---
type: report
title: "Model Benchmark — Full Eval Suite (<N> tests)"
ai_generated: true
reviewed_by: null
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
---
```

The report MUST include:
1. **Context** — current primary model, test suite size, goal
2. **Overall results table** — rank, model, pass rate, avg score, category breakdown, latency
3. **Category breakdown tables** — per-test pass/fail for hallucination and node ops categories
4. **Failure analysis** — for each model, list every failure with a one-line explanation
5. **Key insights** — patterns observed (e.g., "repeat-to-deny" problem, citation issues)
6. **Recommendation** — clear verdict (Switch/Stay/Test more) with reasoning

If the user wants to switch models, tell them the exact config change needed:
```
To switch primary model, update:
  src/lib/chutes/chuteDiscovery.ts — change CURATED_LLM_MODELS[0].slug
  src/lib/rag/service.ts — update CHUTES_DEFAULT_MODEL
```
</step>

</process>

<notes>
- A full 34-test run takes 3-5 minutes per model depending on latency
- Collect mode is free; automated judge costs ~$0.15/model via OpenRouter
- The dev server must run with `NEXT_PUBLIC_FREE_MODE=true` for Chutes provider
- Chutes models may return 503 if overloaded — the runner handles this gracefully
- For OpenRouter, the runner now passes `apiKey` in the request body (use `--api-key` flag)
- **Skip reasoning/thinking models** (e.g., DeepSeek R1, QwQ, models with "thinking" in the name). These are too slow for chatbot use — chain-of-thought adds unacceptable latency for interactive conversations. If a user proposes one, flag it and recommend skipping unless they explicitly want to test it anyway.
</notes>
