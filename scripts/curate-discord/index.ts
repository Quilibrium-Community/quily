import { mkdir, open, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { Command, InvalidArgumentError } from 'commander';
import { readDiscord } from '../sync-discord/discord-api.js';
import { authors, channels, collect, compareSampleSearch, nextUnfetchedRange, recordReview, reviewBatch, type Author, type Coverage, type Ledger, type Read } from './collector.js';

const directory = join(homedir(), '.quily-discord-curation');
const ledgerPath = join(directory, 'ledger.json');
const temporaryPath = join(directory, 'ledger.tmp');
const lockPath = join(directory, 'collect.lock');
const DAY = 86_400_000;
const weeklyBaseline = '2026-11-23T00:00:00.000Z';
const emptyLedger = (): Ledger => ({ version: 1, coverage: [], conversations: {} });

async function load(): Promise<Ledger> {
  const raw = await readFile(ledgerPath, 'utf8').catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') throw error;
  });
  if (!raw) return emptyLedger();
  const ledger = JSON.parse(raw) as Ledger;
  if (ledger.version !== 1 || !Array.isArray(ledger.coverage) || !ledger.conversations) {
    throw new Error('Unsupported or invalid ledger');
  }
  return ledger;
}

async function save(ledger: Ledger) {
  await writeFile(temporaryPath, JSON.stringify(ledger), { mode: 0o600 });
  await rename(temporaryPath, ledgerPath);
}

async function acquireLock() {
  const handle = await open(lockPath, 'wx', 0o600).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'EEXIST') throw error;
    throw new Error(`Collector locked. If its recorded PID is no longer running, remove ${lockPath} and retry.`);
  });
  try {
    await handle.writeFile(String(process.pid));
  } finally {
    await handle.close();
  }
}

function date(value: string) {
  const timestamp = Date.parse(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(timestamp) ||
      new Date(timestamp).toISOString().slice(0, 10) !== value) {
    throw new InvalidArgumentError('Expected a valid UTC date as YYYY-MM-DD');
  }
  return new Date(timestamp).toISOString();
}

function author(value: string): Author | 'both' {
  if (value === 'both' || Object.hasOwn(authors, value)) return value as Author | 'both';
  throw new InvalidArgumentError('Expected cassie, black-swan, or both');
}

interface Options {
  from?: string;
  to?: string;
  author: Author | 'both';
}

function summary(ledger: Ledger) {
  const reviewed = new Set(Object.values(ledger.reviews ?? {}).flatMap(review => review.anchorIds));
  return ledger.coverage.map(({ channelId, channelName, guildId, author, from, to, fetched, scanned, anchorIds, error }) => {
    const anchors = new Set(anchorIds);
    const reviewedCount = anchorIds.filter(id => reviewed.has(id)).length;
    const conversations = Object.values(ledger.conversations).filter(
      item => item.anchorIds.some(id => anchors.has(id)),
    );
    return {
      channelId, channelName, guildId, author, from, to,
      status: fetched ? anchors.size > 0 && reviewedCount === anchors.size ? 'reviewed' : 'fetched' : error || scanned > 0 ? 'partial' : 'pending',
      scanned, matches: anchors.size, reviewed: reviewedCount,
      conversations: conversations.length,
      flagged: conversations.filter(item => item.missingContext.length).length,
      error,
    };
  });
}

async function run(options: Options, kind: 'sample' | 'collect', days: number) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error('An existing DISCORD_BOT_TOKEN must be available in this process');
  const read: Read = <T>(path: string) => readDiscord<T>(token, path);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await acquireLock();
  try {
    const ledger = await load();
    const to = options.to ?? new Date(Math.floor(Date.now() / DAY) * DAY).toISOString();
    const initialFrom = options.from ?? new Date(Date.parse(to) - days * DAY).toISOString();
    if (initialFrom >= to || Date.parse(initialFrom) < Date.UTC(2015, 0, 1) || Date.parse(to) > Date.now()) {
      throw new Error('Expected a nonempty UTC range in the past, with an exclusive end');
    }
    const selectedAuthors = options.author === 'both' ? Object.keys(authors) as Author[] : [options.author];
    const runRows = channels.flatMap(channelId => selectedAuthors.map(author => {
      const matching = ledger.coverage.filter(row => row.channelId === channelId && row.author === author);
      const previous = matching.filter(row => row.kind === kind);
      const useDefault = !options.from && !options.to;
      if (useDefault) {
        const interrupted = previous.find(row => !row.fetched);
        if (interrupted) return interrupted;
      }
      let from = initialFrom;
      if (useDefault && kind === 'collect' && previous.length) {
        from = previous.reduce((latest, row) => row.to > latest ? row.to : latest, previous[0].to);
        if (from >= to) return previous.find(row => row.to === from)!;
      }
      const existing = matching.find(row => row.from === from && row.to === to);
      if (existing) return existing;
      const row = { kind, channelId, author, from, to, sourceIndex: 0, scanned: 0, anchorIds: [], fetched: false };
      ledger.coverage.push(row);
      return row;
    }));
    await save(ledger);
    for (const row of runRows) {
      try {
        await collect(read, ledger, row, () => save(ledger));
      } catch {
        process.exitCode = 1;
      }
    }
    console.table(summary({ ...ledger, coverage: runRows }));
    if (kind === 'sample') {
      for (const row of runRows.filter(row => row.fetched)) {
        const daysCovered = (Date.parse(row.to) - Date.parse(row.from)) / DAY;
        const count = summary({ ...ledger, coverage: [row] })[0].conversations;
        console.log(`${row.channelId} / ${row.author}: ~${Math.round(count * 180 / daysCovered)} conversations in 180 days at the sample rate; ${await compareSampleSearch(read, row)}`);
      }
    }
  } finally {
    await rm(lockPath, { force: true });
  }
}

function weeklyRows(ledger: Ledger, since: string, until: string) {
  return channels.flatMap(channelId => (Object.keys(authors) as Author[]).flatMap(author => {
    const matching = ledger.coverage.filter(row => row.channelId === channelId && row.author === author);
    const range = nextUnfetchedRange(matching, since, until);
    if (!range) return [];
    const interrupted = matching.find(row => !row.fetched && row.from === range.from && row.to <= range.to);
    const row: Coverage = interrupted ?? {
      ...range, kind: 'weekly', channelId, author, sourceIndex: 0, scanned: 0, anchorIds: [], fetched: false,
    };
    return [row];
  }));
}

async function runWeekly(since: string, plan: boolean) {
  const until = new Date(Math.floor(Date.now() / DAY) * DAY).toISOString();
  if (since > until || Date.parse(since) < Date.UTC(2015, 0, 1)) {
    throw new Error('Expected a valid UTC start on or before the current day');
  }
  if (plan) {
    console.table(weeklyRows(await load(), since, until).map(({ channelId, author, from, to }) => ({ channelId, author, from, to })));
    return;
  }
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await acquireLock();
  try {
    const ledger = await load();
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token && weeklyRows(ledger, since, until).length) {
      throw new Error('An existing DISCORD_BOT_TOKEN must be available in this process');
    }
    const read: Read = <T>(path: string) => readDiscord<T>(token!, path);
    const completed: Coverage[] = [];
    const failed = new Set<string>();
    for (let rows = weeklyRows(ledger, since, until); rows.length; rows = weeklyRows(ledger, since, until)) {
      const available = rows.filter(row => !failed.has(`${row.channelId}/${row.author}`));
      if (!available.length) break;
      for (const row of available) {
        if (!ledger.coverage.includes(row)) ledger.coverage.push(row);
        await save(ledger);
        try {
          await collect(read, ledger, row, () => save(ledger));
        } catch {
          failed.add(`${row.channelId}/${row.author}`);
          process.exitCode = 1;
        }
        completed.push(row);
      }
    }
    if (completed.length) console.table(summary({ ...ledger, coverage: completed }));
    else console.log('All four author and channel ranges are already covered through the last complete UTC day.');
  } finally {
    await rm(lockPath, { force: true });
  }
}

const program = new Command().name('curate-discord');
program.command('weekly')
  .description('Fetch missing history since the editorial baseline through the last complete UTC day')
  .option('--since <date>', 'Editorial baseline in UTC', date, weeklyBaseline)
  .option('--plan', 'Show the first missing interval for each author and channel without collecting', false)
  .action((options: { since: string; plan: boolean }) => runWeekly(options.since, options.plan));
for (const [name, days] of [['sample', 7], ['collect', 180]] as const) {
  program.command(name)
    .description(`Fetch a ${days}-day UTC window by default and save private evidence`)
    .option('--from <date>', 'Inclusive UTC start', date)
    .option('--to <date>', 'Exclusive UTC end', date)
    .option('--author <author>', 'Cassie, Black Swan, or both', author, 'both')
    .action((options: Options) => run(options, name, days));
}
program.command('status')
  .description('Show recorded date ranges and counts without printing messages')
  .action(async () => {
    console.table(summary(await load()));
  });
program.command('batch')
  .description('Export private documentation proposals and decisions for editorial approval')
  .action(async () => {
    const batch = reviewBatch(await load());
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const report = join(directory, 'review-batch.json');
    await writeFile(report, JSON.stringify(batch, null, 2), { mode: 0o600 });
    console.log(`Private review batch saved to ${report}`);
  });
async function saveReviews(updates: Array<{ conversationId: string; claims: unknown }>) {
  await acquireLock();
  try {
    const ledger = await load();
    for (const { conversationId, claims } of updates) recordReview(ledger, conversationId, claims);
    await save(ledger);
  } finally {
    await rm(lockPath, { force: true });
  }
}

program.command('review <conversation-id> <decisions-file>')
  .description('Save private claim decisions from a JSON file')
  .action(async (id: string, file: string) => {
    const claims: unknown = JSON.parse(await readFile(file, 'utf8'));
    await saveReviews([{ conversationId: id, claims }]);
  });
program.command('review-many <decisions-file>')
  .description('Save a private batch of conversation decisions together')
  .action(async (file: string) => {
    const updates: unknown = JSON.parse(await readFile(file, 'utf8'));
    if (!Array.isArray(updates) || updates.length === 0 || updates.some(update =>
      !update || typeof update !== 'object' || typeof update.conversationId !== 'string',
    )) {
      throw new Error('Expected a nonempty array of conversationId and claims entries');
    }
    await saveReviews(updates);
  });
program.parseAsync().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
