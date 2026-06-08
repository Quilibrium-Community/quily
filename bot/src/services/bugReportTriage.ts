// bot/src/services/bugReportTriage.ts
// Generates a triaged, clustered digest of the last 24h of #quorum-bug-reports.
// Two-pass: (1) vision pre-pass for any image attachments, (2) main LLM triage.

import type { Message, TextChannel } from 'discord.js';

const DEFAULT_TRIAGE_MODEL = 'deepseek/deepseek-v4-flash';
const DEFAULT_VISION_MODEL = 'google/gemini-2.5-flash-lite';
const MAX_INPUT_CHARS = 40_000;
const MIN_TEXT_LENGTH = 5;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Severity = 'high' | 'medium' | 'low' | 'question';

export interface BugCluster {
  canonical_symptom: string;
  component: string;
  severity: Severity;
  count: number;
  os_versions: string[];
  example_quotes: { author: string; text: string }[];
}

export interface NeedsMoreInfo {
  author: string;
  quote: string;
  suggested_followup: string;
}

export interface BugTriageResult {
  clusters: BugCluster[];
  needs_more_info: NeedsMoreInfo[];
  totalReports: number;
  date: string;
}

interface EnrichedMessage {
  authorName: string;
  content: string;
  timestamp: Date;
  imageDescriptions: string[];
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

function hasImageAttachment(msg: Message): boolean {
  return msg.attachments.some((a) => a.contentType?.startsWith('image/'));
}

function isPureEmoji(content: string): boolean {
  if (!content) return false;
  const withoutCustom = content.replace(/<a?:\w+:\d+>/g, '').trim();
  const withoutEmoji = withoutCustom
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}‍️]/gu, '')
    .trim();
  return withoutEmoji.length === 0;
}

function isMentionOnly(content: string): boolean {
  return /^(<@!?\d+>\s*)+$/.test(content.trim());
}

/**
 * Lighter filter than the recap filter — keeps short reports and URL-only
 * messages (often screenshots/log paste links). Keeps image-only messages
 * regardless of text length.
 */
function filterBugMessages(messages: Message[]): Message[] {
  return messages.filter((msg) => {
    if (msg.author.bot) return false;

    const content = msg.content.trim();
    const hasImage = hasImageAttachment(msg);

    if (!content && !hasImage) return false;
    if (content && content.length < MIN_TEXT_LENGTH && !hasImage) return false;
    if (content && isPureEmoji(content) && !hasImage) return false;
    if (content && isMentionOnly(content) && !hasImage) return false;

    return true;
  });
}

// ---------------------------------------------------------------------------
// Vision pre-pass
// ---------------------------------------------------------------------------

const VISION_PROMPT =
  "Describe what's in this screenshot in 1-2 sentences, focusing on any error messages, log output, command names, or technical content visible. Be terse. If it's not a technical screenshot, say 'non-technical image'.";

async function describeImage(imageUrl: string, apiKey: string, model: string): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: VISION_PROMPT },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 200,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`Vision API error ${response.status}`);
  }

  const data = (await response.json()) as { choices: { message: { content: string } }[] };
  return data.choices[0]?.message?.content?.trim() || '(no description)';
}

async function enrichWithVision(messages: Message[]): Promise<EnrichedMessage[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const visionModel = process.env.BUG_TRIAGE_VISION_MODEL || DEFAULT_VISION_MODEL;

  return Promise.all(
    messages.map(async (msg) => {
      const imageAttachments = msg.attachments.filter((a) =>
        a.contentType?.startsWith('image/'),
      );
      const imageDescriptions: string[] = [];

      if (imageAttachments.size > 0 && apiKey) {
        const results = await Promise.allSettled(
          [...imageAttachments.values()].map((a) => describeImage(a.url, apiKey, visionModel)),
        );
        for (const r of results) {
          if (r.status === 'fulfilled') {
            imageDescriptions.push(r.value);
          } else {
            console.error('[bug-triage] vision pass failed:', r.reason);
            imageDescriptions.push('(could not analyze image)');
          }
        }
      } else if (imageAttachments.size > 0) {
        // No API key — still note that images were attached so the triage LLM knows
        for (let i = 0; i < imageAttachments.size; i++) {
          imageDescriptions.push('(image attached, vision pass unavailable)');
        }
      }

      return {
        authorName: msg.author.displayName,
        content: msg.content,
        timestamp: msg.createdAt,
        imageDescriptions,
      };
    }),
  );
}

// ---------------------------------------------------------------------------
// Main triage LLM call
// ---------------------------------------------------------------------------

const TRIAGE_SYSTEM_PROMPT = `You are a bug-report triage assistant for the Quilibrium Discord server. You receive a list of messages posted in the #quorum-bug-reports channel in the last 24 hours. Your job is to cluster reports that describe the same underlying issue, triage them, and output structured JSON.

Output a single JSON object with two keys:

{
  "clusters": [
    {
      "canonical_symptom": "short normalized description of the issue",
      "component": "node | qclient | client | rpc | install | network | unclear",
      "severity": "high | medium | low | question",
      "count": <int>,
      "os_versions": ["Linux 2.1.3", "macOS 2.1.3"],
      "example_quotes": [
        { "author": "alice", "text": "raw quote, max 200 chars" }
      ]
    }
  ],
  "needs_more_info": [
    {
      "author": "heidi",
      "quote": "doesn't work",
      "suggested_followup": "ask: command, error output, OS, version"
    }
  ]
}

Component values:
- node: backend node daemon (start, sync, peer discovery, store)
- qclient: qclient CLI tool
- client: frontend app / UI (Quorum app, DMs, message history, scroll, layout)
- rpc: RPC endpoint behavior, timeouts on calls
- install: setup/install/upgrade process
- network: networking, peers, reachability
- unclear: cannot determine

Clustering rules (BE AGGRESSIVE — under-clustering is worse than over-clustering):
- Group reports that describe the same underlying problem, even if worded very differently or attached to different symptoms.
- The same user posting multiple consecutive messages about the same general issue MUST be one cluster, not many. Merge their quotes into example_quotes.
- "Message history slow to load", "messages out of date order", "history shows gaps", "scroll bar shows loading" on the SAME app are ONE cluster (message-history loading behavior), not four.
- "Node won't start" and "node hangs at startup" -> same cluster.
- Different components stay separate.
- Set count to the number of distinct user reports that belong to the cluster, NOT the number of quotes.

Severity rules — IMPORTANT: severity describes the BUG, not how many people reported it. A single "wallet shows zero balance" report is high severity even with count=1. Fifty reports of "button is misaligned" are low.
- high: data loss, funds at risk, security issue, node/qclient/wallet completely unusable, install fails completely, core functionality broken with no workaround.
- medium: important functionality has problems but a workaround exists, intermittent failures, significant performance degradation, confusing UX that blocks common flows.
- low: cosmetic, minor UI quirks, rendering details, mild performance hiccups, edge-case behaviors that don't block real usage.
- question: not a bug — user is asking how to do something or proposing a feature.

needs_more_info rules:
- ONLY include here messages that genuinely look like an attempt to report a bug but lack the detail to act on it. Examples: "doesn't work", "broken again", "help me", "node not working".
- DO NOT include: jokes, sarcasm, banter, rhetorical questions, "wishful" comments, bot @-mention bait. These are channel noise — omit them ENTIRELY from the output, do not classify them anywhere.
- DO NOT include short reactions or conversational replies between users.
- suggested_followup is a short string asking for the missing fields. Keep it under 100 chars.

example_quotes:
- Max 3 per cluster. Pick the most informative ones.
- Strip @username mentions from quote text (replace @foo with foo).
- Keep author display names exactly as provided.

Image-attached messages appear as: "[attached image: <description>]" alongside any user text. Treat the description as part of the user's report content.

Output ONLY the JSON object. No prose, no markdown fences.
If there are no bug reports, output: {"clusters":[],"needs_more_info":[]}`;

function formatForTriage(enriched: EnrichedMessage[]): string {
  const lines = enriched.map((m) => {
    const time = m.timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });
    let text = m.content || '';
    for (const desc of m.imageDescriptions) {
      text += (text ? ' ' : '') + `[attached image: ${desc}]`;
    }
    return `[${time} UTC] ${m.authorName}: ${text}`;
  });

  // Truncate oldest first if we blow the budget
  let joined = lines.join('\n');
  while (joined.length > MAX_INPUT_CHARS && lines.length > 1) {
    lines.shift();
    joined = lines.join('\n');
  }
  return joined;
}

function stripJsonFences(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function isValidTriageResult(parsed: unknown): parsed is { clusters: BugCluster[]; needs_more_info: NeedsMoreInfo[] } {
  if (!parsed || typeof parsed !== 'object') return false;
  const obj = parsed as Record<string, unknown>;
  return Array.isArray(obj.clusters) && Array.isArray(obj.needs_more_info);
}

async function runTriage(enriched: EnrichedMessage[], date: string): Promise<BugTriageResult | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is required for bug triage');

  const model = process.env.BUG_TRIAGE_LLM_MODEL || DEFAULT_TRIAGE_MODEL;
  const messagesText = formatForTriage(enriched);

  if (!messagesText.trim()) return null;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: TRIAGE_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Here are the messages from #quorum-bug-reports in the last 24h (${date}):\n\n${messagesText}`,
        },
      ],
      max_tokens: 4000,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Triage API error ${response.status}: ${body}`);
  }

  const data = (await response.json()) as { choices: { message: { content: string } }[] };
  const raw = data.choices[0]?.message?.content?.trim();
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFences(raw));
  } catch (err) {
    console.error('[bug-triage] JSON parse failed. Raw output:', raw.slice(0, 500));
    throw new Error(`Triage JSON parse failed: ${(err as Error).message}`);
  }

  if (!isValidTriageResult(parsed)) {
    console.error('[bug-triage] Invalid triage shape:', raw.slice(0, 500));
    return null;
  }

  return {
    clusters: parsed.clusters,
    needs_more_info: parsed.needs_more_info,
    totalReports: enriched.length,
    date,
  };
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

/**
 * Fetch the last 24h of messages from the bug-reports channel, run the
 * vision pre-pass for any image attachments, then run the main triage call.
 * Returns null if there are no substantive messages or the LLM returns nothing.
 */
export async function generateBugReportDigest(channel: TextChannel): Promise<BugTriageResult | null> {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const allMessages: Message[] = [];

  let lastId: string | undefined;
  while (true) {
    const batch = await channel.messages.fetch({
      limit: 100,
      ...(lastId ? { before: lastId } : {}),
    });
    if (batch.size === 0) break;

    let reachedCutoff = false;
    for (const msg of batch.values()) {
      if (msg.createdTimestamp < cutoff) {
        reachedCutoff = true;
        break;
      }
      allMessages.push(msg);
    }

    if (reachedCutoff || batch.size < 100) break;
    lastId = batch.last()!.id;
  }

  if (allMessages.length === 0) return null;

  allMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  const filtered = filterBugMessages(allMessages);
  if (filtered.length === 0) return null;

  const enriched = await enrichWithVision(filtered);
  const todayStr = new Date().toISOString().slice(0, 10);
  const result = await runTriage(enriched, todayStr);

  if (!result) return null;
  if (result.clusters.length === 0 && result.needs_more_info.length === 0) return null;

  return result;
}
