// scripts/sync-discord/discord-api.ts
import type { DiscordMessage, DiscordChannel } from './types.js';

const DISCORD_API_BASE = 'https://discord.com/api/v10';
const MAX_MESSAGES_PER_REQUEST = 100;

function getHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bot ${token}`,
    'Content-Type': 'application/json',
  };
}

const MAX_RETRIES = 5;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch from the Discord API, retrying on rate limits (429) and transient
 * server errors (5xx). Discord 429 responses include a `retry_after` (seconds)
 * telling us exactly how long to wait — respect it instead of failing the run.
 * Returns the first response that is not a retryable status; the caller checks
 * `res.ok` and reads the body as before.
 */
async function discordFetch(url: string, token: string): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: getHeaders(token) });

    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt >= MAX_RETRIES) return res;

    // Prefer Discord's advertised wait; fall back to exponential backoff.
    let waitMs = 1000 * 2 ** attempt;
    if (res.status === 429) {
      const retryAfterHeader = res.headers.get('retry-after');
      const body = (await res.clone().json().catch(() => null)) as
        | { retry_after?: number }
        | null;
      const retryAfterSec = body?.retry_after ?? Number(retryAfterHeader);
      if (Number.isFinite(retryAfterSec) && retryAfterSec >= 0) {
        // Add a small buffer so we clear the window cleanly.
        waitMs = retryAfterSec * 1000 + 250;
      }
    }

    await sleep(waitMs);
  }
}

/**
 * Fetch channel info (name, type) from Discord API.
 */
export async function fetchChannel(token: string, channelId: string): Promise<DiscordChannel> {
  const res = await discordFetch(`${DISCORD_API_BASE}/channels/${channelId}`, token);

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Discord API error ${res.status} fetching channel ${channelId}: ${body}`);
  }

  return (await res.json()) as DiscordChannel;
}

/**
 * Fetch messages from a channel, optionally after a given message ID.
 * Returns messages in chronological order (oldest first).
 * Paginates automatically to get all messages since `afterId`.
 */
export async function fetchMessages(
  token: string,
  channelId: string,
  afterId?: string | null,
): Promise<DiscordMessage[]> {
  const allMessages: DiscordMessage[] = [];
  let cursor = afterId || undefined;

  while (true) {
    const params = new URLSearchParams({ limit: String(MAX_MESSAGES_PER_REQUEST) });
    if (cursor) params.set('after', cursor);

    const res = await discordFetch(
      `${DISCORD_API_BASE}/channels/${channelId}/messages?${params}`,
      token,
    );

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Discord API error ${res.status} fetching messages for channel ${channelId}: ${body}`);
    }

    const batch = (await res.json()) as DiscordMessage[];

    if (batch.length === 0) break;

    // Discord returns newest-first; we want chronological order
    allMessages.push(...batch.reverse());

    // If we got fewer than the limit, we've reached the end
    if (batch.length < MAX_MESSAGES_PER_REQUEST) break;

    // Move cursor to the newest message we just got
    cursor = allMessages[allMessages.length - 1].id;
  }

  return allMessages;
}
