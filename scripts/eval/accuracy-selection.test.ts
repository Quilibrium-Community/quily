import assert from 'node:assert/strict';
import test from 'node:test';
import type { RetrievedChunk } from '../../src/lib/rag/types';
import { selectPassage, type SelectionTrace } from './accuracy-selection';

function chunk(id: number, file: string, content = '', citationIndex = 0): RetrievedChunk {
  return {
    id, content, source_file: file, heading_path: null, source_url: null, published_date: null,
    title: null, doc_type: null, similarity: 0.6, citationIndex,
  };
}

const declaration = `export const HEADER_PARAMETERS = [
  {
    name: "x-amz-copy-source",
    required: true
  }
];`;

test('reserve the exact operation at rank six and keep its split table continuation', () => {
  const operation = 'copy-object.md';
  const first = chunk(1, operation, 'x-amz-copy-source: example', 1);
  const unrelated = chunk(2, 'other.md', '', 2);
  const continuation = chunk(3, operation, 'name: "x-amz-metadata-directive", required: false', 3);
  const wrongOperation = chunk(4, 'other.md', declaration);
  const exact = chunk(6, operation, declaration);
  const query = 'Does CopyObject require x-amz-copy-source and x-amz-metadata-directive?';
  const trace: SelectionTrace = {
    query, final: [first, unrelated, continuation],
    vector: [{ query, rows: [first, wrongOperation, unrelated, continuation, chunk(5, 'fifth.md'), exact] }],
  };
  const selected = selectPassage(trace);
  assert.deepEqual(selected.map(row => [row.id, row.citationIndex]), [[1, 1], [3, 2], [6, 3]]);
  assert.equal(continuation.citationIndex, 3);
  assert.equal(selectPassage(trace, true).at(-1)?.id, wrongOperation.id);

  trace.vector[0].rows.splice(5, 0, chunk(7, 'sixth.md'));
  assert.equal(selectPassage(trace), trace.final);
  trace.vector[0].rows.pop();
  trace.query = 'Does OtherOperation require x-amz-copy-source?';
  trace.vector[0].query = trace.query;
  assert.equal(selectPassage(trace), trace.final);
});

test('reserve at most one missing top-two sibling across supplied facet searches', () => {
  const first = chunk(1, 'messaging.md', 'Overview', 1);
  const tail = chunk(2, 'frames.md', 'Overview', 2);
  const messaging = chunk(3, 'messaging.md', 'Ephemeral delivery');
  const state = chunk(4, 'frames.md', 'Persisted state');
  const trace: SelectionTrace = {
    query: 'Are frames required?', final: [first, tail], vector: [],
    facetReports: [
      { query: 'delivery', trace: { vector: [{ query: 'delivery', rows: [first, messaging] }] } },
      { query: 'state', trace: { vector: [{ query: 'state', rows: [tail, state] }] } },
    ],
  };
  const selected = selectPassage(trace);
  assert.deepEqual(selected.map(row => [row.id, row.citationIndex]), [[1, 1], [3, 2]]);
  assert.equal(selected[1].directSimilarity, null);
});
