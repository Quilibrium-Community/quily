import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createChutes } from '@chutes-ai/ai-sdk-provider';
import { retrieveWithReranking } from './retriever';
import { buildContextBlock, buildSystemPrompt, formatSourcesForClient } from './prompt';
import { normalizeQuery } from './queryNormalizer';
import { parseFollowUpQuestions } from './followUpParser';
import type { RetrievedChunk, RetrievalOptions, SourceReference } from './types';
import type { RelevanceQuality } from './prompt';

export const INSTRUCTION_FOLLOWING_MODELS = [
  'anthropic/',
  'google/',
  'openai/',
];

export function isInstructionFollowingModel(model: string): boolean {
  return INSTRUCTION_FOLLOWING_MODELS.some((prefix) => model.startsWith(prefix));
}

export const LOW_RELEVANCE_FALLBACK_RESPONSE = `I don't have specific documentation about that topic in my knowledge base.

While Quilibrium supports various capabilities including token operations, compute deployment via QCL, and hypergraph storage, I don't have the detailed instructions for what you're asking about.

For the most accurate and up-to-date information, please check:
- **Official Documentation**: https://docs.quilibrium.com
- **Community Channels**: The Quilibrium Discord community can help with specific questions

Is there something else about Quilibrium I can help you with?`;

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
  const systemPrompt = buildSystemPrompt(context, chunks.length);
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

// Default models per provider
const OPENROUTER_DEFAULT_MODEL = 'deepseek/deepseek-chat-v3-0324';
const CHUTES_DEFAULT_MODEL = 'chutes-deepseek-ai-deepseek-v3-1-tee';

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

  if (prepared.ragQuality !== 'high' && !isInstructionFollowingModel(primaryModel)) {
    return {
      text: LOW_RELEVANCE_FALLBACK_RESPONSE,
      sources: [],
      followUpQuestions: null,
    };
  }

  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...options.conversationHistory,
    { role: 'user' as const, content: options.query },
  ];

  const modelsToTry = [primaryModel, ...getFallbackModels(llmProvider)];
  let lastError: unknown;

  for (const model of modelsToTry) {
    try {
      const modelId = llmProvider === 'chutes' ? getChuteUrl(model) : model;
      // Both providers return AI SDK-compatible models; Chutes types include
      // Promise<LanguageModelV2> which confuses the union — cast is safe.
      const aiModel = llmProvider === 'chutes'
        ? createChutes({ apiKey: options.llmApiKey })(modelId) as Parameters<typeof generateText>[0]['model']
        : createOpenRouter({ apiKey: options.llmApiKey })(modelId);
      const t1 = Date.now();
      const result = await generateText({
        model: aiModel,
        system: prepared.systemPrompt,
        messages,
      });
      console.log(`[processQuery] generateText (${model}) took ${Date.now() - t1}ms`);

      const { cleanText, questions } = parseFollowUpQuestions(result.text);

      return {
        text: cleanText,
        sources: prepared.sources,
        followUpQuestions: questions,
      };
    } catch (error) {
      lastError = error;
      console.error(`Model ${model} failed, ${modelsToTry.indexOf(model) < modelsToTry.length - 1 ? 'trying next fallback...' : 'no more fallbacks'}`);
    }
  }

  throw lastError;
}
