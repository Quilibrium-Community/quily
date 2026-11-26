import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { parseStreamResponse } from '../stream-parser';
import type { EvidenceFixture } from './fixtures';

const fixtureOrigin = 'https://quily-regression.invalid';
const chatEndpoint = 'https://openrouter.ai/api/v1/chat/completions';

interface Generation {
  requestedModel: string;
  servedModel: string;
  promptSha256: string;
  routing: unknown;
}

function configureEnvironment(apiKey: string, model: string) {
  Object.assign(process.env, {
    NEXT_PUBLIC_SUPABASE_URL: fixtureOrigin,
    SUPABASE_SERVICE_ROLE_KEY: 'fixture-key',
    NEXT_PUBLIC_FREE_MODE: 'true',
    OPENROUTER_API_KEY: apiKey,
    BOT_LLM_PROVIDER: 'openrouter',
    BOT_MODEL: model,
    BOT_FALLBACK_MODELS: model,
    MAX_MESSAGE_LENGTH: '2000',
    DISCORD_DAILY_LIMIT: '500',
  });
  delete process.env.GITHUB_TOKEN;
  delete process.env.COHERE_API_KEY;
  delete process.env.DISCORD_QUILY_CHANNEL_ID;
}

// These are the production entry points. Import after configuring Supabase's
// singleton so all retrieval traffic can be kept on the fixture transport.
async function runWeb(fixture: EvidenceFixture, model: string) {
  const { POST } = await import('../../../app/api/chat/route');
  const response = await POST(new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: 'turnstile_verified=true' },
    body: JSON.stringify({ model, messages: [{ role: 'user', content: fixture.query }] }),
    signal: AbortSignal.timeout(60_000),
  }));
  assert.equal(response.status, 200, 'Web route failed');
  return parseStreamResponse(response);
}

async function runDiscord(fixture: EvidenceFixture) {
  const { registerMentionHandler } = await import('../../../bot/src/handlers/mention');
  const { getHistory } = await import('../../../bot/src/utils/memory');
  let receive: ((message: unknown) => Promise<void>) | undefined;
  const user = { id: '123' };
  const client = {
    user,
    on(event: string, handler: typeof receive) {
      assert.equal(event, 'messageCreate');
      receive = handler;
    },
  };
  registerMentionHandler(client as unknown as Parameters<typeof registerMentionHandler>[0]);
  assert.ok(receive, 'Discord handler did not register');
  const messages: string[] = [];
  const send = async (message: string) => { messages.push(message); };
  const authorId = randomUUID();
  await receive({
    author: { id: authorId, username: 'fixture-user', bot: false },
    channelId: 'fixture-channel',
    channel: { send },
    content: `<@${user.id}> ${fixture.query}`,
    mentions: { has: (mentioned: typeof user) => mentioned === user },
    // Stands in for an empty discord.js Collection.
    attachments: { size: 0, filter: () => ({ size: 0 }) },
    reply: send,
  });
  return {
    text: getHistory(authorId, 'fixture-channel').at(-1)?.content ?? '',
    messages,
  };
}

// OpenRouter receives the system prompt as plain text or as cache-control parts.
function promptText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map((part) => (part as { text?: string }).text ?? '').join('');
  return '';
}

function mockCompletion(model: string, answer: string, stream: boolean) {
  const base = { id: 'fixture-generation', model, created: 1 };
  if (!stream) {
    return Response.json({
      ...base,
      choices: [{ index: 0, message: { role: 'assistant', content: answer }, finish_reason: 'stop' }],
    });
  }

  const chunks = [
    { ...base, choices: [{ index: 0, delta: { role: 'assistant', content: answer }, finish_reason: null }] },
    { ...base, choices: [{ index: 0, delta: {}, finish_reason: 'stop' }] },
  ];
  return new Response(chunks.map(chunk => `data: ${JSON.stringify(chunk)}\n\n`).join('') + 'data: [DONE]\n\n', {
    headers: { 'content-type': 'text/event-stream' },
  });
}

async function readServedModel(response: Response, streaming: boolean): Promise<string> {
  if (!response.ok) return '';
  if (!streaming) return (await response.json()).model ?? '';
  for (const line of (await response.text()).split('\n')) {
    if (!line.startsWith('data:')) continue;
    const data = line.slice(5).trim();
    if (data && data !== '[DONE]') {
      const chunk = JSON.parse(data);
      if (chunk.model && chunk.choices?.length) return chunk.model;
    }
  }
  return '';
}

export async function runFixture(
  fixture: EvidenceFixture,
  model: string,
  mode: { answer: string } | { apiKey: string },
) {
  configureEnvironment('apiKey' in mode ? mode.apiKey : 'fixture-key', model);
  const originalFetch = globalThis.fetch;
  const generations = { web: [] as Array<Promise<Generation>>, discord: [] as Array<Promise<Generation>> };
  const violations: string[] = [];
  const reject = (message: string): never => {
    violations.push(message);
    throw new Error(message);
  };

  // The Supabase client delegates to global fetch at request time. Only the
  // candidate completion endpoint can reach the network, and only in live mode.
  globalThis.fetch = async (input, init) => {
    const request = new Request(input, init);
    const url = new URL(request.url);
    if (request.url === `${fixtureOrigin}/rest/v1/rpc/match_document_chunks_chutes`) {
      return Response.json(fixture.documents);
    }
    if (request.url === 'https://openrouter.ai/api/v1/embeddings') {
      const { model: embeddingModel } = await request.clone().json();
      return Response.json({
        object: 'list',
        model: embeddingModel,
        data: [{ object: 'embedding', index: 0, embedding: [1, 0, 0] }],
        usage: { prompt_tokens: 1, total_tokens: 1 },
      });
    }
    if (request.url !== chatEndpoint) {
      return reject(`Unexpected request to ${url.origin}${url.pathname}`);
    }

    const payload = await request.clone().json();
    if (payload.model !== model) return reject(`Expected ${model}, requested ${String(payload.model)}`);
    const systemPrompt = promptText(payload.messages.find((message: { role: string }) => message.role === 'system')?.content);
    if (!systemPrompt) return reject('Missing system prompt');
    const surface = payload.stream ? 'web' : 'discord';
    if (generations[surface].length >= 2) return reject(`Too many ${surface} completion requests`);
    const response = 'answer' in mode
      ? mockCompletion(model, mode.answer, Boolean(payload.stream))
      : await originalFetch(request);
    generations[surface].push(readServedModel(response.clone(), Boolean(payload.stream)).then(
      servedModel => ({
        requestedModel: payload.model,
        servedModel,
        promptSha256: createHash('sha256').update(systemPrompt).digest('hex'),
        routing: payload.provider,
      }),
      () => ({ requestedModel: payload.model, servedModel: '', promptSha256: '', routing: payload.provider }),
    ));
    return response;
  };

  try {
    const web = await runWeb(fixture, model);
    const discord = await runDiscord(fixture);
    assert.deepEqual(violations, []);
    const webGenerations = await Promise.all(generations.web);
    const discordGenerations = await Promise.all(generations.discord);
    for (const attempts of [webGenerations, discordGenerations]) {
      assert.ok(attempts.length, 'No candidate generation ran');
      assert.ok(attempts.at(-1)?.servedModel, 'Provider did not identify the serving model');
    }
    return { web, discord, webGenerations, discordGenerations };
  } finally {
    globalThis.fetch = originalFetch;
  }
}
