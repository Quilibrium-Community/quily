---
name: model-scout-openrouter
description: Scout for better or cheaper open-source LLM/embedding models on OpenRouter. Checks previous reports to avoid duplicating work.
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
  - Grep
  - AskUserQuestion
---

<objective>
Discover better or cheaper open-source models available on OpenRouter (pay-as-you-go pricing), avoiding duplicate work by checking previous scouting reports first.
</objective>

<process>

<step name="check-previous-reports">
**Check for existing scouting reports:**

Search `.agents/reports/` for previous OpenRouter scout reports:
```bash
ls -la .agents/reports/*model-scout-openrouter* 2>/dev/null || echo "none"
```

If previous reports exist, read the most recent one and extract:
1. **Date** of the last scout run
2. **Models already evaluated** (both tested and excluded)
3. **Current recommendations** still in play

Present a brief summary to the user, then ask:
- Yes, full scout
- Yes, but only show models NOT in the previous report
- No, just review the existing report

If no previous OpenRouter reports exist, proceed directly to scouting.
</step>

<step name="choose-type">
**Determine what to scout:**

Ask the user:
- **LLM models** (default) — chat/completion models for the bot
- **Embedding models** — for RAG retrieval (note: OpenRouter does not list many embedding models; the script will fall through to Chutes for embeddings)

Default to LLM unless specified otherwise.
</step>

<step name="run-scout">
**Run the model scout script in OpenRouter mode:**

```bash
python scripts/model-scout.py --provider openrouter --type <llm|embedding> --benchmark-count 10
```

Add `--benchmark` if the user wants quality testing (requires `OPENROUTER_API_KEY`):
```bash
python scripts/model-scout.py --provider openrouter --benchmark --benchmark-count 10
```

The script auto-skips reasoning/thinking models (DeepSeek R1, QwQ, etc.) during benchmarking — they are too slow for chatbot use. They still appear in discovery.

The script outputs to stdout. Capture and review the output.
</step>

<step name="diff-with-previous">
**If a previous OpenRouter report exists, highlight what's new:**

Compare the scout output against the previous report:
- **New models** not in the previous report (flag these clearly)
- **Models with notable price drops or context window changes**
- **Models that disappeared** from OpenRouter since the last scout

Present the diff in a compact list (new / changed / removed).
</step>

<step name="recommend">
**Make recommendations:**

Based on the scout results (and previous report context), recommend:
1. Which new models are worth benchmarking with `/benchmark`
2. Whether the current primary model should change
3. Any pricing wins (cheaper models that match the current primary's capability)

If there are strong candidates, ask if the user wants to run `/benchmark` on them now.
</step>

<step name="save-report">
**Save the updated report:**

Save to `.agents/reports/<date>-model-scout-openrouter.md` (or `-model-scout-openrouter-benchmark.md` if benchmarks were included).

If updating an existing report from the same day, update it in place rather than creating a duplicate.

Include:
- Date and scope of the scout (OpenRouter, LLM vs embedding)
- Full candidate list with pricing and context windows
- Any benchmark scores (if run)
- Exclusions and reasons (e.g., reasoning models skipped)
- Recommendations and next steps
</step>

</process>

<notes>
- The script requires internet access to query the OpenRouter API
- Benchmarking requires `OPENROUTER_API_KEY` in `.env`
- Reasoning/thinking models (DeepSeek R1, QwQ, etc.) are auto-skipped during benchmarking — they are too slow for interactive chatbot use
- Discovery without benchmarking is free and fast (~30 seconds)
- Benchmarking adds ~2 minutes per model tested
- The script outputs to stdout — save the report manually to `.agents/reports/`
- Use `/model-scout-chutes` instead if you want to scout for models hosted on Chutes (subscription pricing, cross-checked against OpenRouter for discovery)
</notes>
