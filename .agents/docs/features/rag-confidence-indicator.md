---
type: doc
title: "RAG Confidence Indicator"
status: done
ai_generated: true
created: 2026-03-22
updated: 2026-03-22
related_docs: []
related_tasks:
  - 2026-03-22-rag-confidence-indicator.md
---

# RAG Confidence Indicator

> **⚠️ AI-Generated**: May contain errors. Verify before use.

## Overview

The RAG confidence indicator surfaces retrieval quality to users as a visible warning when the bot's answer has weak documentation backing. It uses the same similarity threshold that controls the LLM's system prompt behavior — when the best-matching chunk scores below 0.45, the LLM is instructed to be cautious **and** the user sees a warning callout.

This prevents users from trusting poorly-supported answers without adding any API cost or latency.

## Architecture

### Three Quality Tiers

| Tier | Condition | System Prompt | UI Callout |
|------|-----------|---------------|------------|
| **High** | `maxSimilarity >= 0.45` | Normal behavior | No indicator (silence = confidence) |
| **Low** | `maxSimilarity < 0.45`, chunks retrieved | LOW RELEVANCE WARNING injected — LLM told not to extrapolate | Warning callout shown |
| **None** | No chunks retrieved | NO DOCUMENTATION FOUND — LLM told to say "I don't know" or respond as personality | No indicator (casual/personality response) |

The `none` tier does not show a callout because it typically means the query is casual chat (joke, greeting, etc.) — no documentation is expected.

### Data Flow

```
buildContextBlock() in src/lib/rag/prompt.ts
  ├── Computes maxSimilarity from retrieved chunks
  ├── Returns quality: 'high' | 'low' | 'none'
  └── Injects system prompt warning when quality is 'low'
        │
        ▼
prepareQuery() in src/lib/rag/service.ts
  └── Maps quality → ragQuality on PreparedQuery
        │
        ▼
app/api/chat/route.ts (both Chutes + OpenRouter paths)
  └── Streams { type: 'data-rag-quality', data: { quality } } as custom data part
        │
        ▼
ChatContainer.tsx → onData callback
  ├── setRagQuality(quality) from the data part
  └── Persists ragQuality on last assistant message in conversation store
        │
        ▼
MessageList.tsx → MessageBubble.tsx
  └── Renders callout-warning div when ragQuality === 'low'
```

### Key Files

| File | Role |
|------|------|
| [src/lib/rag/prompt.ts](src/lib/rag/prompt.ts) | `HIGH_RELEVANCE_THRESHOLD` (0.45), `buildContextBlock()` computes quality and injects system prompt warning |
| [src/lib/rag/service.ts](src/lib/rag/service.ts) | `prepareQuery()` propagates `ragQuality` through `PreparedQuery` and `ProcessQueryResult` |
| [app/api/chat/route.ts](app/api/chat/route.ts) | Streams `data-rag-quality` custom data part in both Chutes and OpenRouter paths |
| [src/components/chat/ChatContainer.tsx](src/components/chat/ChatContainer.tsx) | Receives `data-rag-quality` via `onData`, stores in state, persists to conversation store |
| [src/components/chat/MessageBubble.tsx](src/components/chat/MessageBubble.tsx) | Renders `callout-warning` when `ragQuality === 'low'` |
| [src/stores/conversationStore.ts](src/stores/conversationStore.ts) | `Message.ragQuality` field for persistence across sessions |
| [app/globals.css](app/globals.css) | `.callout-warning` class with amber color tokens for light/dark themes |
| [bot/src/formatter.ts](bot/src/formatter.ts) | Discord equivalent — inserts `-# ⚠️` subtext line for low quality |

### Persistence

`ragQuality` is stored per-message in the Zustand conversation store (persisted to localStorage). When syncing messages, the current `ragQuality` state is attached to the last assistant message. When restoring a conversation, `ragQuality` is loaded from the last assistant message and set back into state. This means the warning callout persists when navigating away from and back to a conversation.

### Styling

The `callout-warning` CSS class follows the same pattern as `callout-info` and `callout-success`:

- **Light theme**: amber-50 background, amber-300 border, amber-800 text
- **Dark theme**: muted amber — rgba(120, 53, 15, 0.10) background, rgba(252, 211, 77, 0.20) border, #d4a83a text

Uses the `alert-triangle` Feather icon (via the `Icon` component), not an emoji.

## Technical Decisions

- **Single threshold (0.45)**: Embedding similarity scores from BGE-M3 cluster tightly (0.59–0.74) for most queries — there is no clean separation point for a separate UI threshold. Testing showed "What is Quilibrium?" scores 0.646 while off-topic questions score 0.59–0.73, making a higher UI threshold unreliable. Using the same threshold that drives system prompt caution ensures the callout aligns with the LLM's actual behavior.

- **No citation gating**: An earlier design only showed the callout when the response contained inline citations (`[1]`, `[2]`). This created a catch-22: low-quality responses tend not to cite sources, so the warning never appeared when it was most needed. Removing the gate and relying on the quality tier alone solves this — `'low'` means chunks were retrieved but weak, `'none'` means no retrieval (casual chat), so the casual case is naturally excluded.

- **`none` tier suppressed**: When no chunks are retrieved, the query is typically casual/personality (jokes, greetings). Showing a warning for these would be noise. The `none` quality already triggers a system prompt that tells the LLM to respond in character without documentation.

## Known Limitations

- **Embedding similarity is not semantic accuracy**: A high similarity score means the query matches document vocabulary, not that the answer is correct. Off-topic questions containing Quilibrium-related keywords can score higher than genuinely relevant queries.

- **Single quality per conversation turn**: Only the last assistant message's `ragQuality` is tracked. Multi-turn conversations where earlier messages had different quality levels only show the most recent quality.

- **Discord formatting**: The Discord bot uses a subtext line (`-# ⚠️`) which is visually subtle and may be overlooked by users.

## Related Documentation

- [Self-Improvement Roadmap](../../tasks/2026-03-22-rag-confidence-indicator.md) — task spec for this feature
- Confidence scoring is feature #1 in the bot self-improvement roadmap, feeding into query-failure logging (#2)

---

_Created: 2026-03-22_
_Updated: 2026-03-22_
