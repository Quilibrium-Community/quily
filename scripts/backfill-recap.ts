/**
 * Regenerate the #general community recap for specific past days.
 *
 * Why this exists: on 2026-09-09 and 2026-09-10 the summarizer returned no text
 * (reasoning consumed the shared max_tokens budget), and the then-current
 * `|| 'No recap generated.'` wrote a 102-character placeholder. Those files were
 * committed and ingested, so the knowledge base held two days of nothing while
 * looking complete. The root cause is fixed in recap-summarizer.ts; this repairs
 * the days already written.
 *
 * It reuses the real pipeline — fetchMessages, filterMessages, summarizeMessages
 * and the same markdown assembly as recap.ts — so the output is byte-comparable
 * with a normal run. The ONLY deliberate difference is that this overwrites an
 * existing file, which recap.ts refuses to do.
 *
 *   yarn tsx scripts/backfill-recap.ts 2026-09-09 2026-09-10
 *   DRY_RUN=1 yarn tsx scripts/backfill-recap.ts 2026-09-09
 *
 * After writing, commit the files and re-run ingestion so the chunks are
 * replaced:  yarn ingest run --clean
 *
 * Env: DISCORD_BOT_TOKEN, DISCORD_GENERAL_CHANNEL_ID, OPENROUTER_API_KEY.
 * No env values are printed.
 */
import 'dotenv/config';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fetchChannel, fetchMessages } from './sync-discord/discord-api.js';
import { filterMessages } from './sync-discord/recap-filter.js';
import { summarizeMessages } from './sync-discord/recap-summarizer.js';

const DEST_PATH = './docs/discord/general-recap';
const DISCORD_EPOCH = 1420070400000;
const DRY_RUN = /^(1|true|yes)$/i.test(process.env.DRY_RUN ?? '');

/** Lowest snowflake that can exist at or after `ms`. Used as a paging cursor. */
function snowflakeFor(ms: number): string {
  return String((BigInt(ms - DISCORD_EPOCH) << 22n));
}

const fmtTime = (d: Date) =>
  d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }) + ' UTC';

async function main() {
  const dates = process.argv.slice(2).filter((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
  if (dates.length === 0) {
    console.error('Usage: yarn tsx scripts/backfill-recap.ts <YYYY-MM-DD> [YYYY-MM-DD ...]');
    process.exit(1);
  }

  const token = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_GENERAL_CHANNEL_ID;
  if (!token) { console.error('DISCORD_BOT_TOKEN is required'); process.exit(1); }
  if (!channelId) { console.error('DISCORD_GENERAL_CHANNEL_ID is required'); process.exit(1); }
  if (!process.env.OPENROUTER_API_KEY) { console.error('OPENROUTER_API_KEY is required'); process.exit(1); }

  dates.sort();
  const startMs = Date.parse(`${dates[0]}T00:00:00Z`);
  const endMs = Date.parse(`${dates[dates.length - 1]}T00:00:00Z`) + 86_400_000;

  const channelInfo = await fetchChannel(token, channelId);
  console.log(`channel #${channelInfo.name}, backfilling ${dates.join(', ')}`);

  // Page forward from a synthesised cursor one millisecond before the window.
  // fetchMessages runs to the end of the channel, so trim to the window after.
  const cursor = snowflakeFor(startMs - 1);
  const raw = await fetchMessages(token, channelId, cursor);
  const inWindow = raw.filter((m) => {
    const ts = Date.parse(m.timestamp);
    return ts >= startMs && ts < endMs;
  });
  console.log(`fetched ${raw.length} messages, ${inWindow.length} inside the target window`);

  const filtered = filterMessages(inWindow);
  console.log(`${filtered.length} remain after the noise filter`);

  const byDate = new Map<string, typeof filtered>();
  for (const f of filtered) {
    const d = f.message.timestamp.split('T')[0];
    byDate.set(d, [...(byDate.get(d) ?? []), f]);
  }

  await mkdir(DEST_PATH, { recursive: true });

  for (const date of dates) {
    const dayFiltered = byDate.get(date);
    if (!dayFiltered || dayFiltered.length === 0) {
      console.log(`${date}: no substantive messages — leaving the existing file alone`);
      continue;
    }

    // Deliberately NOT wrapped in the caller's fallback. A backfill that quietly
    // writes a raw message dump would replace one silent placeholder with
    // another; if the model fails here, fail loudly and let it be re-run.
    const recapContent = await summarizeMessages(dayFiltered, date);

    const timestamps = dayFiltered.map((f) => new Date(f.message.timestamp).getTime());
    const earliest = new Date(Math.min(...timestamps));
    const latest = new Date(Math.max(...timestamps));
    const titleDate = new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    });

    const markdown = [
      '---',
      `title: "Community Recap - ${titleDate}"`,
      'type: discord_recap',
      'channel: general',
      `date: ${date}`,
      `time_from: "${fmtTime(earliest)}"`,
      `time_to: "${fmtTime(latest)}"`,
      `source_url: https://discord.com/channels/${channelInfo.guild_id}/${channelId}`,
      '---',
      '',
      '# Community Recap — #general',
      '',
      `**${titleDate}** | ${fmtTime(earliest)} – ${fmtTime(latest)}`,
      '',
      recapContent,
    ].join('\n');

    const filePath = join(DEST_PATH, `${date}.md`);
    const previous = await readFile(filePath, 'utf-8').catch(() => '');
    console.log(
      `${date}: ${dayFiltered.length} messages, ${fmtTime(earliest)} – ${fmtTime(latest)}, ` +
      `${previous.length} chars -> ${markdown.length} chars`,
    );

    if (DRY_RUN) {
      console.log('--- DRY RUN, not written ---');
      console.log(markdown.slice(0, 900));
      console.log('---');
      continue;
    }
    await writeFile(filePath, markdown, 'utf-8');
    console.log(`  written ${filePath}`);
  }

  if (!DRY_RUN) {
    console.log('\nNow commit these files and run `yarn ingest run --clean` to replace the chunks.');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
