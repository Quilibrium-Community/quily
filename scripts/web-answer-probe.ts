/**
 * Probe for "the web app answers nothing and blames the provider".
 *
 * Measured on live prod 2026-09-11: "What is Quilibrium?" returned
 * outputLength 0 with toolCallNames ["create_knowledge_issue"] on 2 of 5 runs.
 * The user then sees app/api/chat/route.ts's empty-response error, which says
 * the upstream provider rate-limited the request. Nothing was rate-limited —
 * the model spent its turn on a tool call that prod cannot even execute
 * (production has no GITHUB_TOKEN).
 *
 * This replicates the WEB route's generation shape — not the Discord one. The
 * differences that matter: streamText instead of generateText, no
 * maxOutputTokens, latency-sorted provider routing, and no Cohere rerank
 * (prod has no COHERE_API_KEY).
 *
 * Arms — each is a candidate fix, so the run says which one actually works:
 *   A  as-shipped   tools, single step                (reproduces the defect)
 *   B  two-step     tools, stopWhen stepCountIs(2)    (model answers AND files)
 *   C  no-tool      tools omitted                     (model must answer)
 *   D  retry        as-shipped + one retry on empty   (cheapest patch)
 *
 * Pass condition: an arm is only a fix if it produced visible text in EVERY
 * run of every case. "Usually answers" is the bug.
 *
 *   yarn tsx scripts/web-answer-probe.ts
 *   PROBE_RUNS=5 PROBE_ARMS=A,B npx tsx scripts/web-answer-probe.ts
 *
 * Env: OPENROUTER_API_KEY. COHERE_API_KEY is deliberately ignored so the
 * retrieval matches production. No env values are printed.
 */
import 'dotenv/config';
import { config as loadEnv } from 'dotenv';
import { streamText, stepCountIs, tool } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { prepareQuery } from '../src/lib/rag/service';
import { ragTools } from '../src/lib/rag/tools';
import { withZdr } from '../src/lib/openrouter-routing';
import { reasoningSettings } from '../src/lib/openrouter-reasoning';

loadEnv({ path: '.env.local' });

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) { console.error('OPENROUTER_API_KEY not set'); process.exit(1); }

// Same resolution order as app/api/chat/route.ts getFreeModeModel().
const MODEL = process.env.FREE_MODE_DEFAULT_MODEL || '~deepseek/deepseek-v4-flash-latest';
const RUNS = Number(process.env.PROBE_RUNS || 5);
const ARM_FILTER = (process.env.PROBE_ARMS || 'A,B,C,D').split(',').map((s) => s.trim().toUpperCase());

interface Case { id: string; query: string; note: string }

// Every question here except `control` returned 0 visible characters against
// live prod on 2026-09-11.
const CASES: Case[] = [
  { id: 'what-is-quil', query: 'What is Quilibrium?', note: '0 chars in prod, 2 of 5 runs' },
  { id: 'node-earned', query: 'how do I check how much my node has earned so far?', note: '0 chars in prod' },
  { id: 'mods', query: 'how do I mention the moderators on this Discord?', note: '262 chars + spurious tool call in prod' },
  { id: 'cluster35', query: 'can you make a step by step tutorial to setup a cluster with 2 machines in the same home for 35 workers', note: '87 chars + spurious tool call in prod' },
  { id: 'control', query: "what's the difference between QKMS and AWS KMS?", note: 'answered fine in prod (1952 chars)' },
];

/** Rebuilt from app/api/chat/route.ts so routing matches what prod sends. */
function buildModel() {
  const providerSort = process.env.OPENROUTER_SORT ?? 'latency';
  const maxLatencyEnv = process.env.OPENROUTER_MAX_LATENCY_P90 ?? '4';
  const maxLatencyP90 = maxLatencyEnv.trim() === '' ? undefined : Number(maxLatencyEnv);
  const ignoreProviders = (process.env.OPENROUTER_IGNORE ?? '').split(',').map((s) => s.trim()).filter(Boolean);

  const routing = withZdr(
    providerSort
      ? {
          sort: providerSort as 'latency',
          quantizations: ['fp8', 'fp16', 'bf16', 'fp32', 'int8', 'unknown'],
          ...(maxLatencyP90 !== undefined && Number.isFinite(maxLatencyP90)
            ? { preferred_max_latency: { p90: maxLatencyP90 } }
            : {}),
          ...(ignoreProviders.length > 0 ? { ignore: ignoreProviders } : {}),
        }
      : undefined
  );

  const settings: Record<string, unknown> = {};
  if (routing) settings.provider = routing;
  Object.assign(settings, reasoningSettings());

  const factory = createOpenRouter({ apiKey });
  return factory(MODEL, settings as Parameters<typeof factory>[1]);
}

interface Obs { caseId: string; arm: string; run: number; textLen: number; toolCalls: number; finish: string; ms: number; error?: string; inputs?: string[]; leaked?: boolean }

/**
 * Did the model write tool-call syntax into VISIBLE text?
 *
 * This is the failure mode that arrives with arm C. Describing the tool in the
 * prompt while not passing it makes DeepSeek emit the call as prose, and the
 * client's TOOL_CALL_TEXT_REGEX (components/MessageBubble.tsx) strips from that
 * point to the end of the message — so a leak on the first line erases the whole
 * answer with no error shown. Counting textLen alone cannot see it, which is why
 * the first arm C result (0/30 dead) did not actually clear this configuration.
 */
const leaksToolCall = (text: string) => text.includes('create_knowledge_issue');

/**
 * Arm E's variant of the tool. Identical schema and description, but WITH an
 * execute function.
 *
 * This is the whole reason arm B fails. src/lib/rag/tools.ts defines the tool
 * with no `execute` ("handled manually in the Discord mention handler"), which
 * makes it a client-side tool: the SDK has no tool result to feed back, so the
 * step ends and `stopWhen: stepCountIs(2)` never gets a second step. Supplying
 * execute is what lets the loop continue to a text step.
 */
const toolsWithExecute = {
  create_knowledge_issue: tool({
    description: ragTools.create_knowledge_issue.description,
    inputSchema: ragTools.create_knowledge_issue.inputSchema,
    execute: async () => 'Issue recorded for the maintainers. Now answer the user\'s question normally.',
  }),
} as unknown as typeof ragTools;

/** Drains textStream the same way the route does, so textLen is what a user would see. */
async function streamOnce(system: string, query: string, opts: { tools: boolean; twoStep: boolean; execTool?: boolean }) {
  const result = streamText({
    model: buildModel(),
    system,
    messages: [{ role: 'user' as const, content: query }],
    ...(opts.tools ? { tools: opts.execTool ? toolsWithExecute : ragTools } : {}),
    ...(opts.twoStep ? { stopWhen: stepCountIs(2) } : {}),
  });
  let text = '';
  for await (const chunk of result.textStream) text += chunk;
  const toolCalls = (await result.toolCalls) ?? [];
  // The tool ARGUMENTS are the primary evidence for why the model fired at all.
  // Without them a spurious call is just a count; with them you can read what
  // the model believed it was filing.
  const inputs = toolCalls.map((tc) => JSON.stringify((tc as { input?: unknown }).input ?? {}));
  return { text: text.trim(), toolCalls: toolCalls.length, finish: String(await result.finishReason), inputs };
}

async function runCell(c: Case, systems: { withTool: string; withoutTool: string }, arm: string, run: number): Promise<Obs> {
  // Arm C is the shipped production config: no tools passed AND a prompt that
  // does not describe the tool. Measuring it against the tool-describing prompt
  // would test a combination the route never sends.
  const system = arm === 'C' ? systems.withoutTool : systems.withTool;
  const t0 = Date.now();
  try {
    const cfg = {
      A: { tools: true, twoStep: false },
      B: { tools: true, twoStep: true },
      C: { tools: false, twoStep: false },
      D: { tools: true, twoStep: false },
      E: { tools: true, twoStep: true, execTool: true },
      F: { tools: true, twoStep: false },
    }[arm]!;

    let r = await streamOnce(system, c.query, cfg);
    // Arm D: the minimal patch — one retry when the turn produced no text.
    if (arm === 'D' && !r.text) r = await streamOnce(system, c.query, cfg);
    // Arm F: the tool-aware fallback. When the turn spent itself on a tool call,
    // regenerate WITHOUT tools, which is the only configuration measured at 0
    // dead runs. The tool call is still captured, so nothing is lost.
    if (arm === 'F' && !r.text && r.toolCalls > 0) {
      const retry = await streamOnce(system, c.query, { tools: false, twoStep: false });
      r = { text: retry.text, toolCalls: r.toolCalls, finish: `${r.finish}->${retry.finish}`, inputs: r.inputs };
    }

    return { caseId: c.id, arm, run, textLen: r.text.length, toolCalls: r.toolCalls, finish: r.finish, ms: Date.now() - t0, inputs: r.inputs, leaked: leaksToolCall(r.text) };
  } catch (e) {
    return { caseId: c.id, arm, run, textLen: 0, toolCalls: 0, finish: 'ERROR', ms: Date.now() - t0, error: e instanceof Error ? e.message.slice(0, 140) : String(e) };
  }
}

async function main() {
  console.log(`model=${MODEL} runs/cell=${RUNS} arms=${ARM_FILTER.join(',')} (Cohere rerank OFF, matching prod)\n`);
  const all: Obs[] = [];

  for (const c of CASES) {
    // cohereApiKey omitted on purpose: production has no COHERE_API_KEY, so
    // reranking is off there and the retrieved context is what this sends.
    const base = {
      query: c.query,
      conversationHistory: [],
      llmProvider: 'openrouter' as const,
      llmApiKey: apiKey!,
      embeddingProvider: 'openrouter' as const,
      embeddingApiKey: apiKey!,
    };
    // Two prompts per case: the tool-describing one and the one the route now
    // builds when GITHUB_TOKEN is absent. Arm C must use the latter or it tests
    // a configuration production never sends.
    const prepared = await prepareQuery({ ...base, issueToolAvailable: true });
    const preparedNoTool = await prepareQuery({ ...base, issueToolAvailable: false });
    const systems = { withTool: prepared.systemPrompt, withoutTool: preparedNoTool.systemPrompt };

    console.log(`### ${c.id} — ${c.note}`);
    console.log(`  retrieval: ${prepared.retrievedChunks.length} chunks, quality=${prepared.ragQuality}, prompt ${prepared.systemPrompt.length} chars (${preparedNoTool.systemPrompt.length} without the tool section)`);

    for (const arm of ARM_FILTER) {
      for (let run = 1; run <= RUNS; run++) {
        const o = await runCell(c, systems, arm, run);
        all.push(o);
        const flag = o.textLen === 0
          ? '   <-- NO ANSWER (user sees an error)'
          : o.leaked ? '   <-- TOOL-CALL LEAK (client strips to end of message)' : '';
        console.log(`  ${o.arm}#${run} text=${String(o.textLen).padStart(5)} tools=${o.toolCalls} finish=${o.finish.padEnd(11)} ${o.ms}ms${o.error ? ' ERR ' + o.error : ''}${flag}`);
        for (const inp of o.inputs ?? []) console.log(`        tool args: ${inp.slice(0, 400)}`);
      }
    }
    console.log('');
  }

  console.log('### Summary — runs with NO visible answer (lower is better)');
  console.log(`case            ${ARM_FILTER.map((a) => `arm ${a}`.padEnd(14)).join('')}`);
  for (const c of CASES) {
    const cells = ARM_FILTER.map((a) => {
      const obs = all.filter((o) => o.caseId === c.id && o.arm === a);
      const dead = obs.filter((o) => o.textLen === 0).length;
      const leak = obs.filter((o) => o.leaked).length;
      return `${dead} dead, ${leak} leak /${obs.length}`.padEnd(18);
    });
    console.log(`${c.id.padEnd(16)}${cells.join('')}`);
  }

  // A leaked run is counted as a failure even though it has text: the client
  // deletes from the leak to the end of the message, so the user can end up with
  // an empty bubble and no error at all — strictly worse than the dead case.
  console.log('\n### Verdict — an arm is a fix only at 0 dead AND 0 leaked');
  for (const a of ARM_FILTER) {
    const obs = all.filter((o) => o.arm === a);
    const dead = obs.filter((o) => o.textLen === 0).length;
    const leak = obs.filter((o) => o.leaked).length;
    const ok = dead === 0 && leak === 0;
    console.log(`  arm ${a}: ${dead}/${obs.length} no answer, ${leak}/${obs.length} tool-call leak  ${ok ? '<-- always delivered a usable answer' : ''}`);
  }
  console.log('\nRAW_JSON ' + JSON.stringify(all));
}

main().catch((e) => { console.error(e); process.exit(1); });
