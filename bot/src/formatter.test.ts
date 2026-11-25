import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { SourceReference } from '../../src/lib/rag/types';
import { formatForDiscord } from './formatter';

const tokenDoc: SourceReference = {
  id: 1,
  index: 1,
  file: 'quilibrium-official/build/tokens/creating-tokens.md',
  heading: null,
  url: 'https://docs.quilibrium.com/docs/build/tokens/creating-tokens',
  title: 'Creating Tokens',
  published_date: null,
  doc_type: null,
};
const otherDoc = { ...tokenDoc, id: 2, index: 2, url: 'https://docs.quilibrium.com/docs/other' };

test('lists a retrieved document linked directly in a Discord reply', () => {
  const reply = `See the [Creating Tokens](${tokenDoc.url}/#deployment) guide.`;
  const formatted = formatForDiscord(reply, [tokenDoc, otherDoc]);
  assert.match(formatted, /-# \*\*Sources:\*\*\n-# • \[1\] \*\*Official Docs:\*\* Creating Tokens/);
  assert.doesNotMatch(formatted, /\[2\]/);
});

test('preserves numbered citations and deduplicates chunks from the same document', () => {
  const formatted = formatForDiscord('Use the token intrinsic [1][3].', [
    tokenDoc, otherDoc, { ...tokenDoc, id: 3, index: 3 },
  ]);
  assert.match(formatted, /-# • \[1,3\]/);
  assert.doesNotMatch(formatted, /\[2\]/);
});

test('omits sources for uncited replies and links to pages outside the retrieved context', () => {
  for (const reply of ['Hey!', `See ${tokenDoc.url}-other.`]) {
    assert.doesNotMatch(formatForDiscord(reply, [tokenDoc]), /\*\*Sources:\*\*/);
  }
});

test('never lists sources for uncited replies, even when retrieval scored high', () => {
  // Real Discord replies that got unrelated "Related sources" before the fallback was removed.
  for (const reply of [
    "I don't have a delete function. But tbh, I'm not your broker.",
    "I don't have the specific number of transactions per second in my documentation.",
  ]) {
    const formatted = formatForDiscord(reply, [tokenDoc, otherDoc], 'high');
    assert.doesNotMatch(formatted, /sources:/i);
    assert.doesNotMatch(formatted, /creating-tokens|\/docs\/other/);
  }
  const cited = formatForDiscord('Use the token intrinsic [1].', [tokenDoc, otherDoc], 'high');
  assert.match(cited, /\*\*Sources:\*\*\n-# • \[1\]/);
  assert.doesNotMatch(cited, /\/docs\/other/);
});
