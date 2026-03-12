# T03: 04-polish 03

**Slice:** S04 — **Milestone:** M001

## Description

Add copy functionality to code blocks and message bubbles.

Purpose: Satisfies RENDER-04 (copy code snippets) and POLISH-01 (copy entire response). Users can easily share code examples and full responses.

Output: Code blocks have hover-reveal copy buttons; assistant messages have visible copy button in header.

## Must-Haves

- [ ] "User can copy code snippets with one click (copy button on code blocks)"
- [ ] "User can copy entire assistant response with one click"
- [ ] "Copy button appears on hover for code blocks"
- [ ] "Copy button always visible for message copy"

## Files

- `src/components/chat/MarkdownRenderer.tsx`
- `src/components/chat/MessageBubble.tsx`
