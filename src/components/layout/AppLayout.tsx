'use client';

import { Sidebar } from '@/src/components/sidebar/Sidebar';
import { SearchProvider } from '@/src/contexts/SearchContext';
import { SidebarProvider, useSidebar } from '@/src/contexts/SidebarContext';
import { useVisualViewportSync } from '@/src/hooks/useVisualViewportSync';

/**
 * Main application layout with persistent sidebar.
 *
 * This component keeps the Sidebar mounted across all page navigations
 * to prevent flickering/re-rendering when changing routes.
 *
 * Includes SearchProvider for global Ctrl/Cmd+K search shortcut.
 * Includes SidebarProvider for shared sidebar open/close state.
 *
 * Layout:
 * - Mobile (< lg): Fixed header bar with hamburger + chat title, content has top padding
 * - Desktop (lg+): Sidebar open by default, pushes content; can collapse to icon bar (w-14)
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SearchProvider>
        <AppLayoutInner>{children}</AppLayoutInner>
      </SearchProvider>
    </SidebarProvider>
  );
}

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  // Keeps --app-height in sync with the visible viewport so the mobile keyboard
  // never hides the chat input (iOS Safari especially). No-op on desktop.
  useVisualViewportSync();

  return (
    <div className="flex h-screen-safe bg-bg-base">
      <Sidebar />
      {/* Main content area
          - pt-14 (+ safe-area top) on mobile for the fixed header bar, which now
            extends under the notch via viewportFit: 'cover'
          - lg:pt-0 on desktop (no fixed header)
          - lg:pl-14 on desktop when sidebar is collapsed (icon bar width)
          - lg:pl-0 when sidebar is expanded (sidebar is in normal flow)
      */}
      <main
        className={`
          flex-1 flex flex-col min-w-0 pt-[calc(3.5rem+env(safe-area-inset-top))] lg:pt-0
          transition-[padding] duration-200
          ${isOpen ? 'lg:pl-0' : 'lg:pl-14'}
        `}
      >
        {children}
      </main>
    </div>
  );
}
