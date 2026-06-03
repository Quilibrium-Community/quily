---
name: benchmark
description: Run the Quily QA eval suite (45-test full or 9-test focused) across multiple candidate LLM models and compare results side-by-side to inform model-selection decisions. Includes a baseline (current primary), candidate models, latency, pass-rate, category breakdowns (hallucination / factual / multi-hop), head-to-head discriminating tests, and a switch/stay/test-more verdict. Saves a comparison report to `.agents/reports/<date>-model-benchmark.md`. Use ONLY when the user explicitly asks to benchmark models, compare models, run a multi-model eval, or decide whether to switch the primary model. Do NOT auto-fire on tangential model mentions — this is a long-running operation (multiple minutes per model) and may cost money.
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
- Chutes: `chutes-deepseek-ai-deepseek-v3-2-tee` (DeepSeek V3.2)
- OpenRouter: `deepseek/deepseek-v3.2`

Sources of truth in code (update these refs if the primary ever moves):
- `src/lib/rag/service.ts:72` (`CHUTES_DEFAULT_MODEL`)
- `src/lib/openrouter.ts:12` (`DEFAULT_MODEL_ID`)

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
  Baseline: chutes-deepseek-ai-deepseek-v3-2-tee (DeepSeek V3.2 — current primary)
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

<step name="run-evals">
**Run the eval suite for each model sequentially using `--direct` mode (preferred):**

`--direct` runs RAG + LLM in-process — no dev server needed, ~5× less RAM than `yarn dev`, and crash-resistant. It's the canonical path for benchmarking. The legacy HTTP path is still available (see "Legacy HTTP path" notes below) but should NOT be used for multi-model benchmark runs — the dev server's Tailwind error-spam has crashed the machine during long runs.

For each model (baseline first, then candidates):

```bash
yarn eval run --direct --provider openrouter --model <model-id> \
  --collect --suite scripts/eval/test-suite.yaml \
  --concurrency 2 --timeout 120000 --output ./results
```

Notes on the flags:
- `--direct` — bypasses the dev server entirely. **OpenRouter only** (Chutes auth chain not ported; for Chutes benchmarks fall back to HTTP path).
- `--concurrency 2` — sane default. Bumping to 3 helps on fast providers but increases memory spikes during multi-model runs.
- `--timeout 120000` — 2-min ceiling per test. Full suite takes 4-8 min per model depending on model latency.

After each run, report progress:
```
✓ Model 1/3: DeepSeek V3.2 (baseline) — collected 45 responses in 336s
✓ Model 2/3: DeepSeek V4 Flash — collected 45 responses in 247s
  Running 3/3: DeepSeek V4 Pro...
```

**Important:** If a model errors on most tests, report it and skip:
```
⚠ <model>: N/45 tests returned errors (likely temporarily unavailable)
  Skip this model? (y/n)
```

### Legacy HTTP path (only when needed)

If you need to exercise the full production route (Turnstile, sessions, cookies, fallback chain, Chutes auth), use the HTTP path:

```bash
# Terminal 1 — start dev server
NEXT_PUBLIC_FREE_MODE=true yarn dev -p 4000

# Terminal 2 — run eval against it
yarn eval run --provider <chutes|openrouter> --model <model-id> \
  --collect --url http://localhost:4000 --suite scripts/eval/test-suite.yaml \
  --concurrency 2 --timeout 120000 --output ./results
```

Caveats with the HTTP path:
- The repo has a pre-existing Tailwind parent-dir resolution bug that floods stderr; over long runs this has caused OOM/freeze. If using HTTP path, run one model at a time and avoid background polling loops.
- Cold-start to first-eval-ready is ~25-30s. Manually warm the API once before starting: `curl -X POST http://localhost:4000/api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"hi"}],"provider":"openrouter","model":"deepseek/deepseek-v3.2"}' -m 60`.
</step>

<step name="judge">
**Judge all collected responses:**

If using collect mode, for each model's judgment file:
1. Read the judgment file
2. For each criterion needing judgment, evaluate based on the response text and rubric

**Speed tip — parallelize via subagents:** for multi-model runs, dispatch one Sonnet subagent per judgment file (e.g. 3 agents for a 3-model benchmark). Each agent fills its file in-place. ~7 min wall-clock for ~150 judgments instead of single-threaded.
3. Fill in passed/score/reasoning
4. Run `yarn eval judge <judgment-file>` to produce the scored report

If using automated judge mode, reports are already scored — skip this step.
</step>

<step name="compare">
**Generate comparison report:**

Read all JSON reports from `./results/` for this benchmark session. Build a comparison table showing overall results (pass / score / latency / errors per model), category breakdown (factual, hallucination, multi_hop), and head-to-head tests where models differ.

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
- The full suite is **45 tests** (`scripts/eval/test-suite.yaml`); the focused suite is 9 tests (`scripts/eval/test-suite-focused.yaml`, which is the default if `--suite` is omitted).
- A full 45-test run takes ~5-10 minutes per model depending on latency and concurrency (`--concurrency 3` is the default in the harness; bump to `--concurrency 5` on a fast OpenRouter provider for ~30% speedup).
- Collect mode is free; automated judge costs ~$0.15/model via OpenRouter.
- The dev server must run with `NEXT_PUBLIC_FREE_MODE=true` for Chutes provider.
- Chutes models may return 503 if overloaded — the runner handles this gracefully.
- For OpenRouter, the runner now passes `apiKey` in the request body (use `--api-key` flag).
- **Skip reasoning/thinking models** (e.g., DeepSeek R1, QwQ, models with "thinking" in the name). These are too slow for chatbot use — chain-of-thought adds unacceptable latency for interactive conversations. If a user proposes one, flag it and recommend skipping unless they explicitly want to test it anyway.

## Operational lessons (read before kicking off a run)

These come from real failure modes hit in past sessions — saves debugging time.

1. **Don't trust the dev server's "Ready in Xs" log line.** Next.js prints that the moment the listener binds, well before the first page compiles. The root page `/` can still hang for 30-60s while Turbopack compiles. The harness's reachability check now pings `/api/chat` with OPTIONS (which doesn't need a page render); if a future change breaks it, the easiest first step is to manually `curl -X POST http://localhost:4000/api/chat -d '{"messages":[{"role":"user","content":"hi"}],"provider":"openrouter","model":"deepseek/deepseek-v3.2"}'` to confirm reachability and warm the route. 14-15s cold for a first hit is normal on this repo.

2. **Tailwind resolution errors in `yarn dev` output are noisy but non-fatal.** You'll see `Error: Can't resolve 'tailwindcss' in 'd:\GitHub\Quilibrium'` spam — this is the parent directory probe and only breaks the home page render. `/api/chat` is unaffected.

3. **Start the dev server yourself, in the background.** Don't ask the user. Pattern that works:
   ```bash
   NEXT_PUBLIC_FREE_MODE=true yarn dev -p 4000   # run_in_background: true
   ```
   Then warm and verify the API with one POST before launching the eval. Total cold-start to first-eval-ready: ~25-30s.

4. **Sources of truth for the current primary model** (verify these BEFORE writing scout/benchmark reports — otherwise stale references propagate):
   - `src/lib/openrouter.ts:12` → `DEFAULT_MODEL_ID`
   - `src/lib/rag/service.ts:72` → `CHUTES_DEFAULT_MODEL`
   - `scripts/model-scout.py:53` → `CURRENT_LLM_MODELS` (this one has drifted before; double-check).

5. **For full-suite (45 tests) collect-mode runs, `--concurrency 3` and `--timeout 120000` are sane defaults.** Increasing concurrency to 5 helps with fast OpenRouter providers (DeepInfra, StreamLake); on slower ones it can trigger rate-limit 429s.

6. **OpenRouter free-mode runs need both env var AND flag.** Set `NEXT_PUBLIC_FREE_MODE=true` on the dev server (route auth) AND pass `--api-key $OPENROUTER_API_KEY` to the harness — the harness no longer auto-reads `.env` for the API key.
</notes>

---
*Last updated: 2026-06-03*
