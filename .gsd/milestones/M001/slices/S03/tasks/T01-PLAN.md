# T01: 03-chat-interface 01

**Slice:** S03 — **Milestone:** M001

## Description

Set up Phase 3 foundation: Tailwind CSS 4.x configuration, shared hooks, Zustand store, and install frontend dependencies.

Purpose: All chat UI components depend on these shared utilities. Getting foundation right prevents cascading issues.
Output: Working Tailwind setup, reusable hooks (useLocalStorage, useScrollAnchor), conversation store with persistence, OpenRouter helper utilities.

## Must-Haves

- [ ] "Tailwind CSS 4.x is configured and functional"
- [ ] "Zustand store persists conversations to localStorage"
- [ ] "useLocalStorage hook handles SSR hydration safely"

## Files

- `package.json`
- `app/globals.css`
- `postcss.config.mjs`
- `app/layout.tsx`
- `src/hooks/useLocalStorage.ts`
- `src/hooks/useScrollAnchor.ts`
- `src/stores/conversationStore.ts`
- `src/lib/openrouter.ts`
