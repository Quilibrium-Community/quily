import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createChutes } from '@chutes-ai/ai-sdk-provider';
import { retrieveWithReranking } from './retriever';
import { buildContextBlock, buildSystemPrompt, formatSourcesForClient } from './prompt';
import { normalizeQuery } from './queryNormalizer';
import { parseFollowUpQuestions } from './followUpParser';
import { ragTools } from './tools';
import { withZdr } from '../openrouter-routing';
import { isReasoningEnabled } from '../openrouter-reasoning';
import type { RetrievedChunk, RetrievalOptions, SourceReference } from './types';
import type { RelevanceQuality } from './prompt';

export interface PrepareQueryOptions {
  query: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  priorityDocIds?: number[];
  llmProvider?: 'openrouter' | 'chutes';
  llmApiKey?: string;
  model?: string;
  embeddingProvider?: 'openrouter' | 'chutes';
  embeddingApiKey?: string;
  chutesAccessToken?: string;
  embeddingModel?: string;
  cohereApiKey?: string;
  /** Operator-configured form of address for this user. Discord only. */
  addressAs?: string;
  /**
   * Whether the caller will pass `create_knowledge_issue` to the model.
   * Must match the caller's actual tool list — see buildSystemPrompt's docs for
   * what goes wrong when the prompt describes a tool the model doesn't have.
   * Defaults to true.
   */
  issueToolAvailable?: boolean;
  /**
   * Cancels in-flight generation (and prevents the retry / fallback chain from
   * starting new ones). The Discord handler races processQuery against a timer;
   * without this the losing generation kept running and being billed.
   */
  abortSignal?: AbortSignal;
}

export interface PreparedQuery {
  systemPrompt: string;
  retrievedChunks: RetrievedChunk[];
  normalizedQuery: string;
  ragQuality: RelevanceQuality;
  avgSimilarity: number;
  sources: SourceReference[];
}

export interface ProcessQueryResult {
  text: string;
  sources: SourceReference[];
  followUpQuestions: string[] | null;
  toolCalls: Array<{ toolName: string; input: Record<string, string> }>;
  ragQuality: RelevanceQuality;
  finishReason: string;
  /** 1 normally; 2 when the first generation came back with no text and no tool call and was retried. */
  attempts: number;
  /** Model that produced `text`. Differs from the primary when the fallback chain was used. */
  model: string;
}

export async function prepareQuery(options: PrepareQueryOptions): Promise<PreparedQuery> {
  const normalizedQuery = normalizeQuery(options.query);

  const retrievalOptions: RetrievalOptions = {
    embeddingProvider: options.embeddingProvider || 'openrouter',
    embeddingApiKey: options.embeddingApiKey,
    chutesAccessToken: options.chutesAccessToken,
    embeddingModel: options.embeddingModel,
    cohereApiKey: options.cohereApiKey,
    priorityDocIds: options.priorityDocIds,
  };

  const chunks = await retrieveWithReranking(normalizedQuery, retrievalOptions);
  const { context, quality, avgSimilarity } = buildContextBlock(chunks);
  // The prompt must only describe the issue tool when the caller will actually
  // pass it. Defaults to true: the Discord path always passes ragTools.
  const systemPrompt = buildSystemPrompt(
    context,
    chunks.length,
    options.addressAs,
    options.issueToolAvailable ?? true,
  );
  const sources = formatSourcesForClient(chunks);

  return {
    systemPrompt,
    retrievedChunks: chunks,
    normalizedQuery,
    ragQuality: quality,
    avgSimilarity,
    sources,
  };
}

// Default models per provider.
// The `~` prefix is OpenRouter's alias namespace: it always resolves to the newest
// revision in the DeepSeek V4 Flash family. See src/lib/openrouter.ts for why we
// accept an auto-updating primary and what compensates for it.
const OPENROUTER_DEFAULT_MODEL = '~deepseek/deepseek-v4-flash-latest';
const CHUTES_DEFAULT_MODEL = 'chutes-deepseek-ai-deepseek-v3-2-tee';

// OpenRouter provider pinning for the primary model: avoid slow/expensive
// providers by preferring fast fp8/fp4 backends. allow_fallbacks=false makes
// the request fail fast when pinned providers are unavailable, so the caller's
// timeout handler triggers quickly instead of stalling on a slow fallback.
export const OPENROUTER_PRIMARY_PROVIDER_ORDER = ['SiliconFlow', 'DeepInfra'];

// Output budget. Whenever reasoning is ON this cap is SHARED with the thinking
// phase, and deepseek-v4-flash exhausts it before writing a single visible
// character on any non-trivial question (scripts/empty-reply-probe.ts,
// 2026-09-08: 11 of 15 runs empty or truncated at 1000; at 4000 the model
// reasoned for 16k chars and still returned nothing). Reasoning is disabled on
// the OpenRouter path below; it is NOT disabled on the Chutes path (that SDK
// exposes no switch), so with BOT_LLM_PROVIDER=chutes or OPENROUTER_REASONING=on
// the sharing problem is back. Sized from the same probe: the longest good
// answer with reasoning off used ~800 tokens (arm B).
export const MAX_OUTPUT_TOKENS = 1500;

// Reasoning toggle lives in src/lib/openrouter-reasoning.ts so the bot's digest
// services can share it without importing this module's Supabase chain.

const DEFAULT_FALLBACK_MODELS: Record<string, string[]> = {
  openrouter: [
    'qwen/qwen3-32b',
    'mistralai/mistral-small-3.2-24b-instruct',
  ],
  chutes: [
    'chutes-qwen-qwen3-32b',
    'chutes-chutesai-mistral-small-3-2-24b-instruct-2506',
  ],
};

function getFallbackModels(llmProvider: string): string[] {
  const envModels = process.env.BOT_FALLBACK_MODELS;
  if (envModels) return envModels.split(',').map((m) => m.trim()).filter(Boolean);
  return DEFAULT_FALLBACK_MODELS[llmProvider] || DEFAULT_FALLBACK_MODELS.openrouter;
}

/**
 * Convert a Chutes slug to its URL form for the AI SDK provider.
 */
function getChuteUrl(slug: string): string {
  if (slug.startsWith('http://') || slug.startsWith('https://')) return slug;
  return `https://${slug}.chutes.ai`;
}

export async function processQuery(options: PrepareQueryOptions): Promise<ProcessQueryResult> {
  const t0 = Date.now();
  const prepared = await prepareQuery(options);
  console.log(`[processQuery] prepareQuery took ${Date.now() - t0}ms`);

  const llmProvider = options.llmProvider || 'openrouter';
  const defaultModel = llmProvider === 'chutes' ? CHUTES_DEFAULT_MODEL : OPENROUTER_DEFAULT_MODEL;
  const primaryModel = options.model || process.env.BOT_MODEL || defaultModel;

  // All queries go to the LLM — the personality and system prompt handle
  // both casual interactions (jokes, banter) and low-relevance knowledge
  // questions. The LOW RELEVANCE WARNING injected into the context block
  // guards against hallucination on topics without good documentation.

  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...options.conversationHistory,
    { role: 'user' as const, content: options.query },
  ];

  const modelsToTry = [primaryModel, ...getFallbackModels(llmProvider)];
  let lastError: unknown;
  let lastEmpty: ProcessQueryResult | undefined;

  for (const model of modelsToTry) {
    try {
      const modelId = llmProvider === 'chutes' ? getChuteUrl(model) : model;
      const isPrimaryOpenRouter = llmProvider !== 'chutes' && model === primaryModel;
      // Both providers return AI SDK-compatible models; Chutes types include
      // Promise<LanguageModelV2> which confuses the union — cast is safe.
      // Merge the env-driven ZDR flag into whatever routing this model needs.
      // Primary model pins fast providers; others use default routing. `withZdr`
      // returns undefined when ZDR is off and there's no base routing, so we can
      // pass model settings without an empty `provider: {}`.
      const providerRouting = withZdr(
        isPrimaryOpenRouter
          ? { order: OPENROUTER_PRIMARY_PROVIDER_ORDER, allow_fallbacks: false }
          : undefined
      );
      // `reasoning` is passed as a raw setting: the SDK type wants max_tokens/effort
      // even for the pure-disable case, which the OpenRouter API does not.
      const openrouterSettings: Record<string, unknown> = {};
      if (providerRouting) openrouterSettings.provider = providerRouting;
      if (!isReasoningEnabled()) openrouterSettings.reasoning = { enabled: false };
      const openrouter = createOpenRouter({ apiKey: options.llmApiKey });
      const aiModel = llmProvider === 'chutes'
        ? createChutes({ apiKey: options.llmApiKey })(modelId) as Parameters<typeof generateText>[0]['model']
        : openrouter(modelId, openrouterSettings as Parameters<typeof openrouter>[1]);

      const generateOnce = async (attempt: number) => {
        const t1 = Date.now();
        const result = await generateText({
          model: aiModel,
          system: prepared.systemPrompt,
          messages,
          tools: ragTools,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          abortSignal: options.abortSignal,
        });
        const { cleanText, questions } = parseFollowUpQuestions(result.text);
        const toolCalls = (result.toolCalls || []).map((tc) => ({
          toolName: tc.toolName,
          input: tc.input as Record<string, string>,
        }));
        // The flat `reasoningTokens` is deprecated but some provider paths may
        // still populate only that one; this line is the production instrument
        // for the #122 failure mode, so it must not read 0 when reasoning is on.
        const reasonTok = result.usage.outputTokenDetails?.reasoningTokens
          ?? result.usage.reasoningTokens ?? 0;
        console.log(
          `[processQuery] generateText (${model}) attempt=${attempt} took ${Date.now() - t1}ms ` +
          `finish=${result.finishReason} text=${cleanText.trim().length}ch tools=${toolCalls.length} ` +
          `outTok=${result.usage.outputTokens ?? '?'} reasonTok=${reasonTok}`,
        );
        return { cleanText, questions, toolCalls, finishReason: String(result.finishReason) };
      };

      const isEmpty = (g: Awaited<ReturnType<typeof generateOnce>>) =>
        !g.cleanText.trim() && g.toolCalls.length === 0;

      // A reply with no text and no tool call is undeliverable (the Discord
      // handler renders it as a placeholder). Sampling is non-deterministic (in
      // production the same prompt failed four times, then answered in full),
      // so one retry on the same model is cheap insurance before moving on.
      let gen = await generateOnce(1);
      let attempts = 1;
      if (isEmpty(gen) && !options.abortSignal?.aborted) {
        console.warn(`[processQuery] empty reply from ${model} (finish=${gen.finishReason}), retrying once`);
        gen = await generateOnce(2);
        attempts = 2;
      }

      const out: ProcessQueryResult = {
        text: gen.cleanText,
        sources: prepared.sources,
        followUpQuestions: gen.questions,
        toolCalls: gen.toolCalls,
        ragQuality: prepared.ragQuality,
        finishReason: gen.finishReason,
        attempts,
        model,
      };

      // Two empties in a row is a failure of this model, just not a thrown one:
      // hand over to the fallback chain like an exception would. If every model
      // comes back empty, return the last empty result rather than throwing, so
      // the handler can still say something honest.
      if (isEmpty(gen) && !options.abortSignal?.aborted) {
        console.warn(`[processQuery] ${model} returned empty twice, trying next fallback`);
        lastEmpty = out;
        continue;
      }
      return out;
    } catch (error) {
      // A cancelled request must not cascade into three more paid attempts.
      if (options.abortSignal?.aborted) throw error;
      lastError = error;
      console.error(`Model ${model} failed, ${modelsToTry.indexOf(model) < modelsToTry.length - 1 ? 'trying next fallback...' : 'no more fallbacks'}`);
    }
  }

  if (lastEmpty) return lastEmpty;
  throw lastError;
}
