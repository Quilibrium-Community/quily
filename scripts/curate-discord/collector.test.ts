import assert from 'node:assert/strict';
import test from 'node:test';
import { DiscordReadError } from '../sync-discord/discord-api.js';
import { authors, collect, nextUnfetchedRange, recordReview, reviewBatch, type Coverage, type Ledger, type Read } from './collector.js';

const root = '1212446222367985726';
const from = '2026-11-01T00:00:00.000Z';
const to = '2026-11-08T00:00:00.000Z';
const base = (BigInt(Date.parse(from)) - 1420070400000n) << 22n;
const id = (offset: number) => (base + BigInt(offset)).toString();
const message = (offset: number, author: string, content: string, parent?: number) => ({
  id: id(offset), author: { id: author }, channel_id: root, content, timestamp: from,
  message_reference: parent === undefined ? undefined : { message_id: id(parent) },
});

test('weekly planning fills gaps and skips finished ranges, including pilot history', () => {
  const day = (n: number) => `2026-11-${String(n).padStart(2, '0')}T00:00:00.000Z`;
  const row = (start: number, end: number, fetched = true): Coverage => ({
    channelId: root, author: 'cassie', from: day(start), to: day(end),
    sourceIndex: 0, scanned: 0, anchorIds: [], fetched,
  });
  const coverage = [row(16, 23), row(25, 26), row(23, 25, false)];
  assert.deepEqual(nextUnfetchedRange(coverage, day(23), day(27)), { from: day(23), to: day(25) });
  assert.deepEqual(nextUnfetchedRange([...coverage, row(23, 25)], day(23), day(27)), { from: day(26), to: day(27) });
  assert.equal(nextUnfetchedRange([...coverage, row(23, 27)], day(23), day(27)), undefined);
  assert.equal(nextUnfetchedRange(coverage, day(23), day(23)), undefined);
});

test('checkpoints a page, resumes, and groups anchors with the same question', async () => {
  const row: Coverage = {
    channelId: root, author: 'cassie', from, to, sourceIndex: 0, scanned: 0, anchorIds: [], fetched: false,
  };
  let ledger: Ledger = { version: 1, coverage: [row], conversations: {} };
  const question = message(1, 'participant', 'Why does this happen?');
  const answer = message(101, authors.cassie, 'Here is why.', 1);
  const followUp = message(2, authors.cassie, 'One more detail.', 1);
  const missing = message(102, authors.cassie, 'Yes.', 900);
  const textless = message(3, authors.cassie, '');
  const firstPage = [missing, answer, ...Array.from({ length: 98 }, (_, index) => message(index + 3, 'participant', 'Other text'))];
  let fail = true;
  let firstPageReads = 0;
  let saved = '';
  const read: Read = async <T>(path: string) => {
    if (path === '/users/@me') return { id: 'bot' } as T;
    if (path === `/channels/${root}`) return { id: root, type: 0, guild_id: 'guild', name: 'general' } as T;
    if (path.endsWith('?limit=20')) return [answer] as T;
    if (path.includes('/threads/')) return { threads: [], has_more: false } as T;
    if (path.includes('around=')) return [] as T;
    if (path.endsWith(`/messages/${question.id}`)) return question as T;
    if (path.endsWith(`/messages/${id(900)}`)) throw new DiscordReadError(404, path);
    if (path.includes(`before=${id(3)}&`)) {
      if (fail) throw new Error('interrupted');
      return [followUp, question] as T;
    }
    if (path.includes('before=')) {
      firstPageReads++;
      firstPage[firstPage.length - 98] = textless;
      return firstPage as T;
    }
    throw new Error(`unexpected path: ${path}`);
  };
  const save = async () => { saved = JSON.stringify(ledger); };
  await assert.rejects(collect(read, ledger, row, save), /interrupted/);
  ledger = JSON.parse(saved) as Ledger;
  const resumed = ledger.coverage[0];
  assert.equal(resumed.before, id(3));
  assert.equal(resumed.fetched, false);
  fail = false;
  await collect(read, ledger, resumed, save);
  await collect(read, ledger, resumed, save);
  assert.equal(firstPageReads, 1);
  assert.equal(resumed.fetched, true);
  assert.equal(resumed.scanned, 102);
  assert.deepEqual(ledger.conversations[question.id].anchorIds, [answer.id, followUp.id]);
  assert.equal(ledger.conversations[question.id].evidence[0].id, question.id);
  assert.match(ledger.conversations[missing.id].missingContext[0], /unavailable/);
  assert.equal(ledger.conversations[textless.id].evidence[0].text, '');
  const decision = {
    claim: 'One detail', disposition: 'short-lived', reason: 'Upcoming release',
    evidenceIds: [answer.id], anchorIds: [answer.id],
  };
  recordReview(ledger, question.id, [decision]);
  recordReview(ledger, question.id, [decision]);
  assert.deepEqual(ledger.reviews?.[question.id].anchorIds, [answer.id]);
  assert.equal(ledger.reviews?.[question.id].claims.length, 1);
  assert.throws(() => recordReview(ledger, question.id, [{ ...decision, anchorIds: [missing.id] }]), /anchorIds/);
  const batchBeforeFollowUp = reviewBatch(ledger);
  assert.deepEqual(batchBeforeFollowUp.pendingConversations.find(item => item.id === question.id)?.anchorIds, [followUp.id]);
  assert.equal(batchBeforeFollowUp.proposals.length, 0);
  recordReview(ledger, question.id, [{
    claim: 'A stable explanation', disposition: 'durable', reason: 'Matches the specification',
    evidenceIds: [followUp.id], anchorIds: [followUp.id],
    targetDoc: 'docs/custom/Protocol.md', proposedWording: 'Explain the behavior.',
  }]);
  const batch = reviewBatch(ledger);
  assert.equal(batch.proposals[0].targetDoc, 'docs/custom/Protocol.md');
  assert.equal(batch.proposals[0].claims[0].sources[0].url, `https://discord.com/channels/guild/${root}/${followUp.id}`);
  assert.equal(batch.otherDecisions[0].disposition, 'short-lived');
  assert.equal(batch.pendingConversations.some(item => item.id === question.id), false);
});

test('does not mark a saved range fetched after root history access disappears', async () => {
  const row: Coverage = {
    channelId: root, author: 'cassie', from, to, sourceIndex: 0, scanned: 100,
    anchorIds: [], fetched: false, before: id(20), sources: [root],
  };
  const ledger: Ledger = { version: 1, coverage: [row], conversations: {} };
  const read: Read = async <T>(path: string) => {
    if (path === '/users/@me') return { id: 'bot' } as T;
    if (path === `/channels/${root}`) return { id: root, type: 0, guild_id: 'guild', name: 'general' } as T;
    if (path.endsWith('?limit=20')) {
      return [
        message(1, 'bot', 'Only the bot can read its own message'),
        { ...message(2, 'participant', 'Direct mention'), mentions: [{ id: 'bot' }] },
      ] as T;
    }
    throw new Error(`unexpected path: ${path}`);
  };
  await assert.rejects(collect(read, ledger, row, async () => {}), /verify history/);
  assert.equal(row.fetched, false);
  assert.equal(row.before, id(20));
  assert.match(row.error!, /verify history/);
});

test('uses the history page for context when the anchor has neighbors on both sides', async () => {
  const row: Coverage = {
    channelId: root, author: 'cassie', from, to, sourceIndex: 0, scanned: 0,
    anchorIds: [], fetched: false, sources: [root], guildId: 'guild',
  };
  const ledger: Ledger = { version: 1, coverage: [row], conversations: {} };
  const page = Array.from({ length: 27 }, (_, index) => message(index + 1, 'participant', 'Context'));
  page[13] = message(14, authors.cassie, 'Answer', 2);
  const read: Read = async <T>(path: string) => {
    if (path === '/users/@me') return { id: 'bot' } as T;
    if (path === `/channels/${root}`) return { id: root, type: 0, guild_id: 'guild', name: 'general' } as T;
    if (path.endsWith('?limit=20')) return [page[0]] as T;
    if (path.includes('before=')) return [...page].reverse() as T;
    throw new Error(`unexpected duplicate context request: ${path}`);
  };
  await collect(read, ledger, row, async () => {});
  assert.equal(row.fetched, true);
  assert.deepEqual(ledger.conversations[id(2)].anchorIds, [id(14)]);
  assert.equal(ledger.conversations[id(2)].evidence[0].id, id(2));
});
