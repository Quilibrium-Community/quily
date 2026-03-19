// scripts/sync-discord/recap-filter.ts
import type { DiscordMessage } from './types.js';

/** Cassie's Discord user ID — lead dev, messages bypass noise filters */
const CASSIE_USER_ID = '597996105300705301';

/** Minimum message length to keep (excludes Cassie) */
const MIN_MESSAGE_LENGTH = 15;

/** Single-word/short noise patterns (case-insensitive, full match) */
const NOISE_PATTERNS = [
  /^gm+$/i,
  /^gn+$/i,
  /^g?nights?$/i,
  /^hey+$/i,
  /^hi+$/i,
  /^hello+$/i,
  /^yo+$/i,
  /^sup$/i,
  /^lol+$/i,
  /^lmao+$/i,
  /^rofl$/i,
  /^haha+$/i,
  /^wen\b/i,
  /^moon$/i,
  /^pump$/i,
  /^wagmi$/i,
  /^ngmi$/i,
  /^nice+$/i,
  /^thanks?$/i,
  /^ty+$/i,
  /^np$/i,
  /^yes+$/i,
  /^no+$/i,
  /^ok+$/i,
  /^k+$/i,
  /^same$/i,
  /^this$/i,
  /^true$/i,
  /^rip$/i,
  /^f$/i,
  /^gg$/i,
  /^\+1$/,
  /^100$/,
];

/** Check if message content is only emojis, custom Discord emojis, or whitespace */
function isEmojiOnly(content: string): boolean {
  // Remove custom Discord emojis <:name:id> and <a:name:id>
  const withoutCustom = content.replace(/<a?:\w+:\d+>/g, '').trim();
  // Remove standard Unicode emojis (broad pattern)
  const withoutEmoji = withoutCustom.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d\ufe0f]/gu, '').trim();
  return withoutEmoji.length === 0;
}

/** Check if message is only a URL or attachment reference with no commentary */
function isUrlOnly(content: string): boolean {
  const trimmed = content.trim();
  // Single URL (possibly with protocol)
  return /^https?:\/\/\S+$/i.test(trimmed);
}

export interface FilteredMessage {
  message: DiscordMessage;
  isCassie: boolean;
}

/**
 * Filter general channel messages, removing noise.
 * Cassie's messages bypass all noise filters but are NOT automatically
 * included in the recap — the LLM decides which are substantive.
 */
export function filterMessages(messages: DiscordMessage[]): FilteredMessage[] {
  return messages
    .filter((msg) => {
      // Always drop bot messages
      if (msg.author.bot) return false;

      // Cassie bypasses all other filters
      if (msg.author.id === CASSIE_USER_ID) return true;

      const content = msg.content.trim();

      // Drop empty messages (attachment-only with no text)
      if (!content && msg.embeds.length === 0) return false;

      // Drop short messages
      if (content.length < MIN_MESSAGE_LENGTH) return false;

      // Drop emoji-only messages
      if (isEmojiOnly(content)) return false;

      // Drop URL-only messages (no commentary)
      if (isUrlOnly(content)) return false;

      // Drop noise patterns
      if (NOISE_PATTERNS.some((p) => p.test(content))) return false;

      return true;
    })
    .map((msg) => ({
      message: msg,
      isCassie: msg.author.id === CASSIE_USER_ID,
    }));
}
