// bot/src/handlers/bugReportDigest.ts
// Dedicated daily digest for #quorum-bug-reports.
// Posts INTO the same bug-reports channel (so the lead dev sees the triage
// alongside the raw reports they already monitor). Runs on its own schedule
// (default 07:00 UTC), independent of the main digest at 14:00 UTC.

import type { Client, TextChannel } from 'discord.js';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import {
  generateBugReportDigest,
  type BugTriageResult,
  type BugCluster,
  type Severity,
} from '../services/bugReportTriage';
import { chunkMessage } from '../utils/messageChunker';
import { suppressDiscordEmbeds } from '../formatter';

const SEVERITY_ORDER: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
  question: 3,
};

const SEVERITY_HEADERS: Record<Severity, string> = {
  high: '🔴 High severity',
  medium: '🟡 Medium severity',
  low: '🟢 Low severity',
  question: '❓ Questions / Feature requests',
};

/**
 * Start the daily scheduled bug-reports digest.
 * Posts to DISCORD_RECAP_CHANNEL_ID at BUG_DIGEST_HOUR (default 07:00 UTC).
 * Independent of the main daily digest schedule.
 */
export function startBugReportDigest(client: Client): void {
  const sourceChannelId = process.env.DISCORD_BUG_REPORTS_CHANNEL_ID;
  if (!sourceChannelId) {
    console.log('[bug-digest] DISCORD_BUG_REPORTS_CHANNEL_ID not set — bug-reports digest disabled');
    return;
  }

  // Post into the bug-reports channel itself by default. Override with
  // DISCORD_BUG_REPORTS_POST_CHANNEL_ID if you want the digest in a separate channel.
  const destChannelId = process.env.DISCORD_BUG_REPORTS_POST_CHANNEL_ID || sourceChannelId;
  const hour = parseInt(process.env.BUG_DIGEST_HOUR || '7', 10);
  console.log(`[bug-digest] Scheduled for ${hour}:00 UTC → channel ${destChannelId}`);

  let lastPostedDate = '';

  setInterval(async () => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();

    if (currentHour !== hour || currentMinute !== 0 || lastPostedDate === todayStr) return;
    lastPostedDate = todayStr;

    await runBugReportDigest(client, destChannelId);
  }, 60_000);
}

/**
 * Run the bug-reports digest once: fetch, triage, post, write archive.
 * Exported so the dry-run / manual-trigger scripts can call it.
 * Returns silently on any failure (errors logged).
 */
export async function runBugReportDigest(client: Client, destChannelId: string): Promise<void> {
  const sourceChannelId = process.env.DISCORD_BUG_REPORTS_CHANNEL_ID;
  if (!sourceChannelId) return;

  try {
    const sourceChannel = await client.channels.fetch(sourceChannelId);
    if (!sourceChannel || !('messages' in sourceChannel)) {
      console.error(`[bug-digest] Source channel ${sourceChannelId} not found or not a text channel`);
      return;
    }

    console.log('[bug-digest] Generating bug-reports digest...');
    const result = await generateBugReportDigest(sourceChannel as TextChannel);

    if (!result) {
      console.log('[bug-digest] No substantive bug reports — skipping post');
      return;
    }

    const destChannel = await client.channels.fetch(destChannelId);
    if (!destChannel || !('send' in destChannel)) {
      console.error(`[bug-digest] Destination channel ${destChannelId} not found or not a text channel`);
      return;
    }

    const digestText = composeDigest(result);
    const fullMessage = suppressDiscordEmbeds(digestText);
    const chunks = chunkMessage(fullMessage);

    for (const chunk of chunks) {
      await (destChannel as TextChannel).send(chunk);
    }

    console.log(`[bug-digest] Posted: ${result.clusters.length} clusters, ${result.needs_more_info.length} needs-more-info, ${result.totalReports} total reports`);

    // Write local archive (best-effort)
    try {
      await writeArchive(result, digestText);
      console.log(`[bug-digest] Archive written: archives/quorum-bug-reports/${result.date}.md`);
    } catch (err) {
      console.error('[bug-digest] Archive write failed (digest still posted):', err);
    }
  } catch (err) {
    console.error('[bug-digest] Failed to generate/post bug-reports digest:', err);
  }
}

// ---------------------------------------------------------------------------
// Message composition
// ---------------------------------------------------------------------------

function composeDigest(result: BugTriageResult): string {
  const titleDate = new Date(result.date + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  // Honest counts: sum reported counts from clusters + needs_more_info entries.
  // Avoids inflating the header with messages that were dropped as noise.
  const triagedReports =
    result.clusters.reduce((sum, c) => sum + (c.count || 0), 0) + result.needs_more_info.length;
  const distinctIssues = result.clusters.length;
  const issuesLabel = `${distinctIssues} distinct issue${distinctIssues === 1 ? '' : 's'}`;
  const reportsLabel = `${triagedReports} report${triagedReports === 1 ? '' : 's'}`;
  const header = `**🐛 Bug Reports Digest - ${titleDate}**\n*Last 24h · ${reportsLabel} · ${issuesLabel}*`;

  // Group clusters by severity, defaulting unknown values to medium so nothing falls through.
  const bySeverity: Record<Severity, BugCluster[]> = {
    high: [],
    medium: [],
    low: [],
    question: [],
  };
  for (const cluster of result.clusters) {
    const sev = SEVERITY_ORDER[cluster.severity] !== undefined ? cluster.severity : 'medium';
    bySeverity[sev].push(cluster);
  }

  // Within a severity bucket, show higher-count clusters first.
  for (const sev of Object.keys(bySeverity) as Severity[]) {
    bySeverity[sev].sort((a, b) => b.count - a.count);
  }

  const sections: string[] = [];

  for (const sev of ['high', 'medium', 'low', 'question'] as Severity[]) {
    const clusters = bySeverity[sev];
    if (clusters.length === 0) continue;

    const renderedClusters = clusters.map(renderCluster);
    // Empty line between clusters within the same severity section
    const sevSection = `**${SEVERITY_HEADERS[sev]}**\n\n${renderedClusters.join('\n\n')}`;
    sections.push(sevSection);
  }

  if (result.needs_more_info.length > 0) {
    const count = result.needs_more_info.length;
    const lines = [`**❓ Needs more info · ${count} report${count === 1 ? '' : 's'}**`, ''];
    for (const nmi of result.needs_more_info) {
      const quote = truncate(stripMentions(nmi.quote), 200);
      lines.push(`- "${quote}" — ${nmi.author} → ${nmi.suggested_followup}`);
    }
    sections.push(lines.join('\n'));
  }

  const hour = process.env.BUG_DIGEST_HOUR || '7';
  const footer = `\n\n-# *Severity rates the bug, not how many users hit it · count = reports · Next digest tomorrow ${hour}:00 UTC*`;

  return `${header}\n\n${sections.join('\n\n')}${footer}`;
}

function renderCluster(cluster: BugCluster): string {
  const lines: string[] = [];
  const symptom = stripMentions(cluster.canonical_symptom);
  lines.push(`**${symptom} · ${cluster.count} report${cluster.count === 1 ? '' : 's'}**`);

  const metaParts: string[] = [];
  if (cluster.component && cluster.component !== 'unclear') {
    metaParts.push(`Component: ${cluster.component}`);
  }
  if (cluster.os_versions && cluster.os_versions.length > 0) {
    metaParts.push(`Versions/OS: ${cluster.os_versions.join(', ')}`);
  }
  if (metaParts.length > 0) {
    lines.push(metaParts.join(' · '));
  }

  for (const quote of cluster.example_quotes.slice(0, 3)) {
    const text = truncate(stripMentions(quote.text), 200);
    lines.push(`> "${text}" — ${quote.author}`);
  }

  return lines.join('\n');
}

function stripMentions(text: string): string {
  return text.replace(/@(\w+)/g, '$1').replace(/<@!?\d+>/g, '');
}

/**
 * Truncate at a word boundary with an ellipsis when over the limit.
 * Returns the original text if already within the limit.
 */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  // If there's a reasonable word boundary, cut there. Otherwise just hard-cut.
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut.trimEnd() + '…';
}

// ---------------------------------------------------------------------------
// Local archive
// ---------------------------------------------------------------------------

// Resolve the repo root independently of process.cwd().
// The bot's bundled entrypoint runs at <repo>/bot/dist/index.js, so two levels
// up from that file lands at the repo root regardless of where pm2 cd's first.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

async function writeArchive(result: BugTriageResult, digestText: string): Promise<void> {
  const archiveDir = join(REPO_ROOT, 'archives', 'quorum-bug-reports');
  const filePath = join(archiveDir, `${result.date}.md`);

  const titleDate = new Date(result.date + 'T00:00:00Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  // Strip the footer line from the archived body — it's redundant in a stored file
  const body = digestText.replace(/\n\n-# \*Posted daily at .*?\*$/m, '');

  const markdown = [
    '---',
    `title: "Bug Reports Digest - ${result.date}"`,
    'type: archive',
    'source: quorum-bug-reports',
    `date: ${result.date}`,
    `total_reports: ${result.totalReports}`,
    `distinct_issues: ${result.clusters.length}`,
    '---',
    '',
    `# Bug Reports Digest - ${titleDate}`,
    '',
    body,
    '',
  ].join('\n');

  await mkdir(archiveDir, { recursive: true });
  await writeFile(filePath, markdown, 'utf-8');
}
