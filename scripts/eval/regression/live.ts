/**
 * Live answer-quality gate for a candidate model or system prompt. Costs money.
 *
 * Runs the evidence fixtures through the production web route and Discord
 * handler with a real model, then checks each answer:
 *   - every inline [n] points at a retrieved source (deterministic)
 *   - strong evidence: cites only the documents that support the answer
 *   - no evidence: no citations at all
 *   - an LLM judge confirms the expected behavior (answer vs. uncertainty)
 *
 * Usage:
 *   python D:/scripts/skill-run.py --env OPENROUTER_API_KEY -- \
 *     yarn test:live --model <openrouter-model-id> [--runs 2]
 * The system prompt is whatever the working tree contains, so run this on the
 * branch that changes the prompt. Exit code 1 means the candidate regressed.
 */
import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';
import { evidence, type EvidenceFixture } from './fixtures';
import { runFixture } from './run-fixture';
import { getCitedIndices } from '../../../src/lib/rag/utils';

const JUDGE_MODEL = process.env.JUDGE_MODEL || 'anthropic/claude-sonnet-4.5';

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

/** Citation numbers whose fixture document genuinely supports the answer. */
function supportingIndices(fixture: EvidenceFixture): Set<number> {
  const supporting = new Set([202, 203]);
  return new Set(fixture.documents.flatMap((doc, i) => (supporting.has(doc.id) ? [i + 1] : [])));
}

function citationProblems(fixture: EvidenceFixture, text: string): string[] {
  const cited = [...getCitedIndices(text)];
  const problems: string[] = [];
  const unknown = cited.filter((n) => n < 1 || n > fixture.documents.length);
  if (unknown.length) problems.push(`cites unknown source(s) ${unknown.map((n) => `[${n}]`).join('')}`);
  if (fixture.quality === 'high') {
    const supporting = supportingIndices(fixture);
    if (!cited.some((n) => supporting.has(n))) problems.push('does not cite a supporting source');
    const unrelated = cited.filter((n) => n <= fixture.documents.length && !supporting.has(n));
    if (unrelated.length) problems.push(`cites non-supporting source(s) ${unrelated.map((n) => `[${n}]`).join('')}`);
  }
  if (fixture.quality === 'none' && cited.length) problems.push('cites sources when none were retrieved');
  return problems;
}

async function judge(apiKey: string, fixture: EvidenceFixture, answer: string) {
  const sources = fixture.documents.map((doc, i) => `[${i + 1}] ${doc.title}: ${doc.content}`).join('\n') || '(none)';
  const { object } = await generateObject({
    model: createOpenRouter({ apiKey })(JUDGE_MODEL),
    schema: z.object({ passed: z.boolean(), reasoning: z.string() }),
    prompt: `You grade a documentation assistant. Judge only against the retrieved sources below, not outside knowledge.

Question: ${fixture.query}

Retrieved sources:
${sources}

Expected behavior: ${fixture.expectedBehavior}

Answer:
${answer}

Pass only if the answer meets the expected behavior and every claim attached to a citation [n] is supported by source [n]. Give one or two sentences of reasoning.`,
  });
  return object;
}

async function main() {
  const model = arg('model');
  const runs = Number(arg('runs') ?? 1);
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!model || model.startsWith('--')) throw new Error('Pass --model <openrouter-model-id>');
  // A typo here must not turn into "0 answers checked, all passed".
  if (!Number.isInteger(runs) || runs < 1) throw new Error('--runs must be a whole number of at least 1');
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set');

  let failures = 0;
  for (let run = 1; run <= runs; run++) {
    for (const fixture of Object.values(evidence)) {
      let result;
      try {
        result = await runFixture(fixture, model, { apiKey });
      } catch (error) {
        // Count it and keep going, so one 429 doesn't hide the other fixtures.
        failures += 2;
        console.log(`FAIL run ${run} ${fixture.quality.padEnd(4)} both    ${error instanceof Error ? error.message : error}`);
        continue;
      }
      const served = result.webGenerations.at(-1);
      const answers = { web: result.web.text, discord: result.discord.text };
      for (const [surface, text] of Object.entries(answers)) {
        const problems = text.trim() ? citationProblems(fixture, text) : ['empty answer'];
        const verdict = text.trim() ? await judge(apiKey, fixture, text) : { passed: false, reasoning: 'empty answer' };
        if (!verdict.passed) problems.push(`judge: ${verdict.reasoning}`);
        failures += problems.length ? 1 : 0;
        const label = `${problems.length ? 'FAIL' : 'PASS'} run ${run} ${fixture.quality.padEnd(4)} ${surface.padEnd(7)}`;
        console.log(`${label} ${problems.join('; ') || verdict.reasoning}`);
        if (problems.length) console.log(`  answer: ${text.replace(/\s+/g, ' ').slice(0, 400)}`);
      }
      console.log(`  served by ${served?.servedModel}, system prompt sha256 ${served?.promptSha256.slice(0, 12)}`);
    }
  }
  console.log(failures ? `\n${failures} answer(s) failed for ${model}` : `\nAll answers passed for ${model}`);
  process.exit(failures ? 1 : 0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
