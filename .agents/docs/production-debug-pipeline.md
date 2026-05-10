---
type: doc
title: "Production Debug Pipeline"
description: "Two-layer pipeline for debugging the live chatbot in production: yarn prod-logs (Vercel CLI wrapper) and ?debug=<token> bypass on /api/chat that streams diagnostics as data-debug SSE events."
status: done
ai_generated: true
reviewed_by: null
created: 2026-05-10
updated: 2026-05-10
related_docs:
  - "../.claude/skills/prod-debug/SKILL.md"
  - "cloudflare-turnstile-bot-protection.md"
related_tasks: []
---

# Production Debug Pipeline

> **⚠️ AI-Generated**: May contain errors. Verify before use.

## Why this exists

When users report "the bot is broken" on quily.quilibrium.one, the previous workflow required several manual steps that didn't compose well: `vercel logs <url>` is interactive-streaming-only and produces nothing useful when piped, the Vercel MCP returns 403 on this project, the deployment URL is SSO-protected so you can't curl it, and the public domain is behind Turnstile which blocks any direct request. The result was 30-minute debug sessions that mostly consisted of figuring out how to observe production at all.

This pipeline collapses that to ~30 seconds. It has two pieces:

1. `yarn prod-logs` — pulls and pretty-prints recent Vercel runtime logs.
2. `?debug=<token>` query param on `/api/chat` — bypasses Turnstile and streams diagnostic SSE events alongside the normal response.

Together they let you go from "it's broken" to "here's what's happening in production right now" without leaving the terminal.

## Layer 1 — yarn prod-logs

A wrapper around `vercel logs --no-follow --json --environment production` that filters down to chat-route events and color-codes status codes and log levels. Implementation: [scripts/prod-logs.ts](../../scripts/prod-logs.ts).

### Usage

```bash
yarn prod-logs                  # last 1h, /api/chat events only
yarn prod-logs --since 6h       # wider time window
yarn prod-logs --errors         # only error / warning level events
yarn prod-logs --all            # include non-/api/chat routes
yarn prod-logs --query "RAG"    # full-text search via Vercel CLI
yarn prod-logs --raw            # raw JSON Lines, for piping to jq / grep
yarn prod-logs --limit 500      # increase event ceiling
```

### What you'll see

Each chat event renders as one block:

```
2026-05-10 06:43:13  200  POST /api/chat
  INFO  [Chat route] Config: { freeMode: 'true', hasOpenRouterKey: true, ... }
  INFO  Chat request: { provider: 'openrouter', model: 'deepseek/deepseek-v3.2', messageCount: 1 }
  INFO  RAG retrieval: 5 chunks, uiQuality=high, maxSimilarity=0.537, ...
  ERROR [auto-issue] Failed to handle tool calls from web UI: GITHUB_TOKEN not configured
```

### Why the wrapper instead of raw vercel logs

`vercel logs <deployment-url>` activates implicit `--follow` and never terminates in a non-TTY context, so when an agent tries to capture its output the command hangs and the buffer stays empty. Even `vercel logs --no-follow --json` directly produces a verbose mixed stream that's hard to scan.

The wrapper enforces the right flags (`--no-follow --json --environment production`), ignores the noisy non-chat events by default, and renders the structured `logs[]` array each event carries (which is where the actual `console.log` lines live, separate from the top-level request line).

## Layer 2 — Debug bypass on /api/chat

The chat route accepts a debug token via either:

- `?debug=<token>` query param, or
- `x-debug-token: <token>` request header.

When the token matches the `DEBUG_BYPASS_TOKEN` server env var (and that env is set — there is no implicit "any token works" mode), the route:

- Skips Turnstile verification entirely (so you can curl from any machine).
- Emits structured `data-debug` SSE parts alongside the normal stream, marked `transient: true` so they don't persist into message history.
- Captures errors that are normally swallowed by `streamText`'s `onError` callback into a `debugErrors[]` array surfaced at stream end.

### Setup (one-time)

The token must exist in the Vercel production env:

```bash
vercel env ls production | grep DEBUG_BYPASS_TOKEN
# if missing, add a long random string:
vercel env add DEBUG_BYPASS_TOKEN production
vercel deploy --prod                            # redeploy to pick it up
```

Store the token wherever the project's secrets live (Bitwarden, password manager, etc.). Never commit it or paste it in chat output.

### Usage

```bash
TOKEN="<DEBUG_BYPASS_TOKEN value>"
curl -N -X POST "https://quily.quilibrium.one/api/chat?debug=$TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "parts": [{"type": "text", "text": "What is Quilibrium?"}]}
    ],
    "provider": "openrouter"
  }' \
  --max-time 90
```

The `-N` flag (`--no-buffer`) is important: it disables curl's stdout buffering so SSE events arrive in real time as the server emits them, rather than landing as one chunk at the end.

### What the debug stream contains

The route emits one `data-debug` event per phase:

| Phase | Payload |
|-------|---------|
| `request` | `freeMode`, `provider`, `model`, `messageCount`, `rawUserQuery` (truncated), `normalizedQuery`, `hasOpenRouterKey`, `hasChutesToken`, `embeddingProvider`, `embeddingModel` |
| `rag-complete` | `ragChunks`, `ragQuality` (`high` / `low` / `none`), `maxSimilarity`, `sourceCount`, `systemPromptLength` |
| `rag-error` | `error` message string |
| `stream-finished` | `outputLength`, `outputPreview` (first 300 chars), `toolCallNames[]`, `hasToolCallTextLeak` (true if `create_knowledge_issue` appears in visible output), `errors[]` |

The `errors[]` array on the final event includes anything captured from `streamText`'s `onError` (`llm:` prefix), the UI stream's `onError` (`ui-stream:` prefix), and RAG retrieval failures (`rag:` prefix). These would otherwise be invisible — they don't propagate to the client because the surrounding code catches and logs them.

### Reading the output

The decision tree for empty / broken responses:

- **`outputLength === 0`** → the model returned nothing. Check `errors[]` for the upstream cause (e.g. `llm: 402 Insufficient credits`, `llm: 503 No instances available`). If `errors[]` is empty the model genuinely returned an empty stream — almost always an OpenRouter / Chutes credit or rate-limit issue that didn't throw a typed error.
- **`outputLength > 0` but user sees garbage** → look at `outputPreview`. If `hasToolCallTextLeak: true`, the model emitted `create_knowledge_issue` JSON inline as text instead of as a structured tool call, and that JSON is what users see. Fix is on the server side (strip from visible text or stop passing the tool for first-message queries).
- **`ragChunks === 0` or `ragQuality: 'none'`** → retrieval failed or returned nothing relevant. Check `rag-error` for the cause; verify Supabase availability and embedding-provider keys.
- **`hasOpenRouterKey: false`** in `request` phase → server env is misconfigured for this deployment. Re-add and redeploy.

## Security model

**Layer 1** (`yarn prod-logs`) requires the developer's local `vercel` CLI to be authed against the project. No new secrets are introduced — it relies on existing Vercel auth scope.

**Layer 2** (`DEBUG_BYPASS_TOKEN`) is a long random secret stored only in the Vercel server env. The route compares the provided token against the env var with strict equality, and the bypass is gated on both `debugBypassEnv` being set AND the provided value matching exactly. If the env var is absent, no bypass exists. The token is never logged, never rendered in error responses, and never emitted in the debug stream itself.

The debug stream contains query previews (truncated to 200 chars) and output previews (truncated to 300 chars) but no auth tokens, no full keys, and no full message history. It is safe to share the SSE output for debugging purposes.

To revoke debug access, rotate `DEBUG_BYPASS_TOKEN` in the Vercel env and redeploy.

## Files touched

- `scripts/prod-logs.ts` — Vercel logs wrapper, exposed as `yarn prod-logs`.
- `package.json` — `prod-logs` script entry.
- `app/api/chat/route.ts` — debug token detection (URL + header), Turnstile bypass when valid, `writeDebug()` helper, `debugErrors[]` capture, three `data-debug` emission points.
- `.claude/skills/prod-debug/SKILL.md` — agent-facing playbook that references both layers.

## Related

- `.claude/skills/prod-debug/SKILL.md` — invokable skill that walks an agent through using this pipeline end-to-end.
- `docs/cloudflare-turnstile-bot-protection.md` — the Turnstile flow the debug bypass intentionally short-circuits.
