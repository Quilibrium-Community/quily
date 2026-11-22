import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createDraftingStreamGate, hasDraftingLeak, stripIssueMemoryNotes } from './visibleText';

test('strips echoed issue notes while preserving the surrounding answer', () => {
  assert.equal(
    stripIssueMemoryNotes('The registry is live.\n(I filed a GitHub issue for this.)\n\nNative routing is planned.'),
    'The registry is live.\n\nNative routing is planned.',
  );
  assert.equal(stripIssueMemoryNotes('I filed a GitHub issue for this.'), '');
  assert.equal(stripIssueMemoryNotes('(I could not file a GitHub issue for this.)'), '');
});

test('keeps ordinary references to GitHub issues', () => {
  const answer = 'You can open a GitHub issue for this.\r\n';
  assert.equal(stripIssueMemoryNotes(answer), answer);
});

test('rejects the Discord bridge reply with unmarked drafting before the answer', () => {
  const reply = `!

Okay, let's see. The user is asking about the Quilibrium Bridge and how it works compared to traditional cross-chain bridges. They want to know the technical details and the privacy aspects.

First, I need to check the documentation provided. The key sources are [1], [2], [3], [ [4].

I should make sure to mention that the bridge is not live yet as of the latest documentation.

The Quilibrium Bridge uses MetaVM's zero-knowledge proof system to verify Ethereum's state transitions cryptographically, unlike traditional bridges that rely on oracle networks. Here's how it works:`;
  assert.equal(hasDraftingLeak(reply), true);
  const gate = createDraftingStreamGate();
  for (let offset = 0; offset < reply.length; offset += 7) {
    assert.equal(gate.push(reply.slice(offset, offset + 7)), '');
  }
  assert.equal(gate.finish(), '');
  assert.equal(hasDraftingLeak(reply.slice(reply.indexOf('The Quilibrium Bridge uses'))), false);
});

test('publishes clean paragraphs before generation finishes', () => {
  const gate = createDraftingStreamGate();
  assert.equal(gate.push('The bridge uses proofs.\n'), '');
  assert.equal(gate.push('\nThis is the second'), 'The bridge uses proofs.\n\n');
  assert.equal(gate.push(' paragraph.'), '');
  assert.equal(gate.finish(), 'This is the second paragraph.');
});

test('allows conversational wording and fenced examples', () => {
  assert.equal(hasDraftingLeak('Okay, let’s see. I need to check the documentation before I can confirm.'), false);
  assert.equal(hasDraftingLeak('Example:\n```text\nThe user is asking about bridges. I should make sure to mention the sources.\n```'), false);
});

test('preserves clean replies across different provider chunk boundaries', () => {
  const replies = [
    'Yes.',
    'The bridge verifies Ethereum state using cryptographic proofs [1].\n\nTiming depends on Ethereum finality.',
    'The exact launch date is unclear. I need to check the documentation before I can confirm.',
    'Example fixture:\n\n```text\nThe user is asking about bridges.\n\nI should make sure to mention the sources.\n```\n\nEnd of example.',
    'The registry is live.\n\n```json\n["How do I register a name?"]\n```',
  ];

  for (const reply of replies) {
    assert.equal(hasDraftingLeak(reply), false);
    for (const chunkSize of [1, 7, reply.length]) {
      const gate = createDraftingStreamGate();
      let output = '';
      for (let offset = 0; offset < reply.length; offset += chunkSize) {
        output += gate.push(reply.slice(offset, offset + chunkSize));
      }
      assert.equal(output + gate.finish(), reply);
    }
  }
});

test('preserves clean text already sent and drops the drafting tail', () => {
  const gate = createDraftingStreamGate();
  const answer = 'The bridge verifies Ethereum state.\n\n';
  assert.equal(gate.push(answer + 'The user is asking about the bridge.\n\n'), answer);
  assert.equal(gate.push('First, I need to check the documentation.'), '');
  assert.equal(gate.finish(), '');
});

test('keeps streaming past a code block and a rule line', () => {
  const gate = createDraftingStreamGate();
  let shown = '';
  for (const piece of ['Run this:\n\n', '```bash\nqclient', ' balance\n\n```\n\n', '---\n\n', 'Then check the output.\n\n', 'Done']) {
    shown += gate.push(piece);
  }
  assert.ok(shown.includes('Then check the output.'), 'text after the code block must stream before finish()');
  shown += gate.finish();
  assert.equal(shown, 'Run this:\n\n```bash\nqclient balance\n\n```\n\n---\n\nThen check the output.\n\nDone');
});
