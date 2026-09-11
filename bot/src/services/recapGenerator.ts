// bot/src/services/recapGenerator.ts
// Generates daily community recaps from Discord channel messages.
// Ported from scripts/sync-discord/recap-filter.ts + recap-summarizer.ts

import type { AnyThreadChannel, ForumChannel, Message, TextChannel } from 'discord.js';
import { ChannelType } from 'discord.js';
import { reasoningSettings } from '../../../src/lib/openrouter-reasoning';

/** Cassie's Discord user ID — lead dev, messages bypass noise filters */
const CASSIE_USER_ID = '597996105300705301';
const MIN_MESSAGE_LENGTH = 15;

const NOISE_PATTERNS = [
  /^gm+$/i, /^gn+$/i, /^g?nights?$/i, /^hey+$/i, /^hi+$/i, /^hello+$/i,
  /^yo+$/i, /^sup$/i, /^lol+$/i, /^lmao+$/i, /^rofl$/i, /^haha+$/i,
  /^wen\b/i, /^moon$/i, /^pump$/i, /^wagmi$/i, /^ngmi$/i, /^nice+$/i,
  /^thanks?$/i, /^ty+$/i, /^np$/i, /^yes+$/i, /^no+$/i, /^ok+$/i,
  /^k+$/i, /^same$/i, /^this$/i, /^true$/i, /^rip$/i, /^f$/i, /^gg$/i,
  /^\+1$/, /^100$/,
];

export interface FilteredMessage {
  authorName: string;
  authorId: string;
  content: string;
  timestamp: Date;
  isCassie: boolean;
  embeds: { title?: string; description?: string }[];
}

/** Sentinel returned by LLM when channel content is not worth recapping */
export const SKIP_EMPTY = 'SKIP_EMPTY';

export interface ChannelRecapResult {
  channelId: string;
  channelName: string;
  content: string;
  date: string;
  messageCount: number;
}

function isEmojiOnly(content: string): boolean {
  const withoutCustom = content.replace(/<a?:\w+:\d+>/g, '').trim();
  const withoutEmoji = withoutCustom
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}\u200d\ufe0f]/gu, '')
    .trim();
  return withoutEmoji.length === 0;
}

function isUrlOnly(content: string): boolean {
  return /^https?:\/\/\S+$/i.test(content.trim());
}

export function filterRecapMessages(messages: Message[]): FilteredMessage[] {
  return messages
    .filter((msg) => {
      if (msg.author.bot) return false;
      if (msg.author.id === CASSIE_USER_ID) return true;
      const content = msg.content.trim();
      if (!content && msg.embeds.length === 0) return false;
      if (content.length < MIN_MESSAGE_LENGTH) return false;
      if (isEmojiOnly(content)) return false;
      if (isUrlOnly(content)) return false;
      if (NOISE_PATTERNS.some((p) => p.test(content))) return false;
      return true;
    })
    .map((msg) => ({
      authorName: msg.author.displayName,
      authorId: msg.author.id,
      content: msg.content,
      timestamp: msg.createdAt,
      isCassie: msg.author.id === CASSIE_USER_ID,
      embeds: msg.embeds.map((e) => ({
        title: e.title ?? undefined,
        description: e.description ?? undefined,
      })),
    }));
}

// ---------------------------------------------------------------------------
// LLM Summarizer
// ---------------------------------------------------------------------------

const DEFAULT_RECAP_MODEL = '~deepseek/deepseek-v4-flash-latest';
const MAX_INPUT_CHARS = 60_000;

// Output budget, SHARED with the thinking phase whenever reasoning is on. With
// reasoning off a full recap costs ~400-500 completion tokens (measured against
// real #general traffic, 2026-09-11), so 1500 is roomy. With reasoning on the
// 0731 revision of V4 Flash spends 400-1650 of it thinking and regularly hands
// back nothing at all — see the block comment on summarizeForRecap.
const MAX_RECAP_OUTPUT_TOKENS = 1500;

const SKIP_EMPTY_RULE = `

IMPORTANT: If the remaining messages are only casual banter, jokes, GIFs, memes, or off-topic chitchat with no substance, respond with exactly "SKIP_EMPTY" and nothing else. Only produce a recap if the discussion includes at least one of: project updates, crypto/blockchain topics, privacy, decentralization, technical/technology discussion, troubleshooting, community decisions, governance, ecosystem developments, or other topics relevant to the Quilibrium community.`;

const GENERAL_SYSTEM_PROMPT = `You are a community recap writer for the Quilibrium Discord server. You produce concise daily recaps of community discussion.

Rules:
- Group discussion by topic/theme using markdown headings (## Topic Name)
- Messages tagged [LEAD DEV] are from Cassie, the lead developer of Quilibrium. If she made substantive contributions, highlight them in a dedicated "## From Cassie" section. Skip her casual/noise messages (greetings, jokes, etc.) just like you would for anyone else.
- Include any links or resources that were shared, with context about what they are
- Cover ALL topics discussed, not just Quilibrium-specific ones
- Skip: price speculation, casual greetings, memes, GIFs, off-topic noise
- Keep output concise: 200-500 words
- Use markdown formatting
- If no substantive discussion happened, write a short note saying it was a quiet day
- Do NOT use @username mentions — write usernames without the @ symbol to avoid triggering Discord notifications
- Do NOT invent or fabricate any information — only summarize what is in the messages` + SKIP_EMPTY_RULE;

const ANNOUNCEMENT_SYSTEM_PROMPT = `You are a digest writer for the Quilibrium Discord server. Summarize the key announcements and updates posted in this channel.

Rules:
- List each announcement as a bullet point with context
- Messages tagged [LEAD DEV] are from Cassie, the lead developer — attribute important updates to her
- Include links shared with a brief description of what they reference
- Keep it concise: 100-300 words
- Use markdown formatting
- Do NOT use @username mentions — write usernames without the @ symbol to avoid triggering Discord notifications
- Do NOT invent or fabricate any information — only summarize what is in the messages` + SKIP_EMPTY_RULE;

/** Channels that use the general discussion prompt (by name pattern) */
const GENERAL_CHANNEL_PATTERNS = ['general'];

function getSystemPrompt(channelName: string): string {
  const normalized = channelName.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (GENERAL_CHANNEL_PATTERNS.some((p) => normalized.includes(p))) {
    return GENERAL_SYSTEM_PROMPT;
  }
  return ANNOUNCEMENT_SYSTEM_PROMPT;
}

function formatMessagesForLLM(filtered: FilteredMessage[]): string {
  const cassieMessages = filtered.filter((f) => f.isCassie);
  const otherMessages = filtered.filter((f) => !f.isCassie);

  const fmt = (f: FilteredMessage): string => {
    const time = f.timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });
    const tag = f.isCassie ? ' [LEAD DEV]' : '';
    let text = f.content;
    for (const embed of f.embeds) {
      if (embed.title) text += ` | ${embed.title}`;
      if (embed.description) text += ` — ${embed.description}`;
    }
    return `[${time} UTC] ${f.authorName}${tag}: ${text}`;
  };

  const cassieLines = cassieMessages.map(fmt);
  const cassieChars = cassieLines.join('\n').length;
  const budget = MAX_INPUT_CHARS - cassieChars;

  const otherEntries = otherMessages.map((f) => ({ id: f.authorId + f.timestamp.getTime(), line: fmt(f) }));
  let totalOtherChars = otherEntries.reduce((sum, e) => sum + e.line.length + 1, 0);

  while (totalOtherChars > budget && otherEntries.length > 0) {
    const removed = otherEntries.shift()!;
    totalOtherChars -= removed.line.length + 1;
  }

  const survivingIds = new Set(otherEntries.map((e) => e.id));

  const allFormatted = filtered
    .filter((f) => f.isCassie || survivingIds.has(f.authorId + f.timestamp.getTime()))
    .map(fmt);

  return allFormatted.join('\n');
}

interface RecapCompletion {
  content: string;
  finishReason: string;
  completionTokens: number;
  reasoningTokens: number;
  resolvedModel: string;
}

/** One OpenRouter call. Reports what came back rather than coercing it. */
async function callRecapModel(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userContent: string,
): Promise<RecapCompletion> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      max_tokens: MAX_RECAP_OUTPUT_TOKENS,
      temperature: 0.3,
      // Same OPENROUTER_REASONING switch as the chat path.
      ...reasoningSettings(),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`OpenRouter API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    model?: string;
    choices?: { message?: { content?: string }; finish_reason?: string }[];
    usage?: {
      completion_tokens?: number;
      completion_tokens_details?: { reasoning_tokens?: number };
    };
  };

  const choice = data.choices?.[0];
  return {
    content: choice?.message?.content?.trim() ?? '',
    finishReason: String(choice?.finish_reason ?? 'unknown'),
    completionTokens: data.usage?.completion_tokens ?? 0,
    reasoningTokens: data.usage?.completion_tokens_details?.reasoning_tokens ?? 0,
    resolvedModel: data.model ?? model,
  };
}

/**
 * True only for the model's deliberate "nothing worth recapping" verdict.
 * Tolerates the model wrapping the sentinel in markdown or a trailing period.
 *
 * Do NOT strip `_` here: the sentinel itself contains one, so a character class
 * including `_` reduces "SKIP_EMPTY" to "SKIPEMPTY" and the comparison can never
 * be true. That bug shipped in review and would have posted a digest section
 * whose entire body was the literal text `**SKIP_EMPTY**`.
 */
function isSkipSentinel(content: string): boolean {
  return /^skip[_\s]?empty$/i.test(content.replace(/[*`.]/g, '').trim());
}

/**
 * Summarize a channel's filtered messages.
 *
 * Returns SKIP_EMPTY only when the MODEL SAID SO. An empty API reply is a
 * failure and throws, so the caller logs it instead of dropping the digest
 * silently.
 *
 * This distinction is the whole bug. The old code was
 * `content?.trim() || SKIP_EMPTY`, which made "the model returned nothing"
 * indistinguishable from "the model judged this to be banter". When the
 * `~deepseek/deepseek-v4-flash-latest` alias started resolving to the 0731
 * revision (2026-09-08), reasoning began eating the shared token budget:
 * measured against real #general traffic on 2026-09-11, reasoning consumed
 * 392-1650 of the 1500-token cap, producing either zero visible characters or
 * a recap cut off mid-sentence. Production logged that as
 * "No channels had substantive content" on 09-08 and 09-10, and wrote a
 * 407-byte truncated recap on 09-09. Reasoning off: 3/3 clean full recaps at
 * ~400-500 completion tokens.
 */
export async function summarizeForRecap(
  filtered: FilteredMessage[],
  date: string,
  channelName: string,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is required for recap summarization');

  const model = process.env.RECAP_LLM_MODEL || DEFAULT_RECAP_MODEL;
  const messagesText = formatMessagesForLLM(filtered);

  if (!messagesText.trim()) {
    return SKIP_EMPTY;
  }

  const systemPrompt = getSystemPrompt(channelName);
  const userContent = `Here are the messages from the Quilibrium Discord #${channelName} channel on ${date}. Write a concise recap:\n\n${messagesText}`;

  const attempt = async (n: number): Promise<RecapCompletion> => {
    const r = await callRecapModel(apiKey, model, systemPrompt, userContent);
    console.log(
      `[recap] #${channelName} attempt=${n} model=${r.resolvedModel} finish=${r.finishReason} ` +
      `chars=${r.content.length} compTok=${r.completionTokens} reasonTok=${r.reasoningTokens}`,
    );
    return r;
  };

  // Sampling is non-deterministic — the same input went empty, then SKIP_EMPTY,
  // then truncated across three consecutive probe runs — so one retry is cheap
  // insurance even with reasoning off.
  let result = await attempt(1);
  if (!result.content) {
    console.warn(`[recap] #${channelName}: no text returned, retrying once`);
    result = await attempt(2);
  }

  if (!result.content) {
    throw new Error(
      `Recap model returned no text for #${channelName} after 2 attempts ` +
      `(finish=${result.finishReason}, reasoningTokens=${result.reasoningTokens}). ` +
      `If reasoningTokens is near ${MAX_RECAP_OUTPUT_TOKENS}, thinking consumed the output budget.`,
    );
  }

  if (result.finishReason === 'length') {
    // Posting a partial recap beats posting nothing, but this must be visible:
    // with reasoning off it should not happen at all.
    console.warn(
      `[recap] #${channelName}: output hit the ${MAX_RECAP_OUTPUT_TOKENS}-token cap ` +
      `(reasonTok=${result.reasoningTokens}) — posting a truncated recap`,
    );
  }

  if (isSkipSentinel(result.content)) return SKIP_EMPTY;

  // Strip any remaining @username mentions to avoid Discord notifications
  return result.content.replace(/@(\w+)/g, '$1');
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

/** Any channel we can page messages out of: a text channel, or a forum's thread. */
type MessageBearing = { messages: TextChannel['messages'] };

/** Page back through one channel's messages until the cutoff. */
async function fetchSince(channel: MessageBearing, cutoff: number): Promise<Message[]> {
  const out: Message[] = [];
  let lastId: string | undefined;
  while (true) {
    const batch = await channel.messages.fetch({ limit: 100, ...(lastId ? { before: lastId } : {}) });
    if (batch.size === 0) break;

    let reachedCutoff = false;
    for (const msg of batch.values()) {
      if (msg.createdTimestamp < cutoff) {
        reachedCutoff = true;
        break;
      }
      out.push(msg);
    }

    if (reachedCutoff || batch.size < 100) break;
    lastId = batch.last()!.id;
  }
  return out;
}

/**
 * Collect a forum channel's recent activity.
 *
 * A forum holds no messages of its own — each post is a thread — so the plain
 * `channel.messages` path throws "not found or not a text channel" on it. That
 * is why #treasury-ideas failed in the digest every single day since it was
 * added to DISCORD_DIGEST_CHANNEL_IDS.
 *
 * Archived threads are included because a forum post goes quiet and auto-archives
 * quickly; restricting to active threads would miss most of a day's discussion.
 */
async function fetchForumMessages(channel: ForumChannel, cutoff: number): Promise<Message[]> {
  const threads: AnyThreadChannel[] = [];
  try {
    const active = await channel.threads.fetchActive();
    threads.push(...active.threads.values());
  } catch (e) {
    console.warn(`[recap] #${channel.name}: could not list active threads:`, (e as Error).message);
  }
  try {
    const archived = await channel.threads.fetchArchived({ type: 'public', limit: 50 });
    threads.push(...archived.threads.values());
  } catch (e) {
    console.warn(`[recap] #${channel.name}: could not list archived threads:`, (e as Error).message);
  }

  // Only threads that could contain something inside the window. A thread's own
  // creation counts: a post made today with no replies is still news.
  const candidates = threads.filter(
    (t) => (t.lastMessageId ? true : false) || (t.createdTimestamp ?? 0) >= cutoff,
  );

  const collected: Message[] = [];
  for (const thread of candidates) {
    try {
      const msgs = await fetchSince(thread, cutoff);
      // Prefix the thread title onto its opening message so the summarizer knows
      // which proposal a comment belongs to. Forum post titles carry most of the
      // meaning and are not part of any message body.
      collected.push(...msgs);
    } catch (e) {
      console.warn(`[recap] #${channel.name}: thread "${thread.name}" unreadable:`, (e as Error).message);
    }
  }
  console.log(`[recap] #${channel.name}: forum — ${candidates.length} threads checked, ${collected.length} messages in window`);
  return collected;
}

/**
 * Generate a recap for a single Discord channel.
 * Returns null if no substantive messages or LLM returns SKIP_EMPTY.
 */
export async function generateChannelRecap(
  channel: TextChannel | ForumChannel,
): Promise<ChannelRecapResult | null> {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;

  const allMessages: Message[] = channel.type === ChannelType.GuildForum
    ? await fetchForumMessages(channel as ForumChannel, cutoff)
    : await fetchSince(channel as TextChannel, cutoff);

  if (allMessages.length === 0) return null;

  allMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  const filtered = filterRecapMessages(allMessages);
  if (filtered.length === 0) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const content = await summarizeForRecap(filtered, todayStr, channel.name);

  if (content === SKIP_EMPTY) return null;

  return {
    channelId: channel.id,
    channelName: channel.name,
    content,
    date: todayStr,
    messageCount: filtered.length,
  };
}
