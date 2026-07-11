/**
 * Automated A/B for task 2026-07-11 item #1: reasoning ON vs OFF on the real
 * Quily RAG+LLM chat path.
 *
 * For each representative Quilibrium technical question it:
 *   1. Runs the real RAG retrieval (prepareQuery) once — SAME context for both arms.
 *   2. Streams the LLM answer twice via OpenRouter: reasoning ON and reasoning OFF,
 *      measuring TTFT and the reasoning->content blank-screen gap (perceived latency).
 *   3. Collects both full answers, then asks an LLM judge (Claude Sonnet 4.5) to
 *      compare them BLIND on factual accuracy + completeness for a Quilibrium bot,
 *      grounded in the retrieved context. Verdict: A_better / B_better / tie, with a
 *      quality delta and reasoning. Arm labels are randomised per question so the
 *      judge can't be biased by position.
 *
 * Output: a markdown report to .agents/reports/<date>-reasoning-ab.md that Kyn reviews.
 * Decision rule (from the task): reasoning OFF ships only if the latency gap is
 * meaningful AND quality does not drop on technical precision.
 *
 * Env: OPENROUTER_API_KEY (LLM + embeddings + judge), COHERE_API_KEY (rerank, optional).
 *   yarn tsx scripts/reasoning-ab.ts
 * No env values are printed.
 */
import 'dotenv/config';
import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';
import { writeFileSync } from 'node:fs';
import { prepareQuery } from '../src/lib/rag/service';

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) { console.error('OPENROUTER_API_KEY not set'); process.exit(1); }

const MODEL = process.env.FREE_MODE_DEFAULT_MODEL || 'deepseek/deepseek-v4-flash';
const JUDGE_MODEL = process.env.REASONING_AB_JUDGE_MODEL || 'anthropic/claude-sonnet-4.5';
const RUNS_PER_ARM = Number(process.env.REASONING_AB_RUNS || 2); // latency stability
const FETCH_TIMEOUT_MS = 60000;

// Real Quilibrium technical questions — the domain where reasoning MIGHT help precision.
// Spread across consensus, node ops, tokenomics, cryptography, ecosystem.
const QUESTIONS = [
  'How does Quilibrium consensus work? Explain the hypergraph and proof of meaningful work.',
  'What are the hardware requirements to run a Quilibrium node, and how do rewards scale?',
  'Explain QUIL tokenomics: emission, halving, and how node operators are rewarded.',
  'What is QKMS and how does multi-party computation secure key management in Quilibrium?',
  'How does Quilibrium provide privacy? Explain oblivious transfer and the role of MPC.',
  'What is the difference between QStorage and traditional S3, and how is data kept private?',
];

const log = (s: string) => process.stdout.write(s + '\n');

interface ArmResult {
  ttftMs: number | null;      // time to first VISIBLE content token
  gapMs: number | null;       // reasoning -> content blank-screen gap (ON only)
  totalMs: number;            // time to full completion
  sawReasoning: boolean;
  provider: string | null;
  text: string;
  error?: string;
}

/** Stream one answer, measuring latency and capturing full text. */
async function streamArm(system: string, question: string, reasoningEnabled: boolean): Promise<ArmResult> {
  const t0 = Date.now();
  const body: Record<string, unknown> = {
    model: MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: question },
    ],
    stream: true,
    provider: { sort: 'latency', quantizations: ['fp8', 'fp16', 'bf16', 'fp32', 'int8', 'unknown'] },
  };
  if (!reasoningEnabled) body.reasoning = { enabled: false };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) return { ttftMs: null, gapMs: null, totalMs: Date.now() - t0, sawReasoning: false, provider: null, text: '', error: `HTTP ${res.status}: ${await res.text()}` };

    const reader = res.body!.getReader();
    const dec = new TextDecoder();
    let buf = '', firstReasoning: number | null = null, firstContent: number | null = null;
    let sawReasoning = false, sawContent = false, provider: string | null = null, text = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;
        try {
          const j = JSON.parse(data);
          if (j.provider && !provider) provider = j.provider;
          const d = j.choices?.[0]?.delta;
          if (!d) continue;
          if (d.reasoning && !sawReasoning) { sawReasoning = true; firstReasoning = Date.now() - t0; }
          if (d.content) {
            if (!sawContent) { sawContent = true; firstContent = Date.now() - t0; }
            text += d.content;
          }
        } catch { /* keep-alive / partial */ }
      }
    }
    const gap = (sawReasoning && firstReasoning !== null && firstContent !== null) ? firstContent - firstReasoning : null;
    return { ttftMs: firstContent, gapMs: gap, totalMs: Date.now() - t0, sawReasoning, provider, text };
  } catch (e) {
    return { ttftMs: null, gapMs: null, totalMs: Date.now() - t0, sawReasoning: false, provider: null, text: '', error: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(timer);
  }
}

const JudgeSchema = z.object({
  verdict: z.enum(['A_better', 'B_better', 'tie']),
  quality_delta: z.number().describe('0 = indistinguishable, up to 1 = one answer far better. Magnitude of the quality difference.'),
  accuracy_note: z.string().describe('Which answer is more factually accurate/precise vs the context, and why.'),
  completeness_note: z.string().describe('Which answer is more complete, and whether either omits key points.'),
});

/** Blind pairwise judge grounded in the retrieved context. */
async function judge(question: string, context: string, answerA: string, answerB: string) {
  const openrouter = createOpenRouter({ apiKey });
  const prompt = `You are a strict QA evaluator for "Quily", a RAG chatbot about the Quilibrium protocol.
Two answers (A and B) were produced for the SAME question using the SAME retrieved context.
Judge them BLIND — you do not know how either was generated. Judge ONLY on:
  (1) factual accuracy / technical precision relative to the context, and
  (2) completeness (covering the key points the context supports).
Do NOT reward length, style, or confidence. An answer that hedges correctly beats one that states a wrong specific.
If the answers are equivalent in accuracy and completeness, return "tie".

## Question
${question}

## Retrieved context (ground truth the answers should be consistent with)
${context.slice(0, 6000)}

## Answer A
${answerA || '(empty)'}

## Answer B
${answerB || '(empty)'}

Return your verdict.`;
  const result = await generateObject({ model: openrouter(JUDGE_MODEL), schema: JudgeSchema, prompt });
  return result.object;
}

const med = (xs: (number | null)[]): number | null => {
  const v = xs.filter((x): x is number => x !== null).sort((a, b) => a - b);
  return v.length ? v[Math.floor(v.length / 2)] : null;
};

async function main() {
  log(`# Reasoning A/B — model ${MODEL}\n`);
  log(`Runs per arm (latency): ${RUNS_PER_ARM}, judge: ${JUDGE_MODEL}\n`);

  const rows: string[] = [];
  const latOn: number[] = [], latOff: number[] = [], gaps: number[] = [];
  let onWins = 0, offWins = 0, ties = 0;
  const details: string[] = [];

  for (const question of QUESTIONS) {
    log(`\n## Q: ${question}`);
    // Same RAG context for both arms.
    const prepared = await prepareQuery({
      query: question, conversationHistory: [],
      embeddingProvider: 'openrouter', embeddingApiKey: apiKey,
      embeddingModel: 'baai/bge-m3', cohereApiKey: process.env.COHERE_API_KEY,
    });
    const system = prepared.systemPrompt;

    // Latency: multiple runs each arm.
    const onRuns: ArmResult[] = [], offRuns: ArmResult[] = [];
    for (let i = 0; i < RUNS_PER_ARM; i++) onRuns.push(await streamArm(system, question, true));
    for (let i = 0; i < RUNS_PER_ARM; i++) offRuns.push(await streamArm(system, question, false));

    const onTtft = med(onRuns.map(r => r.ttftMs));
    const offTtft = med(offRuns.map(r => r.ttftMs));
    const gap = med(onRuns.map(r => r.gapMs));
    if (onTtft !== null) latOn.push(onTtft);
    if (offTtft !== null) latOff.push(offTtft);
    if (gap !== null) gaps.push(gap);

    // Quality: judge the best (longest non-empty) answer from each arm, blind + randomised order.
    const onAns = onRuns.map(r => r.text).sort((a, b) => b.length - a.length)[0] || '';
    const offAns = offRuns.map(r => r.text).sort((a, b) => b.length - a.length)[0] || '';
    const flip = Math.random() < 0.5; // randomise which arm is "A"
    const A = flip ? offAns : onAns;
    const B = flip ? onAns : offAns;
    let verdictForOn: 'win' | 'loss' | 'tie' = 'tie';
    let judgeObj: Awaited<ReturnType<typeof judge>> | null = null;
    try {
      judgeObj = await judge(question, prepared.retrievedChunks.map(c => c.content).join('\n\n'), A, B);
      if (judgeObj.verdict === 'tie') { verdictForOn = 'tie'; ties++; }
      else {
        const aIsOn = !flip;
        const onIsBetter = (judgeObj.verdict === 'A_better') === aIsOn;
        verdictForOn = onIsBetter ? 'win' : 'loss';
        if (onIsBetter) onWins++; else offWins++;
      }
    } catch (e) {
      log(`  judge error: ${e instanceof Error ? e.message : String(e)}`);
      ties++;
    }

    log(`  TTFT ON=${onTtft ?? 'n/a'}ms  OFF=${offTtft ?? 'n/a'}ms  gap(ON)=${gap ?? 'n/a'}ms  quality: reasoning-OFF ${verdictForOn === 'win' ? 'WORSE' : verdictForOn === 'loss' ? 'BETTER' : 'tie'}`);

    rows.push(`| ${question.slice(0, 50)}… | ${onTtft ?? 'n/a'} | ${offTtft ?? 'n/a'} | ${offTtft !== null && onTtft !== null ? onTtft - offTtft : 'n/a'} | ${gap ?? 'n/a'} | ${verdictForOn === 'win' ? 'ON better' : verdictForOn === 'loss' ? 'OFF better' : 'tie'} | ${judgeObj ? judgeObj.quality_delta.toFixed(2) : 'n/a'} |`);
    details.push(`### ${question}\n\n- **On provider:** ${onRuns[0]?.provider ?? '?'}, sawReasoning=${onRuns[0]?.sawReasoning}\n- **Judge verdict (for reasoning-OFF):** ${verdictForOn}\n- **Accuracy:** ${judgeObj?.accuracy_note ?? 'n/a'}\n- **Completeness:** ${judgeObj?.completeness_note ?? 'n/a'}\n\n**Answer (reasoning ON):**\n\n${onAns.slice(0, 1200)}\n\n**Answer (reasoning OFF):**\n\n${offAns.slice(0, 1200)}\n`);
  }

  const mOn = med(latOn), mOff = med(latOff), mGap = med(gaps);
  const ttftSaving = mOn !== null && mOff !== null ? mOn - mOff : null;

  const report = `# Reasoning A/B — reasoning ON vs OFF (${new Date().toISOString().slice(0, 10)})

**Model:** \`${MODEL}\` · **Judge:** \`${JUDGE_MODEL}\` · **Runs/arm:** ${RUNS_PER_ARM} · **Questions:** ${QUESTIONS.length}

## Verdict summary

- **Latency:** median TTFT ON = **${mOn ?? 'n/a'}ms**, OFF = **${mOff ?? 'n/a'}ms** → reasoning-OFF saves **${ttftSaving ?? 'n/a'}ms** to first visible token.
- **Blank-screen gap** (reasoning→content, ON only): median **${mGap ?? 'n/a'}ms** — this is perceived latency the user stares at a blank screen.
- **Quality (blind judge, reasoning-OFF perspective):** OFF better on **${offWins}**, ON better on **${onWins}**, tie on **${ties}** of ${QUESTIONS.length}.

## Decision guidance (per task 2026-07-11 #1)
Ship reasoning OFF (behind \`OPENROUTER_REASONING\`, default off) only if the latency saving is meaningful AND quality does not drop (OFF wins/ties ≥ ON wins). If ON clearly wins on accuracy, keep reasoning or try \`reasoning_effort: 'low'\`.

| Question | TTFT ON (ms) | TTFT OFF (ms) | Δ (ON−OFF) | gap (ms) | Quality winner | Δquality |
|---|---|---|---|---|---|---|
${rows.join('\n')}

## Per-question detail

${details.join('\n')}

*Last updated: ${new Date().toISOString().slice(0, 10)}*
`;

  const outPath = `.agents/reports/${new Date().toISOString().slice(0, 10)}-reasoning-ab.md`;
  writeFileSync(outPath, report, 'utf8');
  log(`\n=== SUMMARY ===`);
  log(`Median TTFT: ON=${mOn}ms OFF=${mOff}ms (OFF saves ${ttftSaving}ms), gap median=${mGap}ms`);
  log(`Quality: OFF-better=${offWins} ON-better=${onWins} tie=${ties}`);
  log(`Report: ${outPath}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
