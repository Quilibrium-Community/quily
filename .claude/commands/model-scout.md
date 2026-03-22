---
name: model-scout
description: Scout for better open-source LLM/embedding models on Chutes. Checks previous reports to avoid duplicating work.
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
  - Grep
  - AskUserQuestion
---

<objective>
Discover better or cheaper open-source models available on Chutes, avoiding duplicate work by checking previous scouting reports first.
</objective>

<process>

<step name="check-previous-reports">
**Check for existing scouting reports:**

Search `.agents/reports/` for previous model scout reports:
```bash
ls -la .agents/reports/*model-scout* 2>/dev/null || echo "none"
```

If previous reports exist, read the most recent one and extract:
1. **Date** of the last scout run
2. **Models already evaluated** (both tested and excluded)
3. **Current recommendations** still in play

Present a summary to the user:
```
Last scout: 2026-03-21
  Models tested: DeepSeek V3.2, Qwen3 Coder Next, Hermes 4 405B, ...
  Excluded: DeepSeek R1 0528 (reasoning model, too slow)
  Current recommendation: Qwen3 Coder Next (22/27)

Run a fresh scout anyway? This will discover any NEW models added to Chutes/OpenRouter since the last run.
  - Yes, full scout
  - Yes, but only show models NOT in the previous report
  - No, just review the existing report
```

If no previous reports exist, proceed directly to scouting.
</step>

<step name="choose-type">
**Determine what to scout:**

Ask the user:
- **LLM models** (default) — chat/completion models for the bot
- **Embedding models** — for RAG retrieval

Default to LLM unless specified otherwise.
</step>

<step name="run-scout">
**Run the model scout script:**

```bash
python scripts/model-scout.py --type <llm|embedding> --benchmark-count 10
```

Add `--benchmark` if the user wants quality testing (requires `OPENROUTER_API_KEY`):
```bash
python scripts/model-scout.py --benchmark --benchmark-count 10
```

**Important:** The script now auto-skips reasoning/thinking models (DeepSeek R1, QwQ, etc.) during benchmarking since they're too slow for chatbot use. They'll still appear in discovery but won't be benchmarked.

The script outputs to stdout. Capture and review the output.
</step>

<step name="diff-with-previous">
**If a previous report exists, highlight what's new:**

Compare the scout output against the previous report:
- **New models** not in the previous report (flag these clearly)
- **Models that improved** (higher invocations, new TEE support, etc.)
- **Models that disappeared** from Chutes since last scout

Present the diff:
```
New since last scout (2026-03-21):
  + ModelName 123B — now on Chutes, 45k invocations, TEE
  + AnotherModel 70B — new release, 2k invocations

Still available:
  Qwen3 Coder Next — invocations 11,990 → 28,400 (growing)
  DeepSeek V3.2 — invocations 187,199 → 201,000

Disappeared:
  - SomeModel 13B — no longer on Chutes
```
</step>

<step name="recommend">
**Make recommendations:**

Based on the scout results (and previous report context), recommend:
1. Which new models are worth benchmarking with `/benchmark`
2. Whether the current primary model should change
3. Any new embedding models worth testing for RAG

If there are strong candidates, ask if the user wants to run `/benchmark` on them now.
</step>

<step name="save-report">
**Save the updated report:**

Save to `.agents/reports/<date>-model-scout.md` (or `-model-scout-benchmark.md` if benchmarks were included).

If updating an existing report from the same day, update it in place rather than creating a duplicate.

Include:
- Date and scope of the scout
- Full candidate list with Chutes availability
- Any benchmark scores (if run)
- Exclusions and reasons (e.g., reasoning models skipped)
- Recommendations and next steps
</step>

</process>

<notes>
- The script requires internet access to query OpenRouter and Chutes APIs
- Benchmarking requires `OPENROUTER_API_KEY` in `.env`
- Reasoning/thinking models (DeepSeek R1, QwQ, etc.) are auto-skipped during benchmarking — they are too slow for interactive chatbot use
- Discovery without benchmarking is free and fast (~30 seconds)
- Benchmarking adds ~2 minutes per model tested
- The script outputs to stdout — save the report manually to `.agents/reports/`
</notes>
