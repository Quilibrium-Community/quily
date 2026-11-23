'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

// Must match --color-bg-base in app/globals.css for each theme.
const BAR_COLORS = { light: '#fcfcfc', dark: '#1a1f2e' } as const;

/**
 * Keeps the phone's status and navigation bars the same color as the app
 * background, following the in-app theme toggle rather than the OS setting.
 */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = resolvedTheme === 'light' ? BAR_COLORS.light : BAR_COLORS.dark;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = color;
  }, [resolvedTheme]);

  return null;
}
