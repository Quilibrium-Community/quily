---
name: prod-debug
description: Debug live production issues on quily.quilibrium.one (Vercel-hosted Next.js chatbot) — fetch runtime logs via Vercel CLI, hit the live API autonomously with the debug bypass, and read the structured diagnostics embedded in the chat stream. Use when the user reports the bot is broken, giving empty answers, returning garbage, or behaving unexpectedly in production. Trigger on phrases like "the bot is broken", "empty answers on the web app", "check what's going on in prod", "debug production", "why is the chatbot failing", "prod-debug".
user-invocable: true
---

# Production Debug Pipeline — quily.quilibrium.one

**Goal: 30 seconds from "the bot is broken" to a real diagnosis. No browser dance, no token paste, no babysitting.**

The pipeline has three layers. Use them in order — each one tells you whether you need the next.

---

## Production facts (memorize)

- **Public domain:** `quily.quilibrium.one` (NOT `quily.app` — that's a different site)
- **Vercel project:** `quily-chatbot` (org `lamat-projects-60789340`, project `prj_oQ433H1UvdHe8zf2Ikl7nwbStVMv`)
- **Tooling:** Vercel **CLI is preferred** (already authed in the user's shell as `lamat1111`). Do **NOT** use `mcp__claude_ai_Vercel__*` for this project — those tools return 403.
- **Free mode is on** (`NEXT_PUBLIC_FREE_MODE=true`). Server uses `OPENROUTER_API_KEY`. Default model `deepseek/deepseek-v3.2`.
- **Turnstile is enforced** in production. A bare `curl` to `/api/chat` returns 403 — that is NOT the bug. Use the debug bypass below.
- **`DEBUG_BYPASS_TOKEN`** must exist in BOTH Vercel prod env AND `.env.local` (same value) for `yarn prod-curl` to work. The script reads it from `.env.local` via `dotenv` — never logs the value.

---

## Layer 1 — `yarn prod-logs`: see what happened

```bash
yarn prod-logs                  # last 1h, /api/chat events only, color-coded
yarn prod-logs --since 6h       # wider window
yarn prod-logs --errors         # only error / warning level
yarn prod-logs --all            # include non-/api/chat routes
yarn prod-logs --query "RAG"    # full-text search via Vercel CLI
yarn prod-logs --raw            # JSON Lines for piping/grep
```

Implementation: [scripts/prod-logs.ts](../../../scripts/prod-logs.ts). Wraps `vercel logs --no-follow --json --environment production`. Returns in ~5 seconds.

**What to look for:**
- `[Chat route] Config:` cold-start line shows `freeMode`, `hasOpenRouterKey`. If `hasOpenRouterKey: false`, the env var is missing.
- `Chat request: { provider, model, messageCount, ... }` confirms requests reached the route.
- `RAG retrieval: N chunks, uiQuality=..., maxSimilarity=...` confirms RAG ran. `uiQuality=none` means the system prompt fell back to the casual personality.
- `LLM streaming error:` — OpenRouter / Chutes returned an error. Read the suffix: `402` = credits, `503` = model unavailable, `401` = bad key.
- `[auto-issue] Failed: GITHUB_TOKEN not configured` — the model is emitting `create_knowledge_issue` JSON in visible text. Indicates tool-call leak; `GITHUB_TOKEN` is also missing from prod env (separate fix).
- `/api/chat` returning **200** but the user reports empty answers → use Layer 2 to see exactly what the route streamed.

---

## Layer 2 — `yarn prod-curl "<question>"`: reproduce against live prod

```bash
yarn prod-curl "What is Quilibrium?"
yarn prod-curl "ping" --provider chutes
yarn prod-curl "..." --url https://my-preview.vercel.app
yarn prod-curl "..." --raw          # raw SSE stream
```

Implementation: [scripts/prod-curl.ts](../../../scripts/prod-curl.ts). Reads `DEBUG_BYPASS_TOKEN` from `.env.local` via `dotenv`, hits `/api/chat?debug=$TOKEN`, parses the SSE stream, and prints:
- The visible model output as it arrives.
- A structured summary: visible char count, sources, follow-ups, debug events.
- Per-phase debug payloads from the route (request, rag-complete, stream-finished).

The script never logs the token. The route only honors the `?debug=` param when the token equals `DEBUG_BYPASS_TOKEN` server-side AND that env var is set.

**Reading the output — decision tree:**

| `outputLength` | `hasToolCallTextLeak` | `errors[]` | Diagnosis |
|---|---|---|---|
| > 0 | false | empty | Healthy. Bug is client-side or transient. |
| > 0 | true | empty | Model leaked `create_knowledge_issue` JSON into visible text. Server-side fix needed. |
| 0 | false | populated | Upstream provider error — read the message. (`402` credits, `503` model down, etc.) |
| 0 | false | empty | Provider silently dropped the stream. Often transient — retry. If recurring, check OpenRouter dashboard. |
| any | any | rag-related | Supabase / embeddings down. Check `NEXT_PUBLIC_SUPABASE_URL` env, Supabase status page. |

**Setup (one-time, if `yarn prod-curl` says `DEBUG_BYPASS_TOKEN is not set`):**

```powershell
# Generate a long random secret
$tok = node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"

# Add to .env.local (script reads it from here)
Add-Content -Path .env.local -Value "DEBUG_BYPASS_TOKEN=$tok"

# Add SAME value to Vercel prod env (route validates against it)
$tok | vercel env add DEBUG_BYPASS_TOKEN production
# (mark sensitive: yes)

# Redeploy so the route picks up the new env var
vercel deploy --prod

Remove-Variable tok
```

**Don't read `.env.local` yourself** — that's a secrets violation. Let the script read it.

---

## Layer 3 — User-visible error messages (no debug needed)

The route emits `data-error` SSE parts on failure that the client renders directly in the chat. Users see real error messages instead of empty bubbles. Implementation lives in:

- Server: `writeError()` helper in [app/api/chat/route.ts](../../../app/api/chat/route.ts) emits `data-error` parts with `{ source, message }` payloads.
- Client: [src/components/chat/ChatContainer.tsx](../../../src/components/chat/ChatContainer.tsx) captures them in `handleData`, [src/components/chat/MessageList.tsx](../../../src/components/chat/MessageList.tsx) renders them in a red panel with the source label.

| `source` value | Trigger | What user sees |
|---|---|---|
| `rag` | RAG retrieval threw | "Search failed: \<reason\>" |
| `llm` | OpenRouter / Chutes returned an error | The actual error text |
| `ui-stream` | AI SDK serialization issue | The actual error text |
| `empty-response` | Stream completed with 0 visible chars | "No response received" + retry hint |
| `fallback-exhausted` | All Chutes fallback models tried, none worked | List of attempted models |

If a user reports a problem, ask them what they saw. If they saw a red panel with a source label, jump straight to the relevant log query — you already know the failure mode. If they saw an empty bubble (no panel at all), that's a bug in this layer; investigate.

---

## Step-by-step: typical debug session

1. **`yarn prod-logs --since 1h --errors`** — anything red? If yes, you may already know.
2. **`yarn prod-curl "<exact query the user reported>"`** — reproduce. Read the structured summary.
3. **If reproduced and `errors[]` is populated** — that's your diagnosis. Fix at the source (rotate key, switch model, fix RAG).
4. **If reproduced but the route returned content** — bug is client-side. Check ChatContainer/MessageList for parsing or rendering issues.
5. **If NOT reproduced** — transient upstream issue. Confirm OpenRouter / Chutes status pages. Note in `.agents/bugs/` only if it recurs.

---

## Provider health checks

Most "empty answer" reports trace to the upstream provider. Quick links:

- **OpenRouter credits:** https://openrouter.ai/settings/credits. The free-mode chat route skips the balance pre-check ([app/api/chat/route.ts:734](../../../app/api/chat/route.ts#L734)) — exhausted keys produce empty streams, not friendly 402s. The new `data-error` `empty-response` path now surfaces this to the user.
- **OpenRouter model status:** https://openrouter.ai/models — search the model ID. Switch `FREE_MODE_DEFAULT_MODEL` if needed.
- **Chutes balance:** https://chutes.ai/app/api → Balance.
- **Supabase status:** https://status.supabase.com.

---

## Verify env vars

```bash
vercel env ls production
```

Required: `NEXT_PUBLIC_FREE_MODE=true`, `OPENROUTER_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `DEBUG_BYPASS_TOKEN`.
Optional but needed for full functionality: `GITHUB_TOKEN` (auto-issue path), `COHERE_API_KEY` (premium reranking).
**NEVER read values** — only confirm presence.

---

## Anti-patterns (things that wasted time before)

- **Don't curl `quily.app`** — unrelated domain, returns 405. Use `quily.quilibrium.one`.
- **Don't curl Vercel deployment URLs** (`quily-chatbot-XXX.vercel.app`) — SSO-protected, returns auth HTML.
- **Don't run `vercel logs <url>` without `--no-follow`** — it streams interactively, prints nothing useful when piped, hangs in agent sessions. Use `yarn prod-logs`.
- **Don't use Vercel MCP** for runtime logs — returns 403 on this project. CLI works.
- **Don't ask the user to paste the debug token.** Use `yarn prod-curl`. The whole point of the pipeline is that you operate autonomously.
- **Don't read `.env.local`** to verify keys — secrets violation. Verify health via Layer 2 (`yarn prod-curl`) which exercises real keys without exposing them.
- **Don't assume code regression** when recent commits are docs-only. Suspect upstream first.
- **Don't mark a bug solved without reproducing it via Layer 2.** "Logs look fine" is not the same as "the live API works for this query."

---

## Quick reference

```
projectId: prj_oQ433H1UvdHe8zf2Ikl7nwbStVMv
teamId:    team_m04vQDCEDaVu2ipZMzD3SyrN
prod URL:  https://quily.quilibrium.one
logs:      yarn prod-logs [--since 6h] [--errors] [--query foo] [--all] [--raw]
repro:     yarn prod-curl "<question>" [--provider openrouter|chutes] [--raw]
related:   .agents/docs/production-debug-pipeline.md
```

---
*Last updated: 2026-05-10 — three layers shipped: prod-logs (Vercel CLI wrapper), prod-curl (autonomous live repro via DEBUG_BYPASS_TOKEN), and `data-error` SSE parts surfacing real errors to users in the chat UI.*
