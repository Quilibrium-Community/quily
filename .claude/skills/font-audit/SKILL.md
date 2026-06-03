---
name: font-audit
description: Audit Tailwind CSS files for font sizes too small on mobile and apply the mobile bump scale (`text-xs` → `text-sm sm:text-xs`, `text-sm` → `text-base sm:text-sm`). Categorises findings as needs-fix vs decorative (badges, timestamps, hints stay small). Use when the user asks to audit fonts, check font sizes, fix mobile typography, find text-xs problems, run a font audit, or check mobile readability of text. Trigger phrases include "font audit", "audit fonts", "fix small text on mobile", "check text sizes", "mobile typography audit", "text too small".
allowed-tools:
  - Read
  - Edit
  - Glob
  - Grep
  - AskUserQuestion
---

# Font Audit

Audit and fix small font sizes for mobile readability in Tailwind CSS projects.

## The Problem

`text-xs` in Tailwind is 0.75rem (12px), which is often too small on mobile devices — especially those with high pixel density. The minimum comfortable reading size on mobile is generally `text-sm` (14px).

## The Mobile Bump Scale

On screens below `sm` (640px), bump everything up one tier:

| Mobile (< 640px) | Desktop (≥ 640px) | Tailwind Pattern |
|------------------|-------------------|------------------|
| `text-sm` (14px) | `text-xs` (12px) | `text-sm sm:text-xs` |
| `text-base` (16px) | `text-sm` (14px) | `text-base sm:text-sm` |

## Patterns to Audit

| Pattern | Issue | Fix |
|---------|-------|-----|
| `text-xs` | Too small on mobile | `text-sm sm:text-xs` |
| `text-sm` | One size too small on mobile | `text-base sm:text-sm` |
| `text-[10px]` | Way too small | `text-sm` or remove |
| `text-[11px]` | Too small | `text-sm sm:text-xs` |
| `text-[12px]` | Same as text-xs | `text-sm sm:text-xs` |
| `text-[0.75rem]` | Same as text-xs | `text-sm sm:text-xs` |
| `text-[13px]` | Between xs and sm | `text-sm sm:text-xs` |
| `text-[14px]` | Same as text-sm | `text-base sm:text-sm` |
| `text-[0.875rem]` | Same as text-sm | `text-base sm:text-sm` |

## Context Matters

Not all small text needs fixing. Evaluate context:

**Usually needs the mobile bump (readable content):**
- Sidebar navigation items
- Source citations / references
- Body text or descriptions
- Form labels
- List items
- Links users need to tap
- Card content
- Modal/dialog text
- Error messages
- Help text

**Usually OK to keep at original size (decorative/non-essential):**
- Badge labels (e.g., "NEW", "BETA")
- Timestamps in dense UIs
- Character counters
- Keyboard shortcut hints
- Decorative/non-essential labels
- Footnote markers
- Icon labels that have visual redundancy

## Process

### Step 1: Display Audit Banner

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 MOBILE TYPOGRAPHY AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scanning for font sizes that may be too small on mobile...
```

### Step 2: Verify This is a Tailwind Project

Check for:
- `tailwind.config.js` or `tailwind.config.ts`
- Tailwind classes in component files

If not a Tailwind project, inform the user and exit.

### Step 3: Search for Problematic Patterns

Use Grep to search for these patterns in `.tsx`, `.jsx`, `.html`, `.vue`, `.svelte` files:

- `text-xs` usage (needs bump to text-sm on mobile)
- `text-sm` usage (needs bump to text-base on mobile)
- Arbitrary small sizes: `text-\[(10|11|12|13|14)px\]` and `text-\[0\.(75|875)rem\]`

**Important:** Exclude patterns that already have a mobile bump (e.g., `text-sm sm:text-xs` or `text-base sm:text-sm`).

### Step 4: Analyze Context for Each Finding

For each file with matches:
1. Read the file
2. Identify the component/element context
3. Categorize as:
   - **NEEDS FIX**: Readable content (sidebar items, body text, links, labels)
   - **PROBABLY OK**: Badges, hints, decorative elements
   - **REVIEW**: Unclear context, needs user input

### Step 5: Generate Audit Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 AUDIT RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found X instances of potentially small text across Y files.

## Needs Fixing - text-xs → text-sm (readable content)

| File | Line | Current | Context | Suggested Fix |
|------|------|---------|---------|---------------|
| components/Sidebar.tsx | 45 | text-xs | Navigation item | text-sm sm:text-xs |

## Needs Fixing - text-sm → text-base (readable content)

| File | Line | Current | Context | Suggested Fix |
|------|------|---------|---------|---------------|
| components/Card.tsx | 12 | text-sm | Card description | text-base sm:text-sm |

## Probably OK (decorative/badges)

| File | Line | Current | Context | Reason |
|------|------|---------|---------|--------|
| components/Badge.tsx | 12 | text-xs | Badge label | Small by design |

## Needs Review (unclear context)

| File | Line | Current | Context |
|------|------|---------|---------|
| components/Widget.tsx | 78 | text-xs | Unknown element |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 6: Ask User What to Do

Use AskUserQuestion with options: Fix all recommended / Review one by one / Show me the code / Setup fluid typography.

### Step 7: Execute Based on User Choice

#### If "Fix all recommended":

Apply the mobile bump pattern to all items in the "Needs Fixing" category. For each fix: Read the file, find the exact line, replace with the appropriate fix, confirm the change.

#### If "Review one by one":

For each finding, show the file path, line, context, current code, and suggested fix. Then ask: Apply mobile bump / Bump permanently / Skip.

#### If "Show me the code":

Display each finding with surrounding code context (5-10 lines before/after).

#### If "Setup fluid typography":

Add fluid font utilities to `tailwind.config.js`:

```javascript
// In tailwind.config.js theme.extend.fontSize:
fontSize: {
  'xs-safe': ['clamp(0.8125rem, 0.75rem + 0.2vw, 0.75rem)', { lineHeight: '1rem' }],
  'sm-fluid': ['clamp(0.875rem, 0.8rem + 0.3vw, 0.875rem)', { lineHeight: '1.25rem' }],
}
```

### Step 8: Verify Changes

After applying fixes:
1. Re-run the search to confirm fixes were applied
2. Show summary of changes made

### Step 9: Final Summary

Report files scanned, issues found, issues fixed, skipped, and a testing checklist (mobile device test, sidebar readability, source citations readability, desktop appearance unchanged).

## Notes

- `text-sm sm:text-xs` = 14px on mobile, 12px on screens ≥ 640px
- `text-base sm:text-sm` = 16px on mobile, 14px on screens ≥ 640px
- Tailwind is mobile-first: unprefixed classes apply to all sizes, `sm:` applies at 640px+
- Always preserve other classes on the element (colors, spacing, etc.)
- For a combined audit (typography + touch targets), invoke this skill alongside `touch-target-audit`.

---
*Last updated: 2026-06-03*
