# T01: 04-polish 01

**Slice:** S04 — **Milestone:** M001

## Description

Install theme infrastructure and implement light/dark mode toggle.

Purpose: Satisfies RENDER-05 requirement and establishes foundation for theme-aware components. This is foundational work that other plans depend on for consistent theming.

Output: Working theme toggle in sidebar, theme persistence via localStorage, dark mode as default.

## Must-Haves

- [ ] "User can toggle between light and dark mode"
- [ ] "Theme choice persists across page refresh"
- [ ] "Dark mode is the default theme"
- [ ] "No flash of wrong theme on page load"

## Files

- `package.json`
- `app/globals.css`
- `app/layout.tsx`
- `src/components/providers/ThemeProvider.tsx`
- `src/components/ui/ThemeToggle.tsx`
- `src/components/sidebar/Sidebar.tsx`
