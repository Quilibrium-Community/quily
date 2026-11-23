import { DiscordReadError } from '../sync-discord/discord-api.js';
import type { DiscordChannel, DiscordMessage } from '../sync-discord/types.js';

export const channels = ['1212446222367985726', '1212804347759427654'];
export const authors = { cassie: '597996105300705301', 'black-swan': '1215272706577006593' };
export type Author = keyof typeof authors;
export type Read = <T>(path: string) => Promise<T>;

type Message = DiscordMessage & {
  channel_id: string;
  edited_timestamp?: string | null;
  mentions?: Array<{ id: string }>;
};
type Thread = DiscordChannel & { thread_metadata: { archive_timestamp: string } };

export interface Evidence {
  id: string;
  url: string;
  timestamp: string;
  editedAt?: string | null;
  author: Author | 'participant';
  text: string;
}

export interface Conversation {
  id: string;
  anchorIds: string[];
  evidence: Evidence[];
  missingContext: string[];
}

export interface Coverage {
  kind?: 'sample' | 'collect' | 'weekly';
  channelId: string;
  author: Author;
  from: string;
  to: string;
  guildId?: string;
  channelName?: string;
  sources?: string[];
  sourceIndex: number;
  before?: string;
  scanned: number;
  anchorIds: string[];
  rootAnchorIds?: string[];
  fetched: boolean;
  error?: string;
}

export interface Ledger {
  version: 1;
  coverage: Coverage[];
  conversations: Record<string, Conversation>;
  reviews?: Record<string, Review>;
}

export function nextUnfetchedRange(rows: Coverage[], since: string, until: string) {
  if (since >= until) return;
  let from = since;
  for (const row of rows.filter(row => row.fetched).sort((a, b) => a.from.localeCompare(b.from))) {
    if (row.from > from) return { from, to: row.from < until ? row.from : until };
    if (row.to > from) from = row.to;
    if (from >= until) return;
  }
  if (from < until) return { from, to: until };
}

const dispositions = ['durable', 'version-specific', 'short-lived', 'tentative', 'duplicate-or-superseded', 'irrelevant'];

interface ClaimDecision {
  claim: string;
  disposition: string;
  reason: string;
  evidenceIds: string[];
  anchorIds: string[];
  targetDoc?: string;
  proposedWording?: string;
  scope?: string;
  reviewTrigger?: string;
}

export interface Review {
  reviewedAt: string;
  anchorIds: string[];
  claims: ClaimDecision[];
}

export function reviewBatch(ledger: Ledger) {
  const decisions = Object.entries(ledger.reviews ?? {}).flatMap(([conversationId, review]) => {
    const conversation = ledger.conversations[conversationId];
    return review.claims.map(decision => ({
      ...decision,
      conversationId,
      reviewedAt: review.reviewedAt,
      sources: decision.evidenceIds.flatMap(id => {
        const evidence = conversation.evidence.find(item => item.id === id);
        return evidence ? [{ id, url: evidence.url, date: evidence.timestamp }] : [];
      }),
    }));
  });
  const targets = [...new Set(decisions.flatMap(decision =>
    ['durable', 'version-specific'].includes(decision.disposition) && decision.targetDoc ? [decision.targetDoc] : [],
  ))].sort();
  const reviewed = new Set(Object.values(ledger.reviews ?? {}).flatMap(review => review.anchorIds));
  return {
    proposals: targets.map(targetDoc => ({
      targetDoc,
      claims: decisions.filter(decision => decision.targetDoc === targetDoc &&
        ['durable', 'version-specific'].includes(decision.disposition)),
    })),
    otherDecisions: decisions.filter(decision => !['durable', 'version-specific'].includes(decision.disposition)),
    pendingConversations: Object.values(ledger.conversations).flatMap(conversation => {
      const anchorIds = conversation.anchorIds.filter(id => !reviewed.has(id));
      return anchorIds.length ? [{ id: conversation.id, anchorIds, missingContext: conversation.missingContext }] : [];
    }),
  };
}

export function recordReview(ledger: Ledger, id: string, claims: unknown) {
  const conversation = Object.hasOwn(ledger.conversations, id) ? ledger.conversations[id] : undefined;
  if (!conversation) throw new Error('Unknown conversation ID');
  if (!Array.isArray(claims) || !claims.length) throw new Error('Expected a nonempty array of claim decisions');
  const reviewed = new Set<string>();
  for (const item of claims) {
    if (!item || typeof item !== 'object' || typeof item.claim !== 'string' || !item.claim.trim() ||
        typeof item.reason !== 'string' || !item.reason.trim() || !dispositions.includes(item.disposition)) {
      throw new Error('Each claim requires claim, disposition, and reason');
    }
    if (!Array.isArray(item.evidenceIds) || !item.evidenceIds.length || !item.evidenceIds.every((id: unknown) =>
      typeof id === 'string' && (conversation.anchorIds.includes(id) || conversation.evidence.some(e => e.id === id)),
    )) {
      throw new Error('Each claim requires evidenceIds from its conversation');
    }
    if (!Array.isArray(item.anchorIds) || !item.anchorIds.length || !item.anchorIds.every((id: unknown) =>
      typeof id === 'string' && conversation.anchorIds.includes(id),
    )) {
      throw new Error('Each claim requires the anchorIds that it reviews');
    }
    for (const anchor of item.anchorIds as string[]) reviewed.add(anchor);
    if (['durable', 'version-specific'].includes(item.disposition)) {
      for (const field of ['targetDoc', 'proposedWording']) {
        if (typeof item[field] !== 'string' || !item[field].trim()) throw new Error(`Expected ${field} for a docs candidate`);
      }
    }
    if (item.disposition === 'version-specific') {
      for (const field of ['scope', 'reviewTrigger']) {
        if (typeof item[field] !== 'string' || !item[field].trim()) throw new Error(`Expected ${field} for version-specific advice`);
      }
    }
  }
  ledger.reviews ??= {};
  const previous = ledger.reviews[id];
  const allClaims = [...(previous?.claims ?? []), ...claims];
  ledger.reviews[id] = {
    reviewedAt: new Date().toISOString(),
    anchorIds: [...new Set([...(previous?.anchorIds ?? []), ...reviewed])],
    claims: [...new Map(allClaims.map(claim => [
      JSON.stringify([claim.claim, [...claim.anchorIds].sort()]),
      claim,
    ])).values()],
  };
}

function messageBoundary(timestamp: string): string {
  return ((BigInt(Date.parse(timestamp)) - 1420070400000n) << 22n).toString();
}

async function listSources(read: Read, channel: DiscordChannel, from: string): Promise<string[]> {
  const active = await read<{ threads: Thread[] }>(`/guilds/${channel.guild_id}/threads/active`);
  const sources = new Set([channel.id]);
  for (const thread of active.threads) {
    if (thread.parent_id === channel.id) sources.add(thread.id);
  }
  for (const privateThreads of channel.type === 0 ? [false, true] : [false]) {
    const suffix = privateThreads ? 'users/@me/threads/archived/private' : 'threads/archived/public';
    let before: string | undefined;
    do {
      const params = new URLSearchParams({ limit: '100' });
      if (before) params.set('before', before);
      const page = await read<{ threads: Thread[]; has_more: boolean }>(
        `/channels/${channel.id}/${suffix}?${params}`,
      );
      for (const thread of page.threads) {
        if (Date.parse(thread.thread_metadata.archive_timestamp) >= Date.parse(from)) sources.add(thread.id);
      }
      const last = page.threads.at(-1);
      const next = privateThreads ? last?.id : last?.thread_metadata.archive_timestamp;
      if (page.has_more && (!next || next === before)) throw new Error('Archived thread pagination did not advance');
      before = page.has_more && (privateThreads || (next && Date.parse(next) >= Date.parse(from))) ? next : undefined;
    } while (before);
  }
  return [...sources];
}

function evidence(message: Message, guildId: string): Evidence {
  const author = (Object.keys(authors) as Author[]).find(key => authors[key] === message.author.id);
  return {
    id: message.id,
    url: `https://discord.com/channels/${guildId}/${message.channel_id}/${message.id}`,
    timestamp: message.timestamp,
    editedAt: message.edited_timestamp,
    author: author ?? 'participant',
    text: message.content,
  };
}

function chronological(a: { id: string; timestamp: string }, b: { id: string; timestamp: string }) {
  return a.timestamp.localeCompare(b.timestamp) || a.id.length - b.id.length || a.id.localeCompare(b.id);
}

async function context(read: Read, anchor: Message, row: Coverage, page: Message[]): Promise<Conversation> {
  const missingContext: string[] = [];
  const position = page.indexOf(anchor);
  const nearby = position >= 10 && position + 10 < page.length
    ? page.slice(position - 10, position + 11)
    : await read<Message[]>(`/channels/${anchor.channel_id}/messages?around=${anchor.id}&limit=21`);
  const vicinity = nearby.filter(message =>
    Math.abs(Date.parse(message.timestamp) - Date.parse(anchor.timestamp)) <= 30 * 60_000 ||
      message.message_reference?.message_id === anchor.id,
  );
  const messages = new Map([...vicinity, anchor].map(message => [message.id, message]));
  let root = anchor.id;
  let current = anchor;
  const visited = new Set([anchor.id]);
  while (current.message_reference) {
    const { message_id: parentId, channel_id: parentChannel = current.channel_id } = current.message_reference;
    if (!parentId || visited.has(parentId) || visited.size >= 25) {
      missingContext.push('Reply chain is incomplete');
      break;
    }
    if (!row.sources!.includes(parentChannel) && !channels.includes(parentChannel)) {
      missingContext.push('Reply refers to a message outside the scoped channels');
      break;
    }
    try {
      current = messages.get(parentId) ?? page.find(message => message.id === parentId && message.channel_id === parentChannel) ??
        await read<Message>(`/channels/${parentChannel}/messages/${parentId}`);
    } catch (error) {
      if (!(error instanceof DiscordReadError) || ![403, 404].includes(error.status)) throw error;
      missingContext.push(`Referenced message ${parentId} is unavailable`);
      break;
    }
    messages.set(current.id, current);
    root = current.id;
    visited.add(current.id);
  }
  if (anchor.channel_id !== row.channelId) {
    root = anchor.channel_id;
    try {
      const starter = await read<Message>(`/channels/${row.channelId}/messages/${anchor.channel_id}`);
      messages.set(starter.id, starter);
    } catch (error) {
      if (!(error instanceof DiscordReadError) || ![403, 404].includes(error.status)) throw error;
      missingContext.push('Thread starter is unavailable');
    }
  } else if (visited.size === 1 && !anchor.message_reference) {
    missingContext.push('Verify the question and follow-ups in the surrounding conversation');
  }
  return {
    id: root,
    anchorIds: [anchor.id],
    evidence: [...messages.values()].filter(message => message.id === anchor.id || message.content)
      .sort(chronological)
      .map(message => evidence(message, row.guildId!)),
    missingContext,
  };
}

function merge(existing: Conversation | undefined, next: Conversation): Conversation {
  if (!existing) return next;
  const byId = new Map([...existing.evidence, ...next.evidence].map(item => [item.id, item]));
  return {
    id: next.id,
    anchorIds: [...new Set([...existing.anchorIds, ...next.anchorIds])],
    evidence: [...byId.values()].sort(chronological),
    missingContext: [...new Set([...existing.missingContext, ...next.missingContext])],
  };
}

export async function collect(read: Read, ledger: Ledger, row: Coverage, save: () => Promise<void>) {
  if (row.fetched) return;
  try {
    const channel = await read<DiscordChannel>(`/channels/${row.channelId}`);
    if ([15, 16].includes(channel.type)) {
      throw new Error('The scoped channel is a forum or media container; direct channel paging requires a text channel');
    }
    const bot = await read<{ id: string }>('/users/@me');
    const probe = await read<Message[]>(`/channels/${row.channelId}/messages?limit=20`);
    if (!channel.guild_id || !probe.some(message =>
      message.author.id !== bot.id && !message.author.bot && message.content?.trim() &&
      !message.mentions?.some(mention => mention.id === bot.id),
    )) {
      throw new Error('Could not verify history and message content access');
    }
    if (!row.sources) {
      row.sources = await listSources(read, channel, row.from);
      row.guildId = channel.guild_id;
      row.channelName = channel.name;
      await save();
    }
    const first = BigInt(messageBoundary(row.from));
    while (row.sourceIndex < row.sources.length) {
      const source = row.sources[row.sourceIndex];
      const before = row.before ?? messageBoundary(row.to);
      const page = await read<Message[]>(`/channels/${source}/messages?before=${before}&limit=100`);
      page.sort(chronological);
      const ids = page.map(message => BigInt(message.id));
      if (ids.some(id => id >= BigInt(before))) throw new Error('Message pagination did not advance');
      const oldest = ids.reduce((min, id) => id < min ? id : min, BigInt(before));
      const candidates = page.filter(message => BigInt(message.id) >= first);
      const found = candidates.filter(message => message.author.id === authors[row.author]);
      const conversations = [];
      for (const anchor of found) {
        const conversation = await context(read, anchor, row, page);
        if (!anchor.content?.trim()) conversation.missingContext.push(`Inspect textless Discord message ${anchor.id}`);
        conversations.push(conversation);
      }
      for (const conversation of conversations) {
        ledger.conversations[conversation.id] = merge(ledger.conversations[conversation.id], conversation);
      }
      row.anchorIds = [...new Set([...row.anchorIds, ...found.map(message => message.id)])];
      if (source === row.channelId) {
        row.rootAnchorIds = [...new Set([...(row.rootAnchorIds ?? []), ...found.map(message => message.id)])];
      }
      row.scanned += candidates.length;
      if (page.length < 100 || oldest <= first) {
        row.sourceIndex++;
        delete row.before;
      } else {
        row.before = oldest.toString();
      }
      delete row.error;
      await save();
    }
    row.fetched = true;
    await save();
  } catch (error) {
    row.fetched = false;
    row.error = error instanceof Error ? error.message : String(error);
    await save();
    throw error;
  }
}

export async function compareSampleSearch(read: Read, row: Coverage): Promise<string> {
  if (!row.fetched || !row.guildId) return 'Collection incomplete';
  const query = new URLSearchParams({
    channel_id: row.channelId,
    author_id: authors[row.author],
    min_id: messageBoundary(row.from),
    max_id: messageBoundary(row.to),
    limit: '25',
  });
  try {
    const result = await read<{ total_results?: number; messages?: Message[][] }>(
      `/guilds/${row.guildId}/messages/search?${query}`,
    );
    if (!result.messages || result.total_results === undefined) return 'Search indexing or unavailable';
    const ids = new Set(result.messages.flat().filter(message =>
      message.channel_id === row.channelId && message.author.id === authors[row.author] &&
      BigInt(message.id) >= BigInt(messageBoundary(row.from)) && BigInt(message.id) < BigInt(messageBoundary(row.to)),
    ).map(message => message.id));
    const expected = row.rootAnchorIds ?? [];
    if (result.total_results > 25) return 'Search exceeds one page; used history';
    return ids.size === expected.length && expected.every(id => ids.has(id))
      ? 'Search matches root channel sample'
      : 'Search differs from root channel sample; used history';
  } catch (error) {
    if (error instanceof DiscordReadError) return `Search returned ${error.status}; used history`;
    throw error;
  }
}
