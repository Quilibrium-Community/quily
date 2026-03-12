# S04: Polish

**Goal:** Install theme infrastructure and implement light/dark mode toggle.
**Demo:** Install theme infrastructure and implement light/dark mode toggle.

## Must-Haves


## Tasks

- [x] **T01: 04-polish 01** `est:10min`
  - Install theme infrastructure and implement light/dark mode toggle.

Purpose: Satisfies RENDER-05 requirement and establishes foundation for theme-aware components. This is foundational work that other plans depend on for consistent theming.

Output: Working theme toggle in sidebar, theme persistence via localStorage, dark mode as default.
- [x] **T02: 04-polish 02** `est:2min`
  - Create reusable clipboard hook and UI components for copy functionality and loading states.

Purpose: Provides building blocks for RENDER-04 (code copy), POLISH-01 (message copy), and POLISH-03 (skeletons). These are standalone utilities that other plans will consume.

Output: useCopyToClipboard hook, CopyButton component with visual feedback, Skeleton components.
- [x] **T03: 04-polish 03** `est:3min`
  - Add copy functionality to code blocks and message bubbles.

Purpose: Satisfies RENDER-04 (copy code snippets) and POLISH-01 (copy entire response). Users can easily share code examples and full responses.

Output: Code blocks have hover-reveal copy buttons; assistant messages have visible copy button in header.
- [x] **T04: 04-polish 04**
  - Move API key configuration from inline sidebar to modal dialog with OpenRouter explanation.

Purpose: Satisfies POLISH-04. Modal provides better UX for configuration (focused attention, clear CTA) and includes helpful context about OpenRouter for new users.

Output: API key button in sidebar triggers modal with form, explanation, and signup link.
- [x] **T05: 04-polish 05**
  - Add keyboard shortcuts, loading skeletons, and perform final integration verification.

Purpose: Satisfies POLISH-02 (keyboard shortcuts) and POLISH-03 (loading skeletons). Final plan ensures all polish features work together.

Output: Keyboard shortcuts work globally, skeletons show during load, all Phase 4 requirements verified.

## Files Likely Touched

- `package.json`
- `app/globals.css`
- `app/layout.tsx`
- `src/components/providers/ThemeProvider.tsx`
- `src/components/ui/ThemeToggle.tsx`
- `src/components/sidebar/Sidebar.tsx`
- `src/hooks/useCopyToClipboard.ts`
- `src/components/ui/CopyButton.tsx`
- `src/components/ui/Skeleton.tsx`
- `src/components/chat/MarkdownRenderer.tsx`
- `src/components/chat/MessageBubble.tsx`
- `src/components/ui/ApiKeyModal.tsx`
- `src/components/sidebar/Sidebar.tsx`
- `src/components/sidebar/ApiKeyConfig.tsx`
- `src/components/chat/ChatInput.tsx`
- `src/components/chat/ChatContainer.tsx`
- `app/page.tsx`
