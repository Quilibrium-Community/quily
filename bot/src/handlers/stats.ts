// bot/src/handlers/stats.ts
// Handles on-demand "stats" keyword and daily scheduled posting.

import type { Client, Message, TextChannel } from 'discord.js';
import { computeStats, formatDiscordStats, loadHistory, recordSnapshot } from '../services/networkStats';

// Patterns that trigger the stats response (matched against the stripped query)
const STATS_EXACT = [
  /^\s*(?:network\s+)?stats?\s*$/i,
  /^\s*network\s*$/i,
  /^\s*shard\s*(?:out|ing)?\s*$/i,
  /^\s*shardout\s*$/i,
];

const STATS_FUZZY = [
  /\b(?:how(?:'s| is| are)|what(?:'s| is| are)|show|get|check|current|live)\b.*\b(?:network\s*(?:stats?|status|health|overview)|shard\s*(?:health|coverage|status|out|ing)|(?:peer|node|worker)\s*(?:count|number|status)|world\s*size)\b/i,
  /\b(?:shard|network)\s*(?:health|coverage|status|overview|situation)\b/i,
  /\bhow\s+(?:many|much)\b.*\b(?:peers?|nodes?|workers?|shards?)\b/i,
  /\b(?:peers?|nodes?|workers?)\s+(?:are\s+)?(?:online|active|running|there)\b/i,
  /\bhow(?:'s| is)\s+(?:the\s+)?(?:sharding|shardout|network)\s+(?:going|doing|looking)\b/i,
];

/**
 * Check if a mention query is asking for network stats.
 * Returns true if handled (caller should return early).
 */
export async function handleStats(message: Message, query: string): Promise<boolean> {
  if (!STATS_EXACT.some((p) => p.test(query)) && !STATS_FUZZY.some((p) => p.test(query))) return false;

  try {
    if ('sendTyping' in message.channel) await message.channel.sendTyping();

    const snapshot = await computeStats();
    const history = await loadHistory();
    const formatted = formatDiscordStats(snapshot, history);

    await message.reply(formatted);

    // Record this snapshot so it contributes to future trends
    await recordSnapshot(snapshot);
  } catch (error) {
    console.error('Stats handler error:', error);
    try {
      await message.reply("I couldn't fetch network stats right now. Try again in a moment.");
    } catch {
      // Can't reply
    }
  }

  return true;
}

/**
 * Start the daily scheduled stats posting.
 * Posts to DISCORD_STATS_CHANNEL_ID at the configured hour (default: 12:00 UTC).
 */
export function startDailyStats(client: Client): void {
  const channelId = process.env.DISCORD_STATS_CHANNEL_ID;
  if (!channelId) {
    console.log('[stats] DISCORD_STATS_CHANNEL_ID not set — daily stats disabled');
    return;
  }

  const hour = parseInt(process.env.DISCORD_STATS_HOUR || '12', 10);
  console.log(`[stats] Daily stats scheduled for ${hour}:00 UTC → channel ${channelId}`);

  // Check every minute if it's time to post
  let lastPostedDate = '';

  setInterval(async () => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();

    // Post at the configured hour, minute 0, and only once per day
    if (currentHour !== hour || currentMinute !== 0 || lastPostedDate === todayStr) return;

    lastPostedDate = todayStr;

    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel || !('send' in channel)) {
        console.error(`[stats] Channel ${channelId} not found or not a text channel`);
        return;
      }

      console.log(`[stats] Posting daily stats for ${todayStr}`);
      const snapshot = await computeStats();
      const history = await loadHistory();
      const formatted = formatDiscordStats(snapshot, history);

      await (channel as TextChannel).send(formatted);
      await recordSnapshot(snapshot);

      console.log(`[stats] Daily stats posted successfully`);
    } catch (error) {
      console.error('[stats] Failed to post daily stats:', error);
    }
  }, 60_000); // Check every 60 seconds
}
