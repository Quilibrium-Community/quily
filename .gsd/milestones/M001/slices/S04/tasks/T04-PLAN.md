# T04: 04-polish 04

**Slice:** S04 — **Milestone:** M001

## Description

Move API key configuration from inline sidebar to modal dialog with OpenRouter explanation.

Purpose: Satisfies POLISH-04. Modal provides better UX for configuration (focused attention, clear CTA) and includes helpful context about OpenRouter for new users.

Output: API key button in sidebar triggers modal with form, explanation, and signup link.

## Must-Haves

- [ ] "API key configuration opens in modal dialog (not inline in sidebar)"
- [ ] "Modal includes OpenRouter explanation and signup link"
- [ ] "Modal has proper focus trap and escape-to-close"
- [ ] "Modal is accessible (ARIA labels, focus management)"

## Files

- `src/components/ui/ApiKeyModal.tsx`
- `src/components/sidebar/Sidebar.tsx`
- `src/components/sidebar/ApiKeyConfig.tsx`
