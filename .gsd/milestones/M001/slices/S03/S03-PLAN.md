# S03: Chat Interface

**Goal:** Set up Phase 3 foundation: Tailwind CSS 4.
**Demo:** Set up Phase 3 foundation: Tailwind CSS 4.

## Must-Haves


## Tasks

- [x] **T01: 03-chat-interface 01** `est:4min`
  - Set up Phase 3 foundation: Tailwind CSS 4.x configuration, shared hooks, Zustand store, and install frontend dependencies.

Purpose: All chat UI components depend on these shared utilities. Getting foundation right prevents cascading issues.
Output: Working Tailwind setup, reusable hooks (useLocalStorage, useScrollAnchor), conversation store with persistence, OpenRouter helper utilities.
- [x] **T02: 03-chat-interface 02** `est:4min`
  - Build sidebar components: API key configuration, model selector, and conversation history list.

Purpose: Users need to configure their API key and model before chatting. Conversation list enables history browsing.
Output: Complete sidebar UI with API key validation, model selection, and conversation switching.
- [x] **T03: 03-chat-interface 03**
  - Build chat components: message display, input form, markdown rendering, and streaming integration.

Purpose: Core chat functionality - users send messages, see streaming responses with markdown/code rendering.
Output: Complete chat UI with streaming, stop button, auto-scroll, and rich content rendering.
- [x] **T04: 03-chat-interface 04**
  - Integrate sidebar and chat components into main page, then verify complete user flow.

Purpose: Final assembly - all components working together as cohesive chat application.
Output: Working chat interface with all requirements satisfied, ready for user verification.

## Files Likely Touched

- `package.json`
- `app/globals.css`
- `postcss.config.mjs`
- `app/layout.tsx`
- `src/hooks/useLocalStorage.ts`
- `src/hooks/useScrollAnchor.ts`
- `src/stores/conversationStore.ts`
- `src/lib/openrouter.ts`
- `src/components/sidebar/Sidebar.tsx`
- `src/components/sidebar/ApiKeyConfig.tsx`
- `src/components/sidebar/ModelSelector.tsx`
- `src/components/sidebar/ConversationList.tsx`
- `src/components/chat/ChatContainer.tsx`
- `src/components/chat/MessageList.tsx`
- `src/components/chat/MessageBubble.tsx`
- `src/components/chat/ChatInput.tsx`
- `src/components/chat/SourcesCitation.tsx`
- `src/components/chat/TypingIndicator.tsx`
- `src/components/chat/MarkdownRenderer.tsx`
- `app/page.tsx`
