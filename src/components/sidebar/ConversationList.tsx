'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useConversationStore, Conversation } from '@/src/stores/conversationStore';
import { Icon } from '@/src/components/ui/Icon';

/**
 * Truncate text to max length with ellipsis.
 */
function truncateTitle(title: string, maxLength: number = 30): string {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength) + '...';
}

interface ConversationListProps {
  onNavigate?: () => void;
  /** Secondary nav items (About, Links) rendered at top of scroll area */
  secondaryNav?: React.ReactNode;
  /** Callback when secondary nav scrolls out of view */
  onSecondaryNavHidden?: (hidden: boolean) => void;
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onStartSelection: () => void;
  onTogglePinned: () => void;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onStartSelection,
  onTogglePinned,
  onRename,
  onDelete,
}: ConversationItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(conversation.title);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset delete confirmation after 3 seconds or when menu closes
  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== conversation.title) {
      onRename(trimmed);
    }
    setIsRenaming(false);
    setRenameValue(conversation.title);
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
    setRenameValue(conversation.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleRenameCancel();
    }
  };

  return (
    <div
      className={`
        group relative
        px-3 py-3 sm:py-2
        rounded-lg
        cursor-pointer
        transition-colors
        min-h-11 sm:min-h-0
        ${
          isActive
            ? 'bg-surface/15 dark:bg-surface/20'
            : 'hover:bg-surface/8 dark:hover:bg-surface/10'
        }
      `}
      onClick={(event) => {
        if (isRenaming) return;
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          onStartSelection();
        } else {
          onSelect();
        }
      }}
    >
      <div className="pr-8">
        {isRenaming ? (
          <input
            ref={inputRef}
            type="text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full
              text-base sm:text-sm font-medium
              bg-transparent
              border-b border-text-primary/30
              text-text-primary
              outline-none
              focus:border-text-primary
            "
          />
        ) : (
          <p
            className={`text-base sm:text-sm font-medium truncate ${
              isActive ? 'text-text-primary' : 'text-text-primary sm:text-text-muted'
            }`}
          >
            {truncateTitle(conversation.title)}
          </p>
        )}
      </div>

      {/* Dropdown menu - always visible */}
      <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="
                p-2.5 sm:p-1.5 rounded
                min-w-11 min-h-11 sm:min-w-0 sm:min-h-0
                flex items-center justify-center
                text-gray-400 dark:text-gray-500
                hover:text-text-primary
                hover:bg-surface/15 dark:hover:bg-surface/20
                transition-all
              "
              aria-label="Chat options"
            >
              <Icon name="more-horizontal" size={18} className="sm:w-4 sm:h-4" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="
                min-w-44 p-1.5 sm:p-1
                bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                rounded-lg shadow-xl
                animate-in fade-in-0 zoom-in-95
                z-50
              "
              sideOffset={5}
              align="end"
            >
              <DropdownMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePinned();
                }}
                className="
                  flex items-center gap-3 sm:gap-2 px-3 sm:px-2 py-3 sm:py-1.5
                  min-h-11 sm:min-h-0
                  text-base sm:text-sm text-text-primary
                  rounded cursor-pointer
                  outline-none
                  hover:bg-surface/10 dark:hover:bg-surface/15
                  focus:bg-surface/10 dark:focus:bg-surface/15
                "
              >
                <Icon
                  name={conversation.pinned ? 'lucide:pin-off' : 'lucide:pin'}
                  size={18}
                  className="sm:w-4 sm:h-4"
                />
                {conversation.pinned ? 'Unpin' : 'Pin'}
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                }}
                className="
                  flex items-center gap-3 sm:gap-2 px-3 sm:px-2 py-3 sm:py-1.5
                  min-h-11 sm:min-h-0
                  text-base sm:text-sm text-text-primary
                  rounded cursor-pointer
                  outline-none
                  hover:bg-surface/10 dark:hover:bg-surface/15
                  focus:bg-surface/10 dark:focus:bg-surface/15
                "
              >
                <Icon name="edit-2" size={18} className="sm:w-4 sm:h-4" />
                Rename
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={(event) => event.stopPropagation()}
                onSelect={onStartSelection}
                className="
                  flex items-center gap-3 sm:gap-2 px-3 sm:px-2 py-3 sm:py-1.5
                  min-h-11 sm:min-h-0 text-base sm:text-sm text-text-primary
                  rounded cursor-pointer outline-none
                  hover:bg-surface/10 dark:hover:bg-surface/15
                  focus:bg-surface/10 dark:focus:bg-surface/15
                "
              >
                <Icon name="check-square" size={18} className="sm:w-4 sm:h-4" />
                Select chats
              </DropdownMenu.Item>

              <DropdownMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (deleteConfirm) {
                    onDelete();
                    setDeleteConfirm(false);
                  } else {
                    setDeleteConfirm(true);
                    // Auto-reset after 3 seconds
                    if (deleteTimeoutRef.current) {
                      clearTimeout(deleteTimeoutRef.current);
                    }
                    deleteTimeoutRef.current = setTimeout(() => {
                      setDeleteConfirm(false);
                    }, 3000);
                  }
                }}
                onSelect={(e) => e.preventDefault()}
                className={`
                  flex items-center gap-3 sm:gap-2 px-3 sm:px-2 py-3 sm:py-1.5
                  min-h-11 sm:min-h-0
                  text-base sm:text-sm
                  rounded cursor-pointer
                  outline-none
                  transition-colors
                  ${deleteConfirm
                    ? 'text-white bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700'
                    : 'text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10 focus:bg-red-500/10 dark:focus:bg-red-400/10'
                  }
                `}
              >
                <Icon name="trash-2" size={18} className="sm:w-4 sm:h-4" />
                {deleteConfirm ? 'Sure?' : 'Delete'}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

/**
 * Scrollable conversation history list.
 *
 * Uses Zustand store for conversation state.
 * Waits for hydration before rendering to prevent SSR mismatch.
 * New Chat button and Settings are handled by parent Sidebar component.
 */
export function ConversationList({ onNavigate, secondaryNav, onSecondaryNavHidden }: ConversationListProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const conversations = useConversationStore((s) => s.conversations);
  const activeId = useConversationStore((s) => s.activeId);
  const hasHydrated = useConversationStore((s) => s._hasHydrated);
  const setActive = useConversationStore((s) => s.setActive);
  const deleteConversation = useConversationStore((s) => s.deleteConversation);
  const deleteConversations = useConversationStore((s) => s.deleteConversations);
  const togglePinned = useConversationStore((s) => s.togglePinned);
  const updateTitle = useConversationStore((s) => s.updateTitle);
  const [selectedIds, setSelectedIds] = useState<Set<string> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // State for collapsible sections
  const [pinnedCollapsed, setPinnedCollapsed] = useState(false);
  const [recentsCollapsed, setRecentsCollapsed] = useState(false);

  // Refs for scroll tracking
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const secondaryNavRef = useRef<HTMLDivElement>(null);

  const selecting = selectedIds !== null && conversations.length > 0;
  const pinnedExpanded = selecting || !pinnedCollapsed;
  const recentsExpanded = selecting || !recentsCollapsed;

  useEffect(() => {
    if (selecting) {
      scrollContainerRef.current?.querySelector<HTMLInputElement>('input[type="checkbox"]:checked')?.focus({ preventScroll: true });
    } else {
      setSelectedIds(null);
      setShowDeleteConfirm(false);
    }
  }, [selecting]);

  // Track when secondary nav scrolls out of view
  useEffect(() => {
    if (!secondaryNav || !onSecondaryNavHidden) return;

    const scrollContainer = scrollContainerRef.current;
    const secondaryNavEl = secondaryNavRef.current;
    if (!scrollContainer || !secondaryNavEl) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      // Show separator as soon as user starts scrolling (threshold of 8px)
      const isHidden = scrollTop > 8;
      onSecondaryNavHidden(isHidden);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [secondaryNav, onSecondaryNavHidden]);

  // Show skeleton while hydrating
  if (!hasHydrated) {
    return (
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <div className="h-14 bg-surface/10 dark:bg-surface/15 rounded-lg animate-pulse" />
        <div className="h-14 bg-surface/10 dark:bg-surface/15 rounded-lg animate-pulse" />
        <div className="h-14 bg-surface/10 dark:bg-surface/15 rounded-lg animate-pulse" />
      </div>
    );
  }

  // Sort by createdAt (newest first) for stable positioning
  const sortedConversations = [...conversations].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  // Split into pinned and recent sections
  const pinnedConversations = sortedConversations.filter((c) => c.pinned);
  const recentConversations = sortedConversations.filter((c) => !c.pinned);
  const selectedConversations = sortedConversations.filter(({ id }) => selectedIds?.has(id));
  const selectedCount = selectedConversations.length;

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      if (!current) return current;
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (!selectedCount) return;
    deleteConversations(selectedConversations.map(({ id }) => id));
    setShowDeleteConfirm(false);
    setSelectedIds(null);
  };

  const handleSelect = (id: string) => {
    setActive(id);
    if (pathname !== '/') {
      router.push('/');
    }
    onNavigate?.();
  };

  const renderConversation = (conversation: Conversation) => selecting ? (
    <label
      key={conversation.id}
      className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-base text-text-primary hover:bg-surface/10 sm:text-sm"
    >
      <input
        type="checkbox"
        className="size-4 shrink-0"
        checked={selectedIds?.has(conversation.id) ?? false}
        onChange={() => toggleSelected(conversation.id)}
      />
      <span className="truncate">{conversation.title}</span>
    </label>
  ) : (
    <ConversationItem
      key={conversation.id}
      conversation={conversation}
      isActive={activeId === conversation.id}
      onSelect={() => handleSelect(conversation.id)}
      onStartSelection={() => setSelectedIds(new Set([conversation.id]))}
      onTogglePinned={() => togglePinned(conversation.id)}
      onRename={(newTitle) => updateTitle(conversation.id, newTitle)}
      onDelete={() => deleteConversation(conversation.id)}
    />
  );

  return (
    <>
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-2 pb-2 space-y-1 sidebar-scrollbar"
      >
        {/* Secondary nav items scroll away naturally under the fixed nav */}
        {secondaryNav && (
          <div ref={secondaryNavRef}>
            {secondaryNav}
          </div>
        )}

        {/* Separator between nav items and conversations */}
        {secondaryNav && sortedConversations.length > 0 && (
          <div className="border-b border-surface/15 dark:border-surface/20 my-2 -mx-2" />
        )}

        {sortedConversations.length === 0 ? (
          <p className="text-base sm:text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No conversations yet
          </p>
        ) : (
          <>
            {/* Pinned section */}
            {pinnedConversations.length > 0 && (
              <div className="mb-2">
                <button
                  onClick={() => setPinnedCollapsed(!pinnedCollapsed)}
                  aria-expanded={pinnedExpanded}
                  disabled={selecting}
                  className="
                    w-full flex items-center gap-2 sm:gap-1 px-3 py-2.5 sm:py-1
                    min-h-11 sm:min-h-0
                    text-sm sm:text-xs font-medium text-text-primary sm:text-gray-500 sm:dark:text-gray-400 uppercase tracking-wider
                    hover:text-text-primary transition-colors
                  "
                >
                  <Icon
                    name="chevron-down"
                    size={14}
                    className={`sm:w-3 sm:h-3 transition-transform ${pinnedExpanded ? '' : '-rotate-90'}`}
                  />
                  Pinned
                </button>
                {pinnedExpanded && (
                  <div className="space-y-1">
                    {pinnedConversations.map(renderConversation)}
                  </div>
                )}
              </div>
            )}

            {/* Recents section */}
            {recentConversations.length > 0 && (
              <div>
                {pinnedConversations.length > 0 && (
                  <button
                    onClick={() => setRecentsCollapsed(!recentsCollapsed)}
                    aria-expanded={recentsExpanded}
                    disabled={selecting}
                    className="
                      w-full flex items-center gap-2 sm:gap-1 px-3 py-2.5 sm:py-1
                      min-h-11 sm:min-h-0
                      text-sm sm:text-xs font-medium text-text-primary sm:text-gray-500 sm:dark:text-gray-400 uppercase tracking-wider
                      hover:text-text-primary transition-colors
                    "
                  >
                    <Icon
                      name="chevron-down"
                      size={14}
                      className={`sm:w-3 sm:h-3 transition-transform ${recentsExpanded ? '' : '-rotate-90'}`}
                    />
                    Recents
                  </button>
                )}
                {(recentsExpanded || pinnedConversations.length === 0) && (
                  <div className="space-y-1">
                    {recentConversations.map(renderConversation)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {selecting && (
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-surface/15 px-2 py-2">
          <button
            type="button"
            onClick={() => setSelectedIds(null)}
            className="min-h-11 min-w-11 rounded-lg px-2 text-base text-text-primary hover:bg-surface/10 sm:text-sm"
          >
            Cancel
          </button>
          <Dialog.Root open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                disabled={selectedCount === 0}
                className="min-h-11 min-w-11 rounded-lg px-2 text-base text-red-600 hover:bg-red-500/10 disabled:opacity-50 sm:text-sm dark:text-red-400"
              >
                Delete ({selectedCount})
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 animate-in fade-in-0" />
              <Dialog.Content
                className="fixed top-1/2 left-1/2 z-50 w-11/12 max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95 dark:border-gray-700 dark:bg-gray-900"
              >
                <Dialog.Title className="text-lg font-semibold text-text-primary">
                  Delete {selectedCount} {selectedCount === 1 ? 'chat' : 'chats'}?
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-base text-gray-500 sm:text-sm dark:text-gray-400">
                  The selected chat history will be permanently deleted.
                </Dialog.Description>
                <div className="mt-6 flex justify-end gap-3">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="min-h-11 min-w-11 rounded-lg bg-btn-secondary px-4 text-base font-medium text-text-primary hover:bg-btn-secondary-hover sm:text-sm"
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    disabled={selectedCount === 0}
                    className="min-h-11 min-w-11 rounded-lg bg-btn-danger px-4 text-base font-medium text-white hover:bg-btn-danger-hover disabled:opacity-50 sm:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      )}
    </>
  );
}
