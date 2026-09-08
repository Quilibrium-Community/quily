/**
 * Probe for the "bare 👀 on real questions" defect (GitHub #122).
 *
 * Runs the Discord bot's REAL generation path — prepareQuery() for retrieval and
 * the same generateText() shape as src/lib/rag/service.ts — against questions
 * that produced an empty reply in production, in three arms:
 *
 *   A  prod       reasoning at provider default, maxOutputTokens 1000 (what the bot ships)
 *   B  no-reason  reasoning: { enabled: false }, maxOutputTokens 1000
 *   C  big-cap    reasoning at provider default, maxOutputTokens 4000
 *
 * Hypothesis under test: on harder questions deepseek-v4-flash spends the shared
 * 1000-token output budget on reasoning, finishes with reason "length" and zero
 * visible text, which mention.ts then renders as 👀. If true, arm A shows
 * finish=length + textLen=0 on the hard questions while B and C do not, and the
 * control question passes in every arm.
 *
 *   yarn tsx scripts/empty-reply-probe.ts            # 3 runs per cell
 *   PROBE_RUNS=1 yarn tsx scripts/empty-reply-probe.ts
 *
 * Env: OPENROUTER_API_KEY (required), COHERE_API_KEY (optional, rerank).
 * No env values are printed.
 */
import 'dotenv/config';
import { config as loadEnv } from 'dotenv';
import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import {
  prepareQuery,
  processQuery,
  OPENROUTER_PRIMARY_PROVIDER_ORDER,
  MAX_OUTPUT_TOKENS,
} from '../src/lib/rag/service';
import { parseFollowUpQuestions } from '../src/lib/rag/followUpParser';
import { ragTools } from '../src/lib/rag/tools';
import { withZdr } from '../src/lib/openrouter-routing';

loadEnv({ path: '.env.local' }); // fallback; never overrides values already set

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) { console.error('OPENROUTER_API_KEY not set'); process.exit(1); }

const MODEL = process.env.BOT_MODEL || 'deepseek/deepseek-v4-flash';
const RUNS = Number(process.env.PROBE_RUNS || 3);
// Spurious tool calls on plain questions tolerated before the run fails.
// Measured 2026-09-08 with reasoning off: 4/35 before the tool description
// was tightened, 1/35 after. A residual ~3% is real, so zero tolerance makes
// the check flaky; 1 per run catches a regression back to the old rate.
const MAX_SPURIOUS = Number(process.env.PROBE_MAX_SPURIOUS ?? 1);
const PROVIDER_ORDER = OPENROUTER_PRIMARY_PROVIDER_ORDER;

type Msg = { role: 'user' | 'assistant'; content: string };

interface Case {
  id: string; label: string; query: string; history: Msg[];
  /** true: the run FAILS unless create_knowledge_issue fires in every run of this case. Default false: any tool call counts as spurious. */
  expectTool?: boolean;
}

// A condensed version of the bot's own "three dimensions" answer, so the follow-up
// question below has the context it had in production.
const THREE_DIMENSIONS_ANSWER = `First principles: a network has independently varying properties. Liveness (is anything running?), readiness (does it do what it promises?), and maturity (is it robust under pressure?) are separate axes.

The framework:
Dimension 1 — Operational state: binary, externally verifiable. "live" / "down" / "degraded."
Dimension 2 — Contractual completeness: does the current network fulfill the documented promise of this phase? "phase-complete" / "phase-partial" / "phase-incomplete."
Dimension 3 — Production readiness: can it carry real load without failing? "battle-tested" / "tested" / "unproven."

A sentence like "the network is live, phase-partial, and unproven" is ugly but unambiguous. Stop collapsing three dimensions into one word.`;

const CASES: Case[] = [
  {
    id: 'control',
    label: 'CONTROL (answered fine in prod)',
    query: 'how to setup a cluster ?',
    history: [],
  },
  {
    id: 'cluster35',
    label: 'cluster tutorial, 2 machines, 35 workers (👀 in prod)',
    query: 'can you make a step by step tutorial to setup a cluster with 2 machines in the same home for 35 workers',
    history: [],
  },
  {
    id: 'status-lang',
    label: 'mainnet status language (👀 in prod)',
    query: "There's confusion on semantics regarding what an appropriate status label is for the Quilibrium mainnet. Particularly in regards to saying it wasn't live, now it is live despite many MVP features currently not being ready nor usable, now people waiting for those MVP features to be ready, and then even after MVP when future development is done. Please help provide best status language to describe these stages of quilibrium network.",
    history: [],
  },
  {
    id: 'three-dims',
    label: 'where does the network fall in the 3 dimensions (👀 x4 in prod)',
    query: 'Okay, where does network fall within this three dimensions at the moment',
    history: [
      { role: 'user', content: 'Think from first principles and come up with the best logical framework and language to discuss what status label fits the Quilibrium mainnet.' },
      { role: 'assistant', content: THREE_DIMENSIONS_ANSWER },
    ],
  },
  // Plain questions that must NOT trigger create_knowledge_issue. With reasoning
  // off the model has budget to call tools, and the first D run filed issues on
  // 2 of 12 plain questions. The qkms-report case below is the control that
  // MUST still file (the user explicitly asks to log it).
  {
    id: 'q-mods',
    label: 'plain question (filed spuriously in prod as #120)',
    query: 'how do I mention the moderators on this Discord?',
    history: [],
  },
  {
    id: 'q-rewards',
    label: 'plain how-to question',
    query: 'how do I check how much my node has earned so far?',
    history: [],
  },
  {
    id: 'q-compare',
    label: 'plain comparison question',
    query: "what's the difference between QKMS and AWS KMS?",
    history: [],
  },
  {
    id: 'qkms-report',
    label: 'QKMS DKG bug report, asks bot to log it (👀 in prod)',
    expectTool: true,
    query: `could you please log/check this issue with QKMS?

The hosted QKMS service sidecar is registered but is not contributing to ECC_SECG_P256K1 DKG ceremonies. This affects both a 2-of-2 (service + browser) and a 2-of-3 (service + my own service + browser). In both cases the external participants submit round 0 successfully, but the task remains at AWAITING_CLIENT, round 0.

As a control, a 2-of-2 with my own service + browser completed all four DKG rounds and returned a public key. A previous service + browser 2-of-2 also completed DKG and signing, which suggests an intermittent hosted-sidecar failure or regression rather than an unsupported configuration. I can provide task IDs, key IDs, timestamps and sanitized logs privately if needed.`,
    history: [],
  },
];

type Arm =
  | { id: 'A' | 'B' | 'C'; label: string; reasoningOff: boolean; maxOutputTokens: number; viaService?: false }
  // D runs processQuery() exactly as the bot ships it. Reasoning comes from the
  // env (OPENROUTER_REASONING) and the cap from MAX_OUTPUT_TOKENS, both printed
  // in the header, so what was tested is on record. This is the regression
  // check: 0 empties on every case, and the expectTool cases must file.
  | { id: 'D'; label: string; viaService: true };
const ALL_ARMS: Arm[] = [
  { id: 'A', label: 'pre-fix prod (reasoning default, cap 1000)', reasoningOff: false, maxOutputTokens: 1000 },
  { id: 'B', label: 'reasoning OFF, cap 1000', reasoningOff: true, maxOutputTokens: 1000 },
  { id: 'C', label: 'reasoning default, cap 4000', reasoningOff: false, maxOutputTokens: 4000 },
  { id: 'D', label: 'processQuery() as shipped', viaService: true },
];
// PROBE_ARMS=D  (default: A,B,C for the diagnosis; D alone for the regression check)
const ARM_FILTER = (process.env.PROBE_ARMS || 'A,B,C').split(',').map((s) => s.trim().toUpperCase());
const ARMS = ALL_ARMS.filter((a) => ARM_FILTER.includes(a.id));

interface Obs {
  caseId: string; arm: string; run: number;
  finish: string; textLen: number; reasoningLen: number;
  outTok: number | undefined; reasonTok: number | undefined;
  toolCalls: number; ms: number; provider: string; error?: string;
}

const log = (s: string) => process.stdout.write(s + '\n');

function buildModel(arm: Extract<Arm, { viaService?: false }>) {
  // service.ts pins providers for the primary model only. Set PROBE_NO_PIN=1
  // when pointing BOT_MODEL at a fallback model, or the pin's
  // allow_fallbacks=false fails with "no providers" and proves nothing.
  const routing = process.env.PROBE_NO_PIN
    ? withZdr(undefined)
    : withZdr({ order: PROVIDER_ORDER, allow_fallbacks: false });
  const settings: Record<string, unknown> = {};
  if (routing) settings.provider = routing;
  if (arm.reasoningOff) settings.reasoning = { enabled: false };
  const factory = createOpenRouter({ apiKey });
  return factory(MODEL, settings as Parameters<typeof factory>[1]);
}

async function runOnce(c: Case, systemPrompt: string, arm: Arm, run: number): Promise<Obs> {
  const messages: Msg[] = [...c.history, { role: 'user', content: c.query }];
  const t0 = Date.now();
  try {
    if (arm.viaService) {
      const r = await processQuery({
        query: c.query,
        conversationHistory: c.history,
        llmProvider: 'openrouter',
        llmApiKey: apiKey,
        embeddingProvider: 'openrouter',
        embeddingApiKey: apiKey,
        cohereApiKey: process.env.COHERE_API_KEY,
      });
      // `provider` carries the model that actually answered: a green arm D
      // answered by a fallback model would otherwise hide a broken primary.
      return {
        caseId: c.id, arm: arm.id, run,
        finish: `${r.finishReason}${r.attempts > 1 ? '(retry)' : ''}`,
        textLen: r.text.trim().length, reasoningLen: 0,
        outTok: undefined, reasonTok: undefined,
        toolCalls: r.toolCalls.length, ms: Date.now() - t0,
        provider: r.model === MODEL ? 'primary' : `FALLBACK:${r.model}`,
      };
    }
    if (arm.viaService) throw new Error('unreachable');
    const result = await generateText({
      model: buildModel(arm),
      system: systemPrompt,
      messages,
      tools: ragTools,
      maxOutputTokens: arm.maxOutputTokens,
    });
    const { cleanText } = parseFollowUpQuestions(result.text);
    const usage = result.usage as unknown as {
      outputTokens?: number; reasoningTokens?: number;
      outputTokenDetails?: { reasoningTokens?: number };
    };
    const meta = result.providerMetadata as Record<string, Record<string, unknown>> | undefined;
    const provider = String(meta?.openrouter?.provider ?? meta?.openrouter?.providerName ?? '?');
    return {
      caseId: c.id, arm: arm.id, run,
      finish: String(result.finishReason),
      textLen: cleanText.trim().length,
      reasoningLen: (result.reasoningText ?? '').length,
      outTok: usage?.outputTokens,
      reasonTok: usage?.outputTokenDetails?.reasoningTokens ?? usage?.reasoningTokens,
      toolCalls: result.toolCalls?.length ?? 0,
      ms: Date.now() - t0,
      provider,
    };
  } catch (e) {
    return {
      caseId: c.id, arm: arm.id, run, finish: 'ERROR', textLen: 0, reasoningLen: 0,
      outTok: undefined, reasonTok: undefined, toolCalls: 0, ms: Date.now() - t0,
      provider: '?', error: e instanceof Error ? e.message.slice(0, 120) : String(e),
    };
  }
}

async function main() {
  const reasoningEnv = /^(on|true|1)$/i.test(process.env.OPENROUTER_REASONING ?? 'off') ? 'ON' : 'off';
  log(`model=${MODEL} runs/cell=${RUNS} arms=${ARMS.map((a) => a.id).join(',')} ` +
      `| arm D config: OPENROUTER_REASONING=${reasoningEnv} MAX_OUTPUT_TOKENS=${MAX_OUTPUT_TOKENS}`);
  log(`note: 0 empties in N runs does not exclude a residual rate; at N=15 a 5% rate still shows 0/15 ~46% of the time. Raise PROBE_RUNS for a stronger claim.\n`);
  const all: Obs[] = [];

  for (const c of CASES) {
    log(`### ${c.id} — ${c.label}`);
    const t0 = Date.now();
    const prepared = await prepareQuery({
      query: c.query,
      conversationHistory: c.history,
      llmProvider: 'openrouter',
      llmApiKey: apiKey,
      embeddingProvider: 'openrouter',
      embeddingApiKey: apiKey,
      cohereApiKey: process.env.COHERE_API_KEY,
    });
    log(`  retrieval: ${prepared.retrievedChunks.length} chunks, quality=${prepared.ragQuality}, system=${prepared.systemPrompt.length} chars, ${Date.now() - t0}ms`);

    for (const arm of ARMS) {
      for (let run = 1; run <= RUNS; run++) {
        const o = await runOnce(c, prepared.systemPrompt, arm, run);
        all.push(o);
        // Text-less tool calls are NOT the defect: the handler replies "Thanks for
        // the correction!" plus the issue link. Only text-less, tool-less replies
        // become the placeholder.
        const empty = o.textLen === 0
          ? (o.toolCalls > 0 ? '  (tool call only: handler replies with issue link)' : '  <-- EMPTY (placeholder reply)')
          : '';
        log(`  ${arm.id}#${run} finish=${o.finish.padEnd(6)} text=${String(o.textLen).padStart(5)} reason=${String(o.reasoningLen).padStart(5)}ch outTok=${o.outTok ?? '?'} reasonTok=${o.reasonTok ?? '?'} tools=${o.toolCalls} ${o.ms}ms ${o.provider}${o.error ? ' ERR ' + o.error : ''}${empty}`);
      }
    }
    log('');
  }

  // Summary: empties and length-finishes per case x arm.
  log('### Summary — empty replies / length-finishes out of runs');
  log(`case         ${ARMS.map((a) => `arm ${a.id}`.padEnd(22)).join('')}`);
  for (const c of CASES) {
    const cells = ARMS.map((a) => {
      const obs = all.filter((o) => o.caseId === c.id && o.arm === a.id);
      const empties = obs.filter((o) => o.textLen === 0 && o.toolCalls === 0).length;
      const lengths = obs.filter((o) => o.finish === 'length').length;
      const tools = obs.filter((o) => o.toolCalls > 0).length;
      return `${empties}/${obs.length} empty, ${lengths} len, ${tools} tool`.padEnd(22);
    });
    log(`${c.id.padEnd(13)}${cells.join('')}`);
  }
  // Pass/fail is judged on arm D only (the shipped path). A/B/C are diagnostic.
  const failures: string[] = [];
  const d = all.filter((o) => o.arm === 'D');
  if (d.length > 0) {
    const empties = d.filter((o) => o.textLen === 0 && o.toolCalls === 0);
    if (empties.length) failures.push(`${empties.length} empty tool-less replies: ${empties.map((o) => `${o.caseId}#${o.run}`).join(', ')}`);
    const errors = d.filter((o) => o.finish === 'ERROR');
    if (errors.length) failures.push(`${errors.length} errors: ${errors.map((o) => `${o.caseId}#${o.run} ${o.error}`).join('; ')}`);
    for (const c of CASES) {
      const obs = d.filter((o) => o.caseId === c.id);
      if (c.expectTool && obs.some((o) => o.toolCalls === 0)) failures.push(`${c.id} was expected to file an issue in every run`);
    }
    const spurious = d.filter((o) => o.toolCalls > 0 && !CASES.find((c) => c.id === o.caseId)?.expectTool);
    if (spurious.length > MAX_SPURIOUS) failures.push(`${spurious.length} spurious tool calls on plain questions (max ${MAX_SPURIOUS}): ${spurious.map((o) => `${o.caseId}#${o.run}`).join(', ')}`);
    const viaFallback = d.filter((o) => o.provider.startsWith('FALLBACK'));
    if (viaFallback.length) failures.push(`${viaFallback.length} runs answered by a fallback model, not ${MODEL}`);
  }

  log('\nRAW_JSON ' + JSON.stringify(all));
  if (failures.length) {
    log(`\nFAIL (arm D):\n  - ${failures.join('\n  - ')}`);
    process.exit(1);
  }
  log(d.length ? '\nPASS (arm D)' : '\ndone (diagnostic arms only, no pass/fail)');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
