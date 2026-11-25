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

test('lists up to three distinct related sources when a strong match goes uncited', () => {
  const reply = 'External developers cannot deploy applications yet.';
  const sources = [
    tokenDoc,
    { ...tokenDoc, id: 2, index: 2, url: tokenDoc.url + '#deployment' },
    { ...otherDoc, id: 3, index: 3, title: 'Network roadmap' },
    { ...otherDoc, id: 4, index: 4, url: 'https://example.com/third', title: 'Third document' },
    { ...otherDoc, id: 5, index: 5, url: 'https://example.com/fourth', title: 'Fourth document' },
  ];
  const formatted = formatForDiscord(reply, sources, 'high');
  assert.match(formatted, /\*\*Related sources:\*\*/);
  assert.match(formatted, /Creating Tokens/);
  assert.match(formatted, /Network roadmap/);
  assert.match(formatted, /Third document/);
  assert.doesNotMatch(formatted, /#deployment|Fourth document|\[1\]/);
});

test('does not suggest weak retrieval matches or supplement explicit citations', () => {
  assert.doesNotMatch(formatForDiscord('Hello!', [tokenDoc], 'low'), /Related sources/);
  assert.doesNotMatch(formatForDiscord('No documentation found.', [], 'none'), /Related sources/);
  const cited = formatForDiscord('Use the token intrinsic [1].', [tokenDoc, otherDoc], 'high');
  assert.match(cited, /\*\*Sources:\*\*/);
  assert.doesNotMatch(cited, /Related sources|\/docs\/other/);
});
