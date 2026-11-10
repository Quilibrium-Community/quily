---
type: doc
title: "Message text size follows the device"
status: done
created: 2026-11-10
updated: 2026-11-10
---

# Message text size follows the device

Ported from Kaya on 2026-11-10 after `git pull --ff-only` brought local main to
`9c47de7`. Reference: `E:/GitHub/.field-notes/web-mobile-text-size-os-scaling-and-layout.md`.

Android opts in with `meta[name=text-scale]`; iOS uses `font: -apple-system-body`
only for coarse pointers, with font family, weight and line height restored.
The browser's initial size remains intact; iOS fields retain a 16px minimum.
Zoom is unrestricted.

Settings now offers **Smaller / Follow device / Larger**, with an immediate
preview. `useChatFontSize` persists `small / medium / large` under
`quily-chat-font-size`, defaulting to medium; invalid values fall back to medium.
The multipliers are 0.9 / 1 / 1.18, matching Kaya. The shared app layout supplies
the variable so settings changes affect existing conversations without remounting
the chat or changing provider, key, model or conversation storage.

Message body sizes match Kaya: 1.0625rem for assistant and 0.9375rem for user,
multiplied by the preference. Previously both inherited the normal body size.
Settings badges formerly fixed at 10px now use 0.625rem. Long links use ordinary
word wrapping; code and tables retain internal horizontal scrolling. The input
can shrink within its row and its scroll threshold uses the computed max-height.

## Verification

- `yarn typecheck` and production build passed; immutable dependency installation
  left the lockfile unchanged.
- Real Settings page and a synthetic conversation loaded through the actual home
  page in Chromium. No model requests, API keys, or database writes were needed.
- The preview's resize command returned 1280px despite requesting 390px, so narrow
  layout measurements used a same-origin iframe at **390 × 844**. This tests CSS
  layout, not a mobile user agent or touch device.
- Settings and chat at root 100/125/150/200%: document width stayed 390px. Chat also
  passed with multiplier 1.18 at every scale. Markdown included headings, lists,
  a long URL, code and a table; overflow remained inside code/table containers.
- Chat input remained visible: at 200% its bottom was y=811 within 844px.
- Assistant computed sizes at 100%: 17px / larger 20.06px; at 150%: 25.5px /
  larger 30.09px; at 200%: 34px / larger 40.12px.
- Selecting Larger saved the choice and restored it on navigation; returning to
  Follow device saved medium and restored the normal preview.

Still requires actual iPhone Dynamic Type, Android Chrome text-scale, installed
PWA and virtual keyboard checks. Browser root overrides cannot prove OS integration.
Publication requested on 2026-11-10: commit and push to main trigger the Vercel
production deployment. The Discord bot on the VPS is unchanged.
