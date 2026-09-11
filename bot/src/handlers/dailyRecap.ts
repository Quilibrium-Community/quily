// bot/src/handlers/dailyRecap.ts
// Multi-channel daily digest — posts to #daily-digest channel.

import type { Client, ForumChannel, TextChannel } from 'discord.js';
import { ChannelType } from 'discord.js';
import { generateChannelRecap, type ChannelRecapResult } from '../services/recapGenerator';
import { chunkMessage } from '../utils/messageChunker';
import { suppressDiscordEmbeds } from '../formatter';

/**
 * Start the daily scheduled multi-channel digest.
 * Posts to DISCORD_RECAP_CHANNEL_ID at the configured hour (default: 14:00 UTC).
 */
export function startDailyRecap(client: Client): void {
  const destChannelId = process.env.DISCORD_RECAP_CHANNEL_ID;
  if (!destChannelId) {
    console.log('[digest] DISCORD_RECAP_CHANNEL_ID not set — daily digest disabled');
    return;
  }

  // Fail fast at startup rather than at 14:00 UTC. summarizeForRecap reads the
  // key from the environment itself, so nothing here needs to hold the value.
  if (!process.env.OPENROUTER_API_KEY) {
    console.log('[digest] OPENROUTER_API_KEY not set — daily digest disabled');
    return;
  }

  const hour = parseInt(process.env.DISCORD_RECAP_HOUR || '14', 10);
  const bugReportsChannelId = process.env.DISCORD_BUG_REPORTS_CHANNEL_ID;
  // When the dedicated bug-reports digest is enabled, exclude that channel
  // from the main digest to avoid double-posting the same channel's content.
  const channelIds = parseDigestChannelIds().filter((id) => id !== bugReportsChannelId);

  console.log(`[digest] Daily digest scheduled for ${hour}:00 UTC → channel ${destChannelId} (${channelIds.length} source channels)`);

  let lastPostedDate = '';

  setInterval(async () => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();

    if (currentHour !== hour || currentMinute !== 0 || lastPostedDate === todayStr) return;

    lastPostedDate = todayStr;

    try {
      const destChannel = await client.channels.fetch(destChannelId);
      if (!destChannel || !('send' in destChannel)) {
        console.error(`[digest] Destination channel ${destChannelId} not found or not a text channel`);
        return;
      }

      console.log(`[digest] Generating multi-channel digest for ${todayStr}...`);

      // Fetch and summarize all channels in parallel
      const results = await Promise.allSettled(
        channelIds.map(async (id) => {
          // The fetch is INSIDE the try on purpose. When the bot lacks View
          // Channel outright — the most common cause of Missing Access — it is
          // this call that throws, so a wrapper placed after it would never fire
          // in the case it was written for.
          let name = '?';
          try {
            const channel = await client.channels.fetch(id);
            if (!channel) {
              throw new Error(`Channel ${id} not found — deleted, or the bot is not in that server`);
            }
            if ('name' in channel && channel.name) name = channel.name;

            // Forums and media channels carry no messages of their own;
            // generateChannelRecap reads their threads instead. Before this, the
            // `'messages' in channel` test rejected them outright and
            // #treasury-ideas failed in the digest every single day.
            const isThreadOnly =
              channel.type === ChannelType.GuildForum || channel.type === ChannelType.GuildMedia;
            if (!isThreadOnly && !('messages' in channel)) {
              throw new Error(
                `Channel ${id} (#${name}) is a ${ChannelType[channel.type] ?? channel.type}, which the digest cannot read`,
              );
            }
            return await generateChannelRecap(channel as TextChannel | ForumChannel);
          } catch (e) {
            // Name the fix. "Missing Access" on its own reads like a bug in here;
            // it is a Discord permission the bot has to be granted. `cause` keeps
            // the original error and stack, which console.error prints.
            if ((e as { code?: number }).code === 50001) {
              throw new Error(
                `Channel ${id} (#${name}): Missing Access — grant the bot View Channel + ` +
                `Read Message History there, or remove the id from DISCORD_DIGEST_CHANNEL_IDS`,
                { cause: e },
              );
            }
            throw e;
          }
        }),
      );

      // Collect successful results, log failures
      const channelRecaps: ChannelRecapResult[] = [];
      let failedCount = 0;
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === 'rejected') {
          failedCount++;
          console.error(`[digest] Channel ${channelIds[i]} failed:`, result.reason);
        } else if (result.value) {
          channelRecaps.push(result.value);
        }
      }

      if (channelRecaps.length === 0) {
        // Separate the two reasons. Reporting an all-errors run as "no
        // substantive content" is what kept the 09-08/09-10 empty-reply failures
        // invisible for two days.
        if (failedCount === channelIds.length) {
          console.error(
            `[digest] All ${failedCount} source channels errored — nothing posted. See the per-channel errors above.`,
          );
        } else {
          console.log(
            `[digest] No channels had substantive content — skipping post (${failedCount} of ${channelIds.length} errored)`,
          );
        }
        return;
      }

      // Sort by config order (channelIds array order)
      channelRecaps.sort(
        (a, b) => channelIds.indexOf(a.channelId) - channelIds.indexOf(b.channelId),
      );

      const totalMessages = channelRecaps.reduce((sum, r) => sum + r.messageCount, 0);
      console.log(`[digest] Digest ready: ${channelRecaps.length} channels, ${totalMessages} messages. Posting...`);

      // Assemble and post digest
      const titleDate = new Date(todayStr + 'T00:00:00Z').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      });

      const sections = channelRecaps.map(
        (r) => `**<#${r.channelId}>**\n\n${r.content}`,
      );

      const digestBody = `**Daily Digest - ${titleDate}**\n\n${sections.join('\n\n')}`;
      const footer = `\n\n-# *Digests are posted daily at ${hour}:00 UTC*`;

      const fullMessage = suppressDiscordEmbeds(digestBody + footer);
      const chunks = chunkMessage(fullMessage);

      for (const chunk of chunks) {
        await (destChannel as TextChannel).send(chunk);
      }

      console.log('[digest] Daily digest posted successfully');

      // NO persistence here on purpose. A previous version wrote markdown and
      // upserted chunks to Supabase; its rows referenced `docs/discord/recap-*`
      // paths that exist in no checkout, so the nightly `yarn ingest run --clean`
      // orphan sweep (sync-docs.yml, 06:00 UTC) deleted them all within hours.
      //
      // Do not reintroduce a writer here without giving it a path that survives
      // that sweep. RAG ingestion of recaps belongs to the GitHub Action, which
      // writes into a real checkout and commits.
      //
      // Known gap, deliberate: the Action only recaps #general, so the other
      // digest channels do not reach the knowledge base.
    } catch (error) {
      console.error('[digest] Failed to generate/post daily digest:', error);
    }
  }, 60_000);
}

/**
 * Parse DISCORD_DIGEST_CHANNEL_IDS into an array.
 * Falls back to DISCORD_GENERAL_CHANNEL_ID or the hardcoded general channel.
 */
function parseDigestChannelIds(): string[] {
  const raw = process.env.DISCORD_DIGEST_CHANNEL_IDS;
  if (raw) {
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  // Fallback: single-channel mode using general channel
  const generalId = process.env.DISCORD_GENERAL_CHANNEL_ID || '1212446222367985726';
  console.log('[digest] DISCORD_DIGEST_CHANNEL_IDS not set — falling back to single channel');
  return [generalId];
}
