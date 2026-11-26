import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chunkDocuments } from '../ingest/chunker';
import { loadDocuments } from '../ingest/loader';
import { controls, evidence, hiddenFile, incident } from './accuracy-cases';

const stopWords = new Set('a an and are as at be both by can do does for from how i if in is it me of on or so than that the their them there this to up was we were what when where which who will with without would you your'.split(' '));
const words = (text: string) => (text.toLowerCase().match(/[a-z0-9]+/g) ?? [])
  .filter(word => !stopWords.has(word));
const standaloneQuestions = [
  'Does Quilibrium publish social media posts and comments live or once per frame?',
  'Compare live publication and saving history for social posts and comments on Quilibrium. Do frames validate posts or save history?',
  'Does a Quilibrium social media app need frames for live posts and stored history if the app has no payments?',
  'Can a Quilibrium social app choose which posts and comments are visible live or saved in history using frames?',
];

async function main() {
  const snapshot = process.argv[2];
  assert(snapshot, 'Supply the directory containing the live retrieval traces');
  const documents = (await loadDocuments('docs')).filter(doc =>
    doc.path.replaceAll('\\', '/').toLowerCase() !== hiddenFile.toLowerCase());
  const chunks = await chunkDocuments(documents, 'offline-diagnostic');
  const df = new Map<string, number>();
  const counts = chunks.map(({ content, metadata }) => {
    const counts = new Map<string, number>();
    const tokens = words(`${metadata.title ?? ''} ${metadata.heading_path} ${content}`);
    for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
    for (const token of counts.keys()) df.set(token, (df.get(token) ?? 0) + 1);
    return { counts, length: tokens.length };
  });
  const averageLength = counts.reduce((sum, row) => sum + row.length, 0) / counts.length;
  function rank(query: string) {
    const terms = [...new Set(words(query))];
    return counts.map(({ counts, length }, index) => ({
      index,
      score: terms.reduce((score, term) => {
        const count = counts.get(term) ?? 0;
        if (!count) return score;
        const frequency = df.get(term)!;
        const idf = Math.log(1 + (chunks.length - frequency + 0.5) / (frequency + 0.5));
        return score + idf * count * 2.2 / (count + 1.2 * (0.25 + 0.75 * length / averageLength));
      }, 0),
    })).filter(row => row.score > 0).sort((a, b) => b.score - a.score || a.index - b.index)
      .map(row => row.index);
  }

  function fuse(current: number[], previous: number[]) {
    const scores = new Map<number, number>();
    for (const ranks of [current, previous]) {
      for (const [index, chunk] of ranks.slice(0, 100).entries()) {
        scores.set(chunk, (scores.get(chunk) ?? 0) + 1 / (61 + index));
      }
    }
    return [...scores].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([chunk]) => chunk);
  }

  const tests = [...incident, ...controls];
  console.log(JSON.stringify({ corpusChunks: chunks.length, files: documents.length }));
  for (const [index, test] of tests.entries()) {
    const trace = JSON.parse(await readFile(`${snapshot}/${test.id}-retrieval.json`, 'utf8'));
    const labels = new Set([...test.claims.flatMap(claim => claim.evidence), ...(test.gapEvidence ?? [])]);
    const lexical = rank(test.question);
    const previous = index > 0 && index < incident.length ? rank(incident[index - 1].question) : [];
    const combined = previous.length ? fuse(lexical, previous) : lexical;
    const standalone = index < standaloneQuestions.length ? rank(standaloneQuestions[index]) : [];
    for (const span of evidence.filter(span => labels.has(span.id))) {
      function anchorRank(ranked: number[]) {
        return ranked.findIndex(index => {
          const chunk = chunks[index];
          return chunk.metadata.source_file.replaceAll('\\', '/') === span.file &&
            [span.anchor, ...(span.alternativeAnchors ?? [])].some(anchor => chunk.content.includes(anchor));
        }) + 1;
      }
      const live = trace.recall.find((row: { evidence: string }) => row.evidence === span.id);
      const direct = live.vectorRanks.find((row: { query: string }) => row.query === trace.query)?.rank;
      const any = live.vectorRanks.filter((row: { rank: number }) => row.rank)
        .map((row: { query: string; rank: number }) => [row.query, row.rank]);
      console.log(JSON.stringify({ case: test.id, evidence: span.id, direct, any,
        rerankInput: live.rerankInputPosition, final: live.finalRank,
        bm25: anchorRank(lexical), previous: anchorRank(previous), fusion: anchorRank(combined),
        manualStandalone: anchorRank(standalone) }));
    }
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
