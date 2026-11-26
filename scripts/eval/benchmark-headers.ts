// API header benchmark: does the passage that states whether a header is
// required reach the model's context? Questions come from every third
// (operation, header) pair declared in the official API pages, so the label
// is the docs' own `required` flag. Runs production retrieval (prepareQuery)
// against the live database. No model answers or judging.
//
//   node --import tsx scripts/eval/benchmark-headers.ts --output results/<file>.json
import { readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { glob } from 'glob';

type Question = { file: string; op: string; header: string; required: boolean; product: string };

export function headerQuestions(root = 'docs/quilibrium-official/api'): Question[] {
  const all: Question[] = [];
  for (const file of glob.sync(`${root}/**/*.md`).map(path => path.replace(/\\/g, '/')).sort()) {
    const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const op = /^title:\s*(.+)$/m.exec(raw)?.[1]?.trim().replace(/^["']|["']$/g, '');
    const block = /export const HEADER_PARAMETERS = \[([\s\S]*?)\n\];/.exec(raw)?.[1];
    if (!op || !block) continue;
    const product = file.includes('q-kms') ? 'QKMS' : 'QStorage';
    for (const match of block.matchAll(/name:\s*"([^"]+)"[\s\S]*?required:\s*(true|false)/g)) {
      all.push({ file: file.replace(/^docs\//, ''), op, header: match[1], required: match[2] === 'true', product });
    }
  }
  return all.filter((_, index) => index % 3 === 0);
}

// The answering passage: from the operation's own page, naming the header next
// to a required flag, in either the original code form or the converted table.
function answers(chunk: { source_file: string; content: string }, q: Question) {
  return chunk.source_file === q.file && chunk.content.includes(q.header) &&
    (/required:\s*(true|false)/.test(chunk.content) || /\|\s*(Yes|No)\s*\|/.test(chunk.content));
}

async function main() {
  const { values } = parseArgs({ options: { output: { type: 'string' } } });
  if (!values.output) throw new Error('Supply --output');
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY must be loaded');
  const { prepareQuery } = await import('../../src/lib/rag/service');
  const rows = [];
  for (const q of headerQuestions()) {
    const query = `For ${q.product} ${q.op}, is the ${q.header} request header required?`;
    const started = performance.now();
    const prepared = await prepareQuery({ query, conversationHistory: [], embeddingApiKey: apiKey });
    const ms = Math.round(performance.now() - started);
    const rank = prepared.retrievedChunks.findIndex(chunk => answers(chunk, q)) + 1;
    rows.push({ ...q, query, rank, contextChunks: prepared.retrievedChunks.length, ms });
    process.stdout.write(rank ? '.' : 'x');
  }
  const found = rows.filter(row => row.rank > 0).length;
  const median = (list: number[]) => [...list].sort((a, b) => a - b)[Math.floor(list.length / 2)];
  const summary = { questions: rows.length, answerInContext: found, rate: found / rows.length,
    medianRetrievalMs: median(rows.map(row => row.ms)), medianContextChunks: median(rows.map(row => row.contextChunks)) };
  writeFileSync(values.output, JSON.stringify({ summary, rows }, null, 2) + '\n', { flag: 'wx' });
  console.log('\n' + JSON.stringify(summary));
}

if (require.main === module) main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
