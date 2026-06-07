// bot/src/handlers/bugReportDigest.ts
// Dedicated daily digest for #quorum-bug-reports.
// Called from dailyRecap.ts AFTER the main digest posts.

import type { Client, TextChannel } from 'discord.js';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import {
  generateBugReportDigest,
  type BugTriageResult,
  type BugCluster,
  type Severity,
} from '../services/bugReportTriage';
import { chunkMessage } from '../utils/messageChunker';
import { suppressDiscordEmbeds } from '../formatter';

const SEVERITY_ORDER: Record<Severity, number> = {
  blocker: 0,
  degraded: 1,
  minor: 2,
  question: 3,
};

const SEVERITY_HEADERS: Record<Severity, string> = {
  blocker: '🔴 Blockers',
  degraded: '🟡 Degraded',
  minor: '🟢 Minor',
  question: '❓ Questions',
};

/**
 * Run the bug-reports digest: fetch, triage, post to Discord, write archive.
 * Called by the main daily-digest scheduler after the main digest is posted.
 * Returns silently on any failure (errors logged) so it never blocks the caller.
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

  const distinctIssues = result.clusters.length;
  const header = `**🐛 Bug Reports Digest - ${titleDate}**\n*Last 24h · ${result.totalReports} reports · ${distinctIssues} distinct issue${distinctIssues === 1 ? '' : 's'}*`;

  // Group clusters by severity
  const bySeverity: Record<Severity, BugCluster[]> = {
    blocker: [],
    degraded: [],
    minor: [],
    question: [],
  };
  for (const cluster of result.clusters) {
    const sev = SEVERITY_ORDER[cluster.severity] !== undefined ? cluster.severity : 'minor';
    bySeverity[sev].push(cluster);
  }

  // Sort each bucket by count desc
  for (const sev of Object.keys(bySeverity) as Severity[]) {
    bySeverity[sev].sort((a, b) => b.count - a.count);
  }

  const sections: string[] = [];

  for (const sev of ['blocker', 'degraded', 'minor', 'question'] as Severity[]) {
    const clusters = bySeverity[sev];
    if (clusters.length === 0) continue;

    const sevSection = [`**${SEVERITY_HEADERS[sev]}**`, ''];
    for (const cluster of clusters) {
      sevSection.push(renderCluster(cluster));
    }
    sections.push(sevSection.join('\n'));
  }

  if (result.needs_more_info.length > 0) {
    const lines = [`**❓ Needs more info · ${result.needs_more_info.length} report${result.needs_more_info.length === 1 ? '' : 's'}**`, ''];
    for (const nmi of result.needs_more_info) {
      const quote = stripMentions(nmi.quote).slice(0, 200);
      lines.push(`- "${quote}" — ${nmi.author} → ${nmi.suggested_followup}`);
    }
    sections.push(lines.join('\n'));
  }

  const footer = `\n\n-# *Posted daily at ${process.env.DISCORD_RECAP_HOUR || '14'}:00 UTC*`;

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
    const text = stripMentions(quote.text).slice(0, 200);
    lines.push(`> "${text}" — ${quote.author}`);
  }

  return lines.join('\n');
}

function stripMentions(text: string): string {
  return text.replace(/@(\w+)/g, '$1').replace(/<@!?\d+>/g, '');
}

// ---------------------------------------------------------------------------
// Local archive
// ---------------------------------------------------------------------------

async function writeArchive(result: BugTriageResult, digestText: string): Promise<void> {
  const archiveDir = join(process.cwd(), 'archives', 'quorum-bug-reports');
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
