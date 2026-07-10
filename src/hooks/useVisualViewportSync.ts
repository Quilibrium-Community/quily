'use client';

import { useEffect } from 'react';

/**
 * Keeps the CSS variable --app-height aligned with the actually-visible viewport
 * height (window.visualViewport), keyboard included.
 *
 * Why it's needed: on iOS Safari the on-screen keyboard does NOT resize the
 * layout viewport (and iOS ignores the `interactive-widget` viewport directive),
 * so a 100dvh-tall layout leaves the bottom chat input hidden behind the
 * keyboard. Shrinking the app container to visualViewport.height compresses the
 * chat and keeps the input visible above the keyboard. On Android,
 * `interactive-widget=resizes-content` already does the job and the value here
 * coincides with 100dvh.
 *
 * .h-screen-safe (globals.css) uses var(--app-height, 100dvh): without JS or
 * without visualViewport it degrades to 100dvh.
 */
export function useVisualViewportSync() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const root = document.documentElement;

    const sync = () => {
      // During pinch-zoom the visual height shrinks because of the zoom, not the
      // keyboard: leave the layout untouched.
      if (vv.scale > 1.01) return;
      root.style.setProperty('--app-height', `${vv.height}px`);
      // iOS "pans" the page when the keyboard opens: re-anchor to the top so the
      // resized layout stays fully visible.
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };

    sync();
    vv.addEventListener('resize', sync);
    vv.addEventListener('scroll', sync);
    return () => {
      vv.removeEventListener('resize', sync);
      vv.removeEventListener('scroll', sync);
      root.style.removeProperty('--app-height');
    };
  }, []);
}
