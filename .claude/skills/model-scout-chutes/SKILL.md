---
name: model-scout-chutes
description: Scout for better open-source LLM or embedding models hosted on Chutes (subscription pricing). Checks previous `.agents/reports/*model-scout-chutes*` reports first to avoid duplicating work, then runs `scripts/model-scout.py --provider chutes`, diffs against the previous report (new / changed / disappeared), and writes an updated report. Use ONLY when the user explicitly asks to scout Chutes models, find new Chutes models, look for better LLMs on Chutes, or update the Chutes model report. For OpenRouter scouting use `model-scout-openrouter` instead. For head-to-head testing of candidate models use `benchmark`. Do NOT auto-fire on tangential model mentions.
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
  - Grep
  - AskUserQuestion
---

<objective>
Discover better or cheaper open-source models available on Chutes (subscription pricing — cost is informational, not a filter), avoiding duplicate work by checking previous scouting reports first.
</objective>

<process>

<step name="check-previous-reports">
**Check for existing scouting reports:**

Search `.agents/reports/` for previous Chutes scout reports (older reports may be named `*model-scout*` without a provider suffix — those are Chutes reports from before the OpenRouter/Chutes split):
```bash
ls -la .agents/reports/*model-scout-chutes* .agents/reports/*model-scout*.md 2>/dev/null | grep -v openrouter || echo "none"
```

If previous reports exist, read the most recent one and extract:
1. **Date** of the last scout run
2. **Models already evaluated** (both tested and excluded)
3. **Current recommendations** still in play

Present a brief summary to the user, then ask:
- Yes, full scout
- Yes, but only show models NOT in the previous report
- No, just review the existing report

If no previous Chutes reports exist, proceed directly to scouting.
</step>

<step name="choose-type">
**Determine what to scout:**

Ask the user:
- **LLM models** (default) — chat/completion models for the bot
- **Embedding models** — for RAG retrieval (Chutes hosts the BGE family + others)

Default to LLM unless specified otherwise.
</step>

<step name="run-scout">
**Run the model scout script in Chutes mode:**

```bash
python scripts/model-scout.py --provider chutes --type <llm|embedding> --benchmark-count 10
```

Add `--benchmark` if the user wants quality testing (requires `OPENROUTER_API_KEY` for the benchmark calls):
```bash
python scripts/model-scout.py --provider chutes --benchmark --benchmark-count 10
```

The script auto-skips reasoning/thinking models (DeepSeek R1, QwQ, etc.) during benchmarking — they are too slow for chatbot use. They still appear in discovery.

The script outputs to stdout. Capture and review the output.
</step>

<step name="diff-with-previous">
**If a previous Chutes report exists, highlight what's new:**

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
1. Which new models are worth benchmarking with the `benchmark` skill
2. Whether the current primary model should change
3. Any new embedding models worth testing for RAG

If there are strong candidates, ask if the user wants to run the `benchmark` skill on them now.
</step>

<step name="save-report">
**Save the updated report:**

Save to `.agents/reports/<date>-model-scout-chutes.md` (or `-model-scout-chutes-benchmark.md` if benchmarks were included).

If updating an existing report from the same day, update it in place rather than creating a duplicate.

Include:
- Date and scope of the scout (Chutes, LLM vs embedding)
- Full candidate list with Chutes availability, invocations, TEE flag
- Any benchmark scores (if run)
- Exclusions and reasons (e.g., reasoning models skipped)
- Recommendations and next steps
</step>

</process>

<notes>
- The script requires internet access to query OpenRouter (for discovery) and Chutes APIs (for cross-check)
- Benchmarking requires `OPENROUTER_API_KEY` in `.env`
- Reasoning/thinking models (DeepSeek R1, QwQ, etc.) are auto-skipped during benchmarking — they are too slow for interactive chatbot use
- Discovery without benchmarking is free and fast (~30 seconds)
- Benchmarking adds ~2 minutes per model tested
- The script outputs to stdout — save the report manually to `.agents/reports/`
- Chutes uses subscription pricing — `$/M` figures are shown for reference only, not as a filter
- Use `model-scout-openrouter` instead if you want pay-as-you-go pricing comparisons across all OpenRouter open-source models
</notes>

---
*Last updated: 2026-06-03*
