# Daily Recap Posting

**Added:** 2026-03-24
**Updated:** 2026-03-28

## Overview

The bot automatically generates and posts a daily multi-channel digest at 14:00 UTC. Each configured channel receives a tailored recap summarizing the last 24 hours of conversation, filtered for noise and summarized by an LLM. The digest is posted to a central `#daily-digest` channel.

## How It Works

1. **Scheduling:** `startDailyDigest()` in `bot/src/handlers/dailyRecap.ts` runs a 60-second interval timer (same pattern as `startDailyStats`). At the configured hour (default 14 UTC), it triggers once per day.

2. **Per-Channel Processing:** For each channel in `DISCORD_DIGEST_CHANNEL_IDS`, the system:
   - **Fetches messages:** `generateRecap()` in `bot/src/services/recapGenerator.ts` fetches the last 24h of messages via discord.js `channel.messages.fetch()`, paginating in batches of 100.
   - **Filters noise:** `filterRecapMessages()` drops bot messages, short messages (<15 chars), emoji-only, URL-only, and common noise patterns (gm, lol, wagmi, etc.). Cassie's messages (lead dev) bypass all noise filters.
   - **Uses channel-specific prompts:** #general receives a general discussion prompt; other channels receive an announcement-focused prompt.
   - **LLM summarization:** Calls OpenRouter (DeepSeek V3) to generate a 200-500 word recap grouped by topic. Cassie's substantive contributions get a dedicated "From Cassie" section.
   - **Relevance gate:** If the LLM returns "SKIP_EMPTY", the channel is omitted from the digest (only noise/banter detected).

3. **Discord Posting:** The formatted multi-channel digest is posted to `#daily-digest` with `suppressDiscordEmbeds()` and `chunkMessage()` for long content. Uses `Promise.allSettled()` for fault tolerance — if one channel fails, others still post.

4. **File Writing:** Each channel's recap is written as a separate markdown file to `docs/discord/recap-{channel-name}/YYYY-MM-DD.md`.

5. **Supabase Ingestion:** Each recap is upserted to `document_chunks_chutes` with a BGE-M3 embedding, using `doc_type: discord_recap` and `source_file: docs/discord/recap-{channel-name}/YYYY-MM-DD.md`. These entries are then available to RAG queries.

## Configuration

| Env Var | Default | Purpose |
|---------|---------|---------|
| `DISCORD_DIGEST_CHANNEL_IDS` | (none — disables feature) | Comma-separated channel IDs to digest (order determines display order) |
| `DISCORD_DIGEST_POST_CHANNEL_ID` | (none — required if digest active) | Channel to post the compiled digest |
| `DISCORD_RECAP_HOUR` | `14` | UTC hour to post |
| `RECAP_LLM_MODEL` | `deepseek/deepseek-chat-v3-0324` | Override LLM model |

Requires `OPENROUTER_API_KEY` (for both LLM and embedding) regardless of `BOT_LLM_PROVIDER`.

**Channel-specific prompt logic:**
- `#general` → "general discussion" prompt (emphasize community insights, dev discussion)
- All other channels → "announcement" prompt (emphasize updates, key news, summaries)

## Relationship with GitHub Action

The GitHub Actions workflow (`sync-docs.yml`) still runs at 06:00 UTC and generates recap files committed to `docs/discord/general-recap/`. Its Supabase entry gets overwritten by the bot's 14:00 UTC version for #general. The bot now generates additional channel recaps at 14:00 UTC for all channels in `DISCORD_DIGEST_CHANNEL_IDS`. The `@Quily recap` command redirects users to `#daily-digest` where the compiled multi-channel digest is posted.

## Key Files

| File | Purpose |
|------|---------|
| `bot/src/services/recapGenerator.ts` | Filter + summarize + generate per-channel recaps |
| `bot/src/handlers/dailyRecap.ts` | Multi-channel scheduler + digest poster + Supabase upsert |
| `bot/src/handlers/recap.ts` | On-demand `@Quily recap` → redirects to #daily-digest |
| `scripts/sync-discord/recap.ts` | GitHub Action recap generator (unchanged, single-channel) |

## Cost

~$0.005-$0.015/day for multi-channel LLM summarization (scales with number of channels) + negligible embedding cost. Approximately $0.15-$0.45/month via OpenRouter depending on channel count.

## Retention & Cleanup

Per-channel markdown files follow the existing 28-day rolling retention policy via `cleanup.ts`. Old recap files in `docs/discord/recap-{channel-name}/` are automatically deleted to prevent knowledge base bloat.

*Created: 2026-03-24*
*Updated: 2026-03-28*
