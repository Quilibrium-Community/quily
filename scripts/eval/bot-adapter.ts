/**
 * Bot-path adapter for the eval runner (`--bot`).
 *
 * Sends each turn through `processQuery`, the function the Discord bot uses:
 * shared OpenRouter routing, reasoning settings, the default chat model and
 * its fallback chain, retrieval defaults, and the answer post-processing.
 * Unlike `--direct`, it passes the conversation history, so multi-turn tests
 * exercise follow-up retrieval the way production does. It does not replay
 * Discord's previous-source injection.
 */
import type { ParsedResponse, SourceEntry } from './types';

export async function sendChatRequestBot(
  messages: { role: string; content: string }[],
  config: { apiKey: string; model?: string; timeoutMs: number },
): Promise<ParsedResponse> {
  const t0 = Date.now();
  const last = messages.at(-1);
  if (!last || last.role !== 'user') {
    return { text: '', sources: [], followUpQuestions: [], statusMessages: [], latencyMs: 0,
      error: 'Last message must come from the user' };
  }
  const history = messages.slice(0, -1).flatMap(message =>
    message.role === 'user' || message.role === 'assistant'
      ? [{ role: message.role as 'user' | 'assistant', content: message.content }] : []);
  try {
    // Imported lazily: the service reads database settings at import time.
    const { processQuery } = await import('../../src/lib/rag/service');
    const result = await processQuery({
      query: last.content,
      conversationHistory: history,
      llmProvider: 'openrouter',
      llmApiKey: config.apiKey,
      embeddingProvider: 'openrouter',
      embeddingApiKey: config.apiKey,
      ...(config.model ? { model: config.model } : {}),
      abortSignal: AbortSignal.timeout(config.timeoutMs),
      deadline: performance.now() + config.timeoutMs,
    });
    const sources: SourceEntry[] = result.sources.map(source => ({
      sourceId: `source-${source.index}-${source.id}`,
      url: source.url ?? '',
      title: source.title || source.heading || source.file || '',
    }));
    return {
      text: result.text,
      sources,
      followUpQuestions: result.followUpQuestions ?? [],
      statusMessages: [`servedModel=${result.model}`, `attempts=${result.attempts}`],
      latencyMs: Date.now() - t0,
      ...(result.text.trim() ? {} : { error: `No visible answer (finish=${result.finishReason})` }),
    };
  } catch (err) {
    return { text: '', sources: [], followUpQuestions: [], statusMessages: [], latencyMs: Date.now() - t0,
      error: err instanceof Error ? `${err.name}: ${err.message.slice(0, 200)}` : String(err) };
  }
}
