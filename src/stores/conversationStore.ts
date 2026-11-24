import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Generate a UUID, with fallback for environments where crypto.randomUUID is unavailable.
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback using crypto.getRandomValues
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> (c === 'x' ? 0 : 3);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Source citation attached to a message.
 */
export interface MessageSource {
  sourceId: string;
  url: string;
  title?: string;
}

/**
 * Message in a conversation.
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: MessageSource[];
  /** RAG retrieval quality for confidence indicator (only on assistant messages) */
  ragQuality?: 'high' | 'low' | 'none';
}

/**
 * Conversation with message history.
 */
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
}

/**
 * Maximum number of conversations to keep in storage.
 * Oldest conversations are deleted when this limit is exceeded.
 */
const MAX_CONVERSATIONS = 50;

interface ConversationStore {
  conversations: Conversation[];
  activeId: string | null;
  // Navigation remounts the chat. Saving its first message keeps the current mount.
  chatRevision: number;
  _hasHydrated: boolean;

  // Actions
  addConversation: (title?: string) => string;
  setActive: (id: string | null) => void;
  updateMessages: (id: string, messages: Message[]) => void;
  updateTitle: (id: string, title: string) => void;
  togglePinned: (id: string) => void;
  deleteConversation: (id: string) => void;
  deleteConversations: (ids: readonly string[]) => void;
  getActiveConversation: () => Conversation | null;
}

/**
 * Zustand store for managing chat conversations.
 *
 * Persists to localStorage with automatic hydration.
 * Use `_hasHydrated` to prevent hydration mismatch in SSR.
 *
 * Usage:
 * ```tsx
 * const { conversations, activeId, addConversation } = useConversationStore();
 *
 * // Wait for hydration before rendering persisted state
 * const hasHydrated = useConversationStore((s) => s._hasHydrated);
 * if (!hasHydrated) return <Loading />;
 * ```
 */
export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeId: null,
      chatRevision: 0,
      _hasHydrated: false,

      addConversation: (title?: string) => {
        const id = generateUUID();
        const now = Date.now();

        const newConversation: Conversation = {
          id,
          title: title || 'New conversation',
          messages: [],
          createdAt: now,
          updatedAt: now,
          pinned: false,
        };

        set((state) => {
          // Add new conversation at the beginning
          let conversations = [newConversation, ...state.conversations];

          // Enforce max limit - remove oldest if exceeded
          if (conversations.length > MAX_CONVERSATIONS) {
            conversations = conversations.slice(0, MAX_CONVERSATIONS);
          }

          return {
            conversations,
            activeId: id,
          };
        });

        return id;
      },

      setActive: (id: string | null) => {
        const { activeId, chatRevision } = get();
        if (id !== activeId) {
          set({ activeId: id, chatRevision: chatRevision + 1 });
        }
      },

      updateMessages: (id: string, messages: Message[]) => {
        set((state) => {
          const conversations = state.conversations.map((conv) => {
            if (conv.id !== id) return conv;

            // Auto-generate title from first user message if still default
            let title = conv.title;
            if (title === 'New conversation' && messages.length > 0) {
              const firstUserMsg = messages.find((m) => m.role === 'user');
              if (firstUserMsg) {
                title = firstUserMsg.content.slice(0, 50);
                if (firstUserMsg.content.length > 50) {
                  title += '...';
                }
              }
            }

            return {
              ...conv,
              messages,
              title,
              updatedAt: Date.now(),
            };
          });

          return { conversations };
        });
      },

      updateTitle: (id: string, title: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title, updatedAt: Date.now() } : conv
          ),
        }));
      },

      togglePinned: (id: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, pinned: !conv.pinned } : conv
          ),
        }));
      },

      deleteConversation: (id: string) => {
        get().deleteConversations([id]);
      },

      deleteConversations: (ids) => {
        const selected = new Set(ids);
        set((state) => {
          const conversations = state.conversations.filter((c) => !selected.has(c.id));
          if (state.activeId !== null && selected.has(state.activeId)) {
            return { conversations, activeId: null, chatRevision: state.chatRevision + 1 };
          }
          return { conversations };
        });
      },

      getActiveConversation: () => {
        const state = get();
        if (!state.activeId) return null;
        return state.conversations.find((c) => c.id === state.activeId) || null;
      },
    }),
    {
      name: 'chat-conversations',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        activeId: state.activeId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Preserve pins from histories saved with the original starred field.
          state.conversations = state.conversations.map(
            ({ starred, ...conv }: Conversation & { starred?: boolean }) => ({
              ...conv,
              pinned: conv.pinned ?? starred ?? false,
            })
          );
          state._hasHydrated = true;
        }
      },
    }
  )
);
