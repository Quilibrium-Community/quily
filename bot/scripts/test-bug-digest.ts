// bot/scripts/test-bug-digest.ts
// Dry-run the bug-reports digest pipeline against the real channel.
// Does NOT post to Discord, does NOT write any archive file.
// Prints the composed digest message to stdout so you can eyeball the output.
//
// Usage on VPS:
//   cd /home/quily/quily-chatbot/bot && npx tsx scripts/test-bug-digest.ts
//
// Reads the same .env the bot uses, so the channel ID and API keys come from there.

import 'dotenv/config';
import { Client, GatewayIntentBits, type TextChannel } from 'discord.js';
import { generateBugReportDigest } from '../src/services/bugReportTriage';

const sourceChannelId = process.env.DISCORD_BUG_REPORTS_CHANNEL_ID;
const token = process.env.DISCORD_BOT_TOKEN;

if (!sourceChannelId) {
  console.error('DISCORD_BUG_REPORTS_CHANNEL_ID is not set in .env');
  process.exit(1);
}
if (!token) {
  console.error('DISCORD_BOT_TOKEN is not set in .env');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', async (c) => {
  console.log(`Logged in as ${c.user.tag}`);
  console.log(`Fetching last 24h from channel ${sourceChannelId}...`);

  try {
    const channel = await client.channels.fetch(sourceChannelId);
    if (!channel || !('messages' in channel)) {
      console.error('Channel not found or not a text channel');
      process.exit(1);
    }

    const t0 = Date.now();
    const result = await generateBugReportDigest(channel as TextChannel);
    const elapsed = Date.now() - t0;

    console.log(`\n--- Triage complete in ${(elapsed / 1000).toFixed(1)}s ---\n`);

    if (!result) {
      console.log('Result: null (no substantive reports — bot would skip posting)');
      process.exit(0);
    }

    console.log(`Total reports: ${result.totalReports}`);
    console.log(`Distinct clusters: ${result.clusters.length}`);
    console.log(`Needs-more-info: ${result.needs_more_info.length}`);
    console.log('\n=== STRUCTURED OUTPUT (JSON) ===\n');
    console.log(JSON.stringify(result, null, 2));

    console.log('\n=== COMPOSED DISCORD MESSAGE ===\n');
    // Inline a tiny version of composeDigest so we don't have to export it.
    // If you want the EXACT bytes that would post, import composeDigest instead.
    const titleDate = new Date(result.date + 'T00:00:00Z').toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    });
    console.log(`**Bug Reports Digest - ${titleDate}**`);
    console.log(`Last 24h - ${result.totalReports} reports - ${result.clusters.length} distinct issues`);
    for (const cluster of result.clusters) {
      console.log(`\n[${cluster.severity}] ${cluster.canonical_symptom} (count=${cluster.count}, component=${cluster.component})`);
      for (const q of cluster.example_quotes.slice(0, 3)) {
        console.log(`  > "${q.text}" - ${q.author}`);
      }
    }
    if (result.needs_more_info.length > 0) {
      console.log('\nNeeds more info:');
      for (const nmi of result.needs_more_info) {
        console.log(`  - "${nmi.quote}" - ${nmi.author} -> ${nmi.suggested_followup}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
});

client.login(token);
