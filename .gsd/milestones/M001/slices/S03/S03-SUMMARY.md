---
id: S03
parent: M001
milestone: M001
provides:
  - Tailwind CSS 4.x configuration
  - useLocalStorage hook with SSR hydration safety
  - useScrollAnchor hook for chat auto-scroll
  - Zustand conversation store with localStorage persistence
  - OpenRouter API utilities and model list
  - Sidebar component with API key config and model selector
  - ApiKeyConfig with localStorage persistence and validation
  - ModelSelector dropdown with RECOMMENDED_MODELS
  - ConversationList with history and CRUD operations
requires: []
affects: []
key_files: []
key_decisions:
  - "Tailwind CSS 4.x with @import syntax (not legacy @tailwind directives)"
  - "Zustand persist middleware with createJSONStorage for localStorage"
  - "50 conversation limit with oldest-first pruning"
  - "Auto-title from first user message (50 char truncate)"
  - "_hasHydrated flag pattern for SSR hydration safety"
  - "Password input always masked with no reveal option (per CONTEXT.md)"
  - "API key shows last 6 chars as hint when present"
  - "Validation only on blur when key > 10 chars"
  - "Mobile sidebar as overlay with fixed toggle button at bottom-left"
  - "Model selection persisted to localStorage separately from conversations"
patterns_established:
  - "SSR hydration safety: useState(initial) + useEffect(hydrate) + isHydrated flag"
  - "Zustand persist: partialize to exclude internal state, onRehydrateStorage callback"
  - "Sidebar responsive: w-72 desktop fixed, mobile overlay with backdrop"
  - "Hydration skeleton pattern for Zustand persisted state"
observability_surfaces: []
drill_down_paths: []
duration: 4min
verification_result: passed
completed_at: 2026-01-24
blocker_discovered: false
---
# S03: Chat Interface

**# Phase 3 Plan 1: Foundation Summary**

## What Happened

# Phase 3 Plan 1: Foundation Summary

**Tailwind CSS 4.x configured, Zustand conversation store with localStorage persistence, SSR-safe hooks for chat UI**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-24T19:52:00Z
- **Completed:** 2026-01-24T19:56:32Z
- **Tasks:** 3
- **Files created:** 7

## Accomplishments
- Tailwind CSS 4.x with @tailwindcss/postcss plugin configured
- useLocalStorage hook with SSR hydration safety pattern
- useScrollAnchor hook using intersection observer for chat auto-scroll
- Zustand conversation store with full CRUD operations
- OpenRouter validateApiKey and RECOMMENDED_MODELS utilities

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and configure Tailwind CSS 4.x** - `d9981b0` (feat)
2. **Task 2: Create shared hooks and utilities** - `5a82fd6` (feat)
3. **Task 3: Create Zustand conversation store** - `aba22fd` (feat)

## Files Created/Modified
- `app/globals.css` - Tailwind CSS 4.x import
- `app/layout.tsx` - Root layout with Inter font
- `postcss.config.mjs` - Tailwind PostCSS plugin config
- `src/hooks/useLocalStorage.ts` - SSR-safe localStorage hook
- `src/hooks/useScrollAnchor.ts` - Chat scroll management hook
- `src/stores/conversationStore.ts` - Zustand conversation store
- `src/lib/openrouter.ts` - API key validation and model list
- `package.json` - Added chat UI dependencies

## Decisions Made
- Used Tailwind CSS 4.x with new `@import "tailwindcss"` syntax (not legacy directives)
- Inter font from next/font/google for clean typography
- useLocalStorage returns `[value, setValue, isHydrated]` tuple for hydration safety
- Zustand persist with partialize to exclude `_hasHydrated` from storage
- 50 conversation max limit to prevent localStorage bloat
- Auto-generate conversation title from first 50 chars of first user message

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Foundation complete for building chat UI components
- All hooks and stores ready for ChatContainer, MessageList, InputBar
- Tailwind CSS available for styling
- OpenRouter utilities ready for settings panel

---
*Phase: 03-chat-interface*
*Completed: 2026-01-24*

# Phase 3 Plan 2: Sidebar Components Summary

**Responsive sidebar with API key config (localStorage + OpenRouter validation), model selector dropdown, and conversation history list with CRUD**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-24T19:59:38Z
- **Completed:** 2026-01-24T20:03:18Z
- **Tasks:** 2
- **Files created:** 4

## Accomplishments
- ApiKeyConfig component with localStorage persistence and async validation
- ModelSelector dropdown rendering RECOMMENDED_MODELS from openrouter utility
- ConversationList with sorted history, new/switch/delete functionality
- Responsive Sidebar container with mobile overlay pattern

## Task Commits

Each task was committed atomically:

1. **Task 1: Create API Key and Model selector components** - `6bf81f8` (feat)
2. **Task 2: Create ConversationList and Sidebar container** - `7de5f89` (feat)

## Files Created
- `src/components/sidebar/ApiKeyConfig.tsx` - API key input with validation and localStorage persistence
- `src/components/sidebar/ModelSelector.tsx` - Model dropdown using RECOMMENDED_MODELS
- `src/components/sidebar/ConversationList.tsx` - Conversation history with new/switch/delete
- `src/components/sidebar/Sidebar.tsx` - Container with responsive mobile/desktop layout

## Decisions Made
- Password input always masked without reveal option (security per CONTEXT.md)
- Show last 6 characters as hint when API key exists ("Key: ......abc123")
- Validation triggers only on blur and only if key length > 10 chars
- Model selection stored in separate localStorage key ('selected-model')
- Mobile toggle button fixed at bottom-left corner for thumb accessibility

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Sidebar components ready for integration into main layout
- API key and model selection available for chat functionality
- Conversation store provides history management for chat area

---
*Phase: 03-chat-interface*
*Plan: 02*
*Completed: 2026-01-24*

# Phase 03 Plan 03: Chat Components Summary

Chat components with streaming integration - useChat hook orchestrating message display, input form, and markdown rendering with syntax highlighting.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create MarkdownRenderer and helper components | 0582c18 | MarkdownRenderer.tsx, SourcesCitation.tsx, TypingIndicator.tsx |
| 2 | Create MessageBubble and MessageList | e0799d0 | MessageBubble.tsx, MessageList.tsx |
| 3 | Create ChatInput and ChatContainer | 6e22388 | ChatInput.tsx, ChatContainer.tsx |

## Component Details

### MarkdownRenderer

- Uses react-markdown with remarkGfm plugin
- Custom code component with language detection
- Block code: SyntaxHighlighter with oneDark theme
- Inline code: gray background styling
- Styled headers, lists, links, paragraphs, tables

### SourcesCitation

- Expandable source list from RAG context
- Toggle visibility with click
- External links with security attributes (noopener noreferrer)

### TypingIndicator

- Animated bouncing dots
- "Thinking" text with staggered dot animation
- Shown during streaming/submitted states

### MessageBubble

- Role-based styling (user: blue, assistant: gray)
- User messages: whitespace-pre-wrap text
- Assistant messages: MarkdownRenderer + SourcesCitation
- Extracts text/sources from UIMessage parts array

### MessageList

- Uses useScrollAnchor for auto-scroll behavior
- Only auto-scrolls if user is at bottom
- Shows TypingIndicator during streaming
- Error display with red styling
- Empty state for new conversations

### ChatInput

- Textarea with Enter to send, Shift+Enter for newline
- Submit button (blue) when ready
- Stop button (red) during streaming
- Disabled state when no API key

### ChatContainer

- Orchestrates useChat from @ai-sdk/react
- DefaultChatTransport for API endpoint/body configuration
- Syncs messages to Zustand conversation store
- Converts UIMessage to store Message format

## API Compatibility Notes

AI SDK v6 introduced breaking changes from previous versions:

1. **No `api` prop on useChat**: Use `transport: new DefaultChatTransport({ api, body })`
2. **No `content` on UIMessage**: Extract from `parts.filter(p => p.type === 'text')`
3. **sendMessage format**: Use `{ text }` not `{ role, content }`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] AI SDK v6 API changes**

- **Found during:** Task 3
- **Issue:** useChat no longer accepts `api` and `body` props directly; UIMessage has no `content` property
- **Fix:** Used DefaultChatTransport for configuration, extracted text from parts array
- **Files modified:** ChatContainer.tsx, MessageBubble.tsx
- **Commits:** e0799d0, 6e22388

## Verification Results

- [x] `npm run typecheck` passes
- [x] All 7 component files created
- [x] All components have 'use client' directive
- [x] ChatContainer uses useChat hook
- [x] MarkdownRenderer uses react-markdown

## Next Phase Readiness

**Ready for Plan 04 (Integration)**

Dependencies satisfied:
- Chat components complete with streaming support
- Message list with auto-scroll
- Input form with stop functionality
- Markdown rendering with syntax highlighting

No blockers identified.

# Plan 03-04 Summary: Page Integration

**Status:** Complete
**Duration:** ~15 min (including dark theme implementation)

## What Was Built

### Main Page Integration
- `app/page.tsx` - Full page integrating Sidebar + ChatContainer
- Hydration safety with loading skeleton
- State management via useLocalStorage and Zustand

### Dark Theme (Added)
Updated all components to consistent dark theme:
- Page background: gray-900
- Sidebar: gray-800 with gray-700 borders
- Inputs: gray-700 background, gray-100 text
- Chat area: gray-900 background
- Message bubbles: User (blue-600), Assistant (gray-800)
- All text adjusted for dark backgrounds

### Bug Fixes During Integration
1. **Environment variables**: Renamed `SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`
2. **Zod validation error**: Removed zod schema, used manual validation for AI SDK v6 compatibility
3. **AI SDK v6 message format**: Added helper functions to extract content from `parts` array
4. **API key indicator**: Changed to colored circle with white icon inside
5. **Model dropdown**: Custom styled with chevron, removed browser default
6. **Mobile toggle**: Moved from bottom-left to top-left to avoid covering input

## Files Modified

- `app/page.tsx` - Dark theme
- `app/api/chat/route.ts` - Fixed validation, AI SDK v6 compatibility
- `src/components/sidebar/Sidebar.tsx` - Dark theme
- `src/components/sidebar/ApiKeyConfig.tsx` - Dark theme, improved indicator
- `src/components/sidebar/ModelSelector.tsx` - Dark theme, custom styling
- `src/components/sidebar/ConversationList.tsx` - Dark theme
- `src/components/chat/ChatContainer.tsx` - No changes needed
- `src/components/chat/ChatInput.tsx` - Dark theme
- `src/components/chat/MessageList.tsx` - Dark theme
- `src/components/chat/MessageBubble.tsx` - Dark theme
- `src/components/chat/MarkdownRenderer.tsx` - Dark theme
- `src/components/chat/SourcesCitation.tsx` - Dark theme
- `src/components/chat/TypingIndicator.tsx` - Dark theme
- `.env` - Fixed variable names

## Verification Results

User verified all functionality:
- ✅ API key input, persistence, validation indicator
- ✅ Model selection dropdown (custom styled)
- ✅ Chat send/receive with streaming
- ✅ Markdown rendering with syntax highlighting
- ✅ Source citations
- ✅ Mobile responsive (sidebar toggle)
- ✅ Dark theme consistent throughout
- ✅ Error handling displays properly

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Dark theme first | User preference, more important than light theme |
| Remove zod validation | AI SDK v6 internal zod conflict, manual validation works |
| Manual message parsing | AI SDK v6 uses `parts` array, not `content` string |
| Colored circle indicators | Better visibility for API key validation status |

## Phase 3 Complete

All Phase 3 requirements verified:
- KEY-01 through KEY-05: API key management ✅
- CHAT-01 through CHAT-05: Chat functionality ✅
- RENDER-01 through RENDER-03: Markdown and responsive ✅

Ready for Phase 4 (Polish) or deployment.
