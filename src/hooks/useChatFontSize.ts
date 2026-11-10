'use client';

import { useLocalStorage } from './useLocalStorage';

export const CHAT_FONT_SCALES = { small: 0.9, medium: 1, large: 1.18 } as const;
export type ChatFontSize = keyof typeof CHAT_FONT_SCALES;

/** The device's text size is the base; this preference only adjusts messages. */
export function useChatFontSize() {
  const [storedSize, setSize] = useLocalStorage<ChatFontSize>('quily-chat-font-size', 'medium');
  const size: ChatFontSize = Object.hasOwn(CHAT_FONT_SCALES, storedSize) ? storedSize : 'medium';
  return { size, setSize, scale: CHAT_FONT_SCALES[size] };
}
