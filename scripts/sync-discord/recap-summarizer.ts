// scripts/sync-discord/recap-summarizer.ts
import type { FilteredMessage } from './recap-filter.js';
import { reasoningSettings } from '../../src/lib/openrouter-reasoning.js';

const DEFAULT_MODEL = '~deepseek/deepseek-v4-flash-latest';
const MAX_INPUT_CHARS = 60_000; // ~15,000 tokens

/**
 * Format filtered messages into a text block for the LLM.
 * Cassie's messages are tagged so the LLM can highlight them.
 * If total length exceeds MAX_INPUT_CHARS, truncate oldest messages first,
 * always keeping Cassie's messages.
 */
function formatMessagesForLLM(filtered: FilteredMessage[]): string {
  // Separate Cassie's messages (always kept) from others
  const cassieMessages = filtered.filter((f) => f.isCassie);
  const otherMessages = filtered.filter((f) => !f.isCassie);

  // Format a message into a text line
  const fmt = (f: FilteredMessage): string => {
    const name = f.message.author.global_name || f.message.author.username;
    const time = new Date(f.message.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });
    const tag = f.isCassie ? ' [LEAD DEV]' : '';
    let text = f.message.content;

    // Append embed content
    for (const embed of f.message.embeds) {
      if (embed.title) text += ` | ${embed.title}`;
      if (embed.description) text += ` — ${embed.description}`;
    }

    return `[${time} UTC] ${name}${tag}: ${text}`;
  };

  const cassieLines = cassieMessages.map(fmt);
  const cassieChars = cassieLines.join('\n').length;
  const budget = MAX_INPUT_CHARS - cassieChars;

  // Truncate other messages from oldest if over budget
  // Track which message IDs survive truncation
  const otherEntries = otherMessages.map((f) => ({ id: f.message.id, line: fmt(f) }));
  let totalOtherChars = otherEntries.reduce((sum, e) => sum + e.line.length + 1, 0);

  while (totalOtherChars > budget && otherEntries.length > 0) {
    const removed = otherEntries.shift()!;
    totalOtherChars -= removed.line.length + 1;
  }

  const survivingIds = new Set(otherEntries.map((e) => e.id));

  // Interleave back in chronological order using message IDs
  const allFormatted = filtered
    .filter((f) => f.isCassie || survivingIds.has(f.message.id))
    .map(fmt);

  return allFormatted.join('\n');
}

const SYSTEM_PROMPT = `You are a community recap writer for the Quilibrium Discord server. You produce concise daily recaps of the general channel.

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
- Do NOT invent or fabricate any information — only summarize what is in the messages`;

/**
 * Summarize filtered messages using an LLM via OpenRouter.
 * Returns markdown recap text.
 * Throws on API failure (caller handles fallback).
 */
export async function summarizeMessages(
  filtered: FilteredMessage[],
  date: string,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is required for recap summarization');

  const model = process.env.RECAP_LLM_MODEL || DEFAULT_MODEL;
  const messagesText = formatMessagesForLLM(filtered);

  if (!messagesText.trim()) {
    return 'No substantive discussion in the general channel today.';
  }

  const callModel = async (attempt: number) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Here are the messages from the Quilibrium Discord #general channel on ${date}. Write a concise recap:\n\n${messagesText}`,
          },
        ],
        max_tokens: 1500,
        temperature: 0.3,
        // max_tokens is SHARED with the thinking phase. Without this, the 0731
        // revision of V4 Flash spent the whole budget reasoning and returned
        // nothing, which a `|| 'No recap generated.'` then turned into a
        // 102-character placeholder. That is what landed in the knowledge base
        // for 2026-09-09 and 2026-09-10 — two days the bot could not answer
        // questions about. Same root cause as the Discord digest; see
        // bot/src/services/recapGenerator.ts.
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
      usage?: { completion_tokens?: number; completion_tokens_details?: { reasoning_tokens?: number } };
    };

    const c = data.choices?.[0];
    const out = {
      content: c?.message?.content?.trim() ?? '',
      finishReason: String(c?.finish_reason ?? 'unknown'),
      reasoningTokens: data.usage?.completion_tokens_details?.reasoning_tokens ?? 0,
    };
    console.log(
      `[recap] attempt=${attempt} model=${data.model ?? model} finish=${out.finishReason} ` +
      `chars=${out.content.length} compTok=${data.usage?.completion_tokens ?? 0} reasonTok=${out.reasoningTokens}`,
    );
    return out;
  };

  // One retry on an empty reply. This path writes the COMMITTED, ingested
  // knowledge base and the result is permanent (see the throw below), so a second
  // ~500-token call is cheap next to losing a day of the corpus. Sampling is
  // non-deterministic: the same input has come back empty, then fine.
  let result = await callModel(1);
  if (!result.content) {
    console.warn('[recap] no text returned, retrying once');
    result = await callModel(2);
  }

  const { finishReason, reasoningTokens } = result;

  // Throw rather than substituting a placeholder. What this actually does: the
  // caller (scripts/sync-discord/recap.ts) catches it and writes
  // formatFallbackMarkdown() instead — the raw timestamped messages. That is a
  // real, retrievable day of history; the old 'No recap generated.' placeholder
  // was 102 characters of nothing that still got committed and ingested as if it
  // were content (that is what landed for 2026-09-09 and 2026-09-10).
  //
  // It does NOT fail the workflow: the recap step carries continue-on-error, and
  // the caller swallows this anyway. And the result is PERMANENT — recap.ts will
  // not overwrite an existing dated file and advances the lastMessageId
  // watermark regardless, so tomorrow's run cannot redo the day. Hence the retry
  // above: it is the only chance to get a real summary.
  if (!result.content) {
    throw new Error(
      `Recap model returned no text (finish=${finishReason}, reasoningTokens=${reasoningTokens}). ` +
      `If reasoningTokens is near 1500, thinking consumed the output budget.`,
    );
  }
  if (finishReason === 'length') {
    console.warn(`[recap] output hit the 1500-token cap (reasonTok=${reasoningTokens}) — recap may be truncated`);
  }

  // Already trimmed by callModel. Strip any remaining @username mentions so the
  // committed recap cannot trigger Discord notifications when quoted.
  return result.content.replace(/@(\w+)/g, '$1');
}

/**
 * Format filtered messages as raw markdown (fallback when LLM fails).
 */
export function formatFallbackMarkdown(filtered: FilteredMessage[]): string {
  if (filtered.length === 0) return 'No substantive messages today.';

  return filtered
    .map((f) => {
      const name = f.message.author.global_name || f.message.author.username;
      const tag = f.isCassie ? ' **(Lead Dev)**' : '';
      const time = new Date(f.message.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
      });
      return `**${name}${tag}** — ${time} UTC\n${f.message.content}`;
    })
    .join('\n\n---\n\n');
}
