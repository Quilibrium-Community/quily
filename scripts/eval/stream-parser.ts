/**
 * AI SDK v6 UI Message Stream parser.
 *
 * The chat API sends JSON chunks in SSE data lines.
 */

import type { ParsedResponse, SourceEntry } from './types.js';

/**
 * Consume a streaming Response and extract structured data.
 */
export async function parseStreamResponse(
  response: Response
): Promise<ParsedResponse> {
  const startTime = Date.now();
  const textParts: string[] = [];
  const sources: SourceEntry[] = [];
  const followUpQuestions: string[] = [];
  const statusMessages: string[] = [];
  let ragQuality: ParsedResponse['ragQuality'];
  let error: string | undefined;

  const body = response.body;
  if (!body) {
    return {
      text: '',
      sources: [],
      followUpQuestions: [],
      statusMessages: [],
      latencyMs: Date.now() - startTime,
      error: 'No response body',
    };
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  function consumeLine(line: string) {
    if (!line.startsWith('data:')) return;
    const json = line.slice(5).trim();
    if (!json || json === '[DONE]') return;
    let payload;
    try {
      payload = JSON.parse(json);
    } catch {
      // Keep reading so later text and sources survive, but surface the problem.
      error ??= `Malformed stream line: ${json.slice(0, 80)}`;
      return;
    }
    switch (payload.type) {
      case 'text-delta':
        textParts.push(payload.delta);
        break;
      case 'source-url':
        sources.push(parseSourceEntry(payload));
        break;
      case 'data-follow-up':
        if (Array.isArray(payload.data)) followUpQuestions.push(...payload.data);
        break;
      case 'data-status':
        if (payload.data?.label) statusMessages.push(payload.data.label);
        break;
      case 'data-rag-quality':
        ragQuality = payload.data?.quality;
        break;
      case 'data-error':
        error ??= payload.data?.message || 'Chat stream reported an error';
        break;
      case 'error':
        error ??= payload.errorText || 'Chat stream reported an error';
        break;
    }
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) consumeLine(line);
    }
    consumeLine(buffer + decoder.decode());
  } catch (cause) {
    error ??= cause instanceof Error ? cause.message : String(cause);
  } finally {
    reader.releaseLock();
  }

  return {
    text: textParts.join(''),
    sources,
    followUpQuestions,
    statusMessages,
    ragQuality,
    error,
    latencyMs: Date.now() - startTime,
  };
}

/**
 * Parse a source-url payload into a SourceEntry.
 * Title format from chat route: "Title|doc_type|published_date"
 */
function parseSourceEntry(payload: {
  sourceId?: string;
  url?: string;
  title?: string;
}): SourceEntry {
  const titleParts = (payload.title || '').split('|');
  return {
    sourceId: payload.sourceId || '',
    url: payload.url || '',
    title: titleParts[0] || '',
    docType: titleParts[1] || undefined,
    publishedDate: titleParts[2] || undefined,
  };
}
