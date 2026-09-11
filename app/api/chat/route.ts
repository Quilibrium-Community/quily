import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createChutes } from '@chutes-ai/ai-sdk-provider';
import { prepareQuery } from '@/src/lib/rag/service';
import { computeStats, formatWebStats } from '@/src/lib/networkStats';
import { ragTools } from '@/src/lib/rag/tools';
import { createGitHubIssue } from '@/bot/src/utils/githubIssues';
import type { RetrievedChunk, SourceReference } from '@/src/lib/rag/types';
import { parseFollowUpQuestions } from '@/src/lib/rag/followUpParser';
import { visibleAnswerText, leaksToolCallText, TOOL_CALL_TEXT_REGEX, MIN_USABLE_ANSWER_CHARS } from '@/src/lib/rag/visibleText';
import { normalizeQuery } from '@/src/lib/rag/queryNormalizer';
import { getOAuthConfig, refreshTokens, checkChutesBalance } from '@/src/lib/chutesAuth';
import { validateApiKeyWithCredits } from '@/src/lib/openrouter';
import { getProvider } from '@/src/lib/providers';
import { withZdr } from '@/src/lib/openrouter-routing';
import { reasoningSettings } from '@/src/lib/openrouter-reasoning';
import { getCuratedModels, getChuteUrl } from '@/src/lib/chutes/chuteDiscovery';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  cookieOptions,
  getServerAccessToken,
  getServerRefreshToken,
} from '@/src/lib/serverAuth';
import { verifyTurnstileToken } from '@/src/lib/turnstile';

/** Development mode flag for verbose logging */
const isDev = process.env.NODE_ENV === 'development';

// Startup diagnostics — always logged so Vercel logs show the config state
console.log('[Chat route] Config:', {
  freeMode: process.env.NEXT_PUBLIC_FREE_MODE,
  hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY),
  nodeEnv: process.env.NODE_ENV,
});

/** Default model for free mode when no model is specified by client. */
function getDefaultFreeModel(): string {
  if (process.env.NEXT_PUBLIC_FREE_MODE !== 'true') return '';
  return process.env.FREE_MODE_DEFAULT_MODEL || '~deepseek/deepseek-v4-flash-latest';
}

/**
 * Fallback models for Chutes when primary model is unavailable (503 errors).
 * Ordered by preference - cost-effective and reliable options.
 */
const CHUTES_FALLBACK_MODELS = [
  {
    slug: 'chutes-moonshotai-kimi-k2-5-tee',
    displayName: 'Kimi K2.5',
    url: 'https://chutes-moonshotai-kimi-k2-5-tee.chutes.ai',
  },
  {
    slug: 'chutes-qwen-qwen2-5-72b-instruct',
    displayName: 'Qwen 2.5 72B',
    url: 'https://chutes-qwen-qwen2-5-72b-instruct.chutes.ai',
  },
  {
    slug: 'chutes-qwen-qwen3-32b',
    displayName: 'Qwen 3 32B',
    url: 'https://chutes-qwen-qwen3-32b.chutes.ai',
  },
];

type FallbackModel = typeof CHUTES_FALLBACK_MODELS[number];

/**
 * Get fallback models for Chutes, excluding the current model and any already tried
 */
function getChutesFallbackModels(currentModel: string, triedModels: string[] = []): FallbackModel[] {
  return CHUTES_FALLBACK_MODELS.filter(m =>
    !currentModel.includes(m.slug) && !triedModels.some(tried => tried.includes(m.slug))
  );
}

/**
 * Check if an error indicates the model is temporarily unavailable (can retry with fallback)
 */
function isModelUnavailableError(errorMsg: string): boolean {
  return (
    errorMsg.includes('503') ||
    errorMsg.toLowerCase().includes('no instances available') ||
    errorMsg.toLowerCase().includes('service unavailable')
  );
}

/**
 * Check if an error indicates insufficient credits (should NOT retry)
 */
function isCreditsError(errorMsg: string): boolean {
  return (
    errorMsg.includes('402') ||
    errorMsg.toLowerCase().includes('insufficient') ||
    errorMsg.toLowerCase().includes('credit') ||
    errorMsg.toLowerCase().includes('balance') ||
    errorMsg.toLowerCase().includes('payment required')
  );
}


/**
 * Command responses for Quily assistant
 */
const COMMAND_RESPONSES: Record<string, string> = {
  '/help': `# Quily Commands

Here are the available commands:

- \`/help\` — Display this help message with all available commands
- \`/examples\` — See example questions you can ask me
- \`/sources\` — View information about my knowledge sources

---

**What can I help you with?**

I'm Quily, your Quilibrium protocol assistant. I can help you with:
- Understanding Quilibrium's architecture and core concepts
- Node setup and operation questions
- Technical details from the whitepaper
- Writing content related to Quilibrium

Just ask me anything about Quilibrium!`,

  '/examples': `# Example Questions

Here are some questions you can ask me:

**Getting Started:**
- "What is Quilibrium?"
- "How do I set up a Quilibrium node?"
- "What are the system requirements for running a node?"

**Technical Concepts:**
- "How does Quilibrium's consensus mechanism work?"
- "What is the role of the MPC (Multi-Party Computation) in Quilibrium?"
- "Explain Quilibrium's approach to privacy"

**Node Operations:**
- "How do I check if my node is running correctly?"
- "What ports need to be open for a Quilibrium node?"
- "How do I update my node to the latest version?"

**Ecosystem:**
- "What is QConsole?"
- "How does S3 storage work on Quilibrium?"

---

Feel free to ask me any of these or your own questions about Quilibrium!`,

  '/sources': `# Knowledge Sources

My knowledge comes from the following official sources:

**Primary Documentation:**
- [Quilibrium Documentation](https://docs.quilibrium.com) — Node operation guides and tutorials

**Official Live Streams & AMAs:**
- All official Quilibrium live streams featuring Cassandra Heart and the team
- Community AMAs, protocol updates, and roadmap discussions
- Technical deep dives and Q&A sessions

**Custom & Community Documents:**
- Discord explanations from Cassandra Heart and the Quilibrium team
- Technical references and deep-dives not yet published on the official docs site
- Community-contributed guides, FAQs, and analyses (marked as unofficial)
- Available in the [project repository](https://github.com/Quilibrium-Community/quily/tree/main/docs)

**What I Can Help With:**
- **Protocol & Architecture** — How Quilibrium works, consensus mechanisms, cryptographic foundations
- **Node Operations** — Setup guides, troubleshooting, hardware requirements, best practices
- **$QUIL Token** — Tokenomics, rewards structure
- **QConsole Services** — S3 storage, KMS key management, and other decentralized services
- **Roadmap & Development** — Current progress, upcoming features, and protocol evolution
- **Community Questions** — Common topics discussed in live streams and AMAs

---

**Important Note:**
> Use critical thinking — I do my best, but I can still make mistakes! Quilibrium is a complex and evolving technology. For the most accurate and up-to-date answers, I recommend consulting the official documentation at [docs.quilibrium.com](https://docs.quilibrium.com) and engaging with the community channels.`,
};

/**
 * Check if message is a command and return the response if so
 */
function getCommandResponse(message: string): string | null {
  const trimmed = message.trim().toLowerCase();
  return COMMAND_RESPONSES[trimmed] || null;
}

/** Exact command patterns that trigger live network stats (bypass RAG).
 *  Must be the entire message — no partial matches in longer sentences.
 */
const STATS_PATTERNS = [
  /^\s*(?:network\s+)?stats?\s*$/i,
  /^\s*\/stats?\s*$/i,
];

function isStatsQuery(message: string): boolean {
  return STATS_PATTERNS.some((p) => p.test(message));
}

/**
 * Validate priority doc IDs from client
 * Ensures array of positive integers, capped at 20
 */
function validatePriorityDocIds(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((id): id is number => typeof id === 'number' && Number.isInteger(id) && id > 0)
    .slice(0, 20);
}

/**
 * Extract text content from message (handles various formats)
 */
function getMessageContent(msg: Record<string, unknown>): string {
  // Try content string first (legacy format)
  if (typeof msg.content === 'string') return msg.content;

  // Try parts array (AI SDK v6 format)
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p): p is { type: string; text: string } =>
        p && typeof p === 'object' && 'type' in p && p.type === 'text' && typeof (p as { text?: unknown }).text === 'string'
      )
      .map((p) => p.text)
      .join('');
  }

  return '';
}

/**
 * Extract role from message
 */
function getMessageRole(msg: Record<string, unknown>): 'user' | 'assistant' | 'system' {
  const role = msg.role;
  if (role === 'user' || role === 'assistant' || role === 'system') {
    return role;
  }
  return 'user';
}

/**
 * Refresh Chutes access token if missing and refresh token is available.
 * In development, CHUTES_DEV_API_KEY can bypass OAuth for testing.
 */
async function ensureChutesAccessToken(): Promise<{
  accessToken: string | null;
  refreshed: boolean;
  refreshToken?: string;
  expiresIn?: number;
}> {
  // Free mode now uses OpenRouter — this function is only reached for non-free-mode Chutes auth
  if (process.env.NEXT_PUBLIC_FREE_MODE === 'true') {
    return { accessToken: null, refreshed: false };
  }

  // Dev bypass: use CHUTES_DEV_API_KEY if set (for testing without OAuth)
  const devApiKey = process.env.CHUTES_DEV_API_KEY;
  if (devApiKey) {
    if (isDev) console.log('[Chutes] Using dev API key bypass');
    return { accessToken: devApiKey, refreshed: false };
  }

  const accessToken = await getServerAccessToken();
  if (accessToken) {
    return { accessToken, refreshed: false };
  }

  const refreshToken = await getServerRefreshToken();
  if (!refreshToken) {
    return { accessToken: null, refreshed: false };
  }

  try {
    const config = getOAuthConfig();
    const refreshedTokens = await refreshTokens({ refreshToken, config });
    return {
      accessToken: refreshedTokens.access_token,
      refreshed: Boolean(refreshedTokens.access_token),
      refreshToken: refreshedTokens.refresh_token || refreshToken,
      expiresIn: refreshedTokens.expires_in ?? 3600,
    };
  } catch {
    return { accessToken: null, refreshed: false };
  }
}

function buildSetCookieHeader(name: string, value: string, maxAge?: number): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (cookieOptions.secure) {
    parts.push('Secure');
  }
  if (typeof maxAge === 'number') {
    parts.push(`Max-Age=${maxAge}`);
  }
  return parts.join('; ');
}

/**
 * Build a session cookie for Turnstile verification.
 * This cookie marks the session as verified so subsequent requests
 * don't need to provide/verify a Turnstile token.
 *
 * - No Max-Age = session cookie (deleted when browser closes)
 * - HttpOnly = not accessible via JavaScript (security)
 * - SameSite=Lax = sent with same-site requests and top-level navigations
 */
function buildTurnstileSessionCookie(): string {
  const parts = [
    'turnstile_verified=true',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (cookieOptions.secure) {
    parts.push('Secure');
  }
  return parts.join('; ');
}

/**
 * Status update structure sent to client via data-status parts.
 * Currently only 'search' step is shown - other steps flash too quickly to be visible.
 */
interface StatusUpdate {
  stepId: 'search';
  label: string;
  description?: string;
  status: 'pending' | 'active' | 'completed';
}

/**
 * Playful search status messages - randomly selected for each query.
 * Mix of creative/whimsical and Quilibrium-themed messages.
 */
const SEARCH_MESSAGES = [
  // Creative/playful
  'Summoning ancient wisdom...',
  'Peeking behind the curtain...',
  'Consulting the sacred scrolls...',
  'Interrogating the documents...',
  'Rummaging through the library...',
  'Decoding the mysteries...',
  'Spinning up the knowledge hamster...',
  'Bribing the database...',
  'Whispering to the servers...',
  'Shaking the knowledge tree...',
  'Poking the oracle...',
  'Dusting off the archives...',
  'Feeding the query monster...',
  // Quilibrium-themed
  'Querying the hypergraph...',
  'Traversing hyperedges...',
  'Spinning the time reel...',
  'Buzzing the BlossomSub...',
  'Garbling circuits...',
  'Proving with bulletproofs...',
  'Threading the onion router...',
  'Executing oblivious queries...',
  'Resolving CRDT conflicts...',
  'Calculating planted cliques...',
];

/**
 * Get a random search message
 */
function getRandomSearchMessage(): string {
  return SEARCH_MESSAGES[Math.floor(Math.random() * SEARCH_MESSAGES.length)];
}

/**
 * Helper to write a status update to the stream.
 * Uses 'data-status' type which the client will receive via onData callback.
 */
function writeStatus(
  writer: { write: (chunk: { type: `data-${string}`; data: unknown; transient?: boolean }) => void },
  update: StatusUpdate
) {
  writer.write({
    type: 'data-status' as const,
    data: update,
    transient: true, // Don't persist in message history
  });
}

/**
 * Deterministic correction flow detection.
 *
 * Instead of relying on the model to call tools (which open-source models
 * do unreliably), we detect the correction flow from conversation history:
 *
 * 1. If the previous bot message asked the user for correction details
 *    (contains "I'll open an issue" or similar), AND
 * 2. The current user message is NOT vague ("wrong", "nope", etc.)
 * → Auto-create the issue server-side, no model involvement needed.
 */

/** Phrases the bot uses when asking for correction details */
const CORRECTION_PROMPT_PATTERNS = [
  "i'll open an issue",
  "open an issue to get this fixed",
  "i can still flag it",
  "flag it for review",
  "tell me and i'll",
  "share them, and i'll",
  "share the correct",
  "provide the correct",
  "know what the right answer is",
  "know the correct answer",
];

/**
 * Check if the bot's previous message was asking the user for correction details.
 */
function botAskedForCorrection(assistantMessage: string): boolean {
  const lower = assistantMessage.toLowerCase();
  return CORRECTION_PROMPT_PATTERNS.some((p) => lower.includes(p));
}

/**
 * Check if the user's message is a vague correction (just "wrong", "incorrect", etc.)
 * without specific details. These should NOT trigger immediate issue creation —
 * the bot should ask for details first.
 */
const VAGUE_CORRECTION_PATTERNS = /^\s*(wrong|incorrect|not right|not correct|nope|no|that'?s wrong|that'?s not right|that'?s incorrect|bad answer|you'?re wrong|false|inaccurate)\s*[.!?]?\s*$/i;

function isVagueCorrection(userMessage: string): boolean {
  return VAGUE_CORRECTION_PATTERNS.test(userMessage.trim());
}

function parseToolCallFromText(text: string): { title: string; correction: string; kind?: 'knowledge' | 'behavior' } | null {
  // Check if the text contains a tool call pattern
  if (!text.includes('create_knowledge_issue')) return null;

  // Extract the JSON object after create_knowledge_issue
  const jsonStart = text.indexOf('{', text.indexOf('create_knowledge_issue'));
  if (jsonStart === -1) return null;

  // Find matching closing brace
  let braceCount = 0;
  let jsonEnd = -1;
  for (let i = jsonStart; i < text.length; i++) {
    if (text[i] === '{') braceCount++;
    if (text[i] === '}') braceCount--;
    if (braceCount === 0) { jsonEnd = i + 1; break; }
  }
  if (jsonEnd === -1) return null;

  const normalizeKind = (v: unknown): 'knowledge' | 'behavior' | undefined =>
    v === 'behavior' || v === 'knowledge' ? v : undefined;

  try {
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd));
    const title = parsed.title;
    // Accept "correction", "body", "description", or "content" as the correction field
    const correction = parsed.correction || parsed.body || parsed.description || parsed.content;
    if (title && correction) {
      return { title, correction, kind: normalizeKind(parsed.kind) };
    }
  } catch {
    // Lenient regex fallback
    const titleMatch = text.match(/"title"\s*:\s*"([^"]+)"/);
    const correctionMatch = text.match(/"(?:correction|body|description|content)"\s*:\s*"([^"]+)"/);
    const kindMatch = text.match(/"kind"\s*:\s*"([^"]+)"/);
    if (titleMatch && correctionMatch) {
      return { title: titleMatch[1], correction: correctionMatch[1], kind: normalizeKind(kindMatch?.[1]) };
    }
  }
  return null;
}

/**
 * POST /api/chat
 *
 * Streaming chat endpoint with RAG context injection.
 * Sends sources before streaming LLM response.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation without zod
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: 'messages array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify Turnstile token (bot protection)
    // Uses session cookie to avoid re-verifying on every request
    // Tokens are SINGLE-USE - once verified, we set a session cookie
    const turnstileToken = body.turnstileToken;
    const isProduction = process.env.NODE_ENV === 'production';

    // Debug bypass: if the request supplies a valid debug token (via ?debug= or x-debug-token),
    // skip Turnstile and stream extra diagnostics back as a `data-debug` part. The token must
    // match DEBUG_BYPASS_TOKEN (server env) and that env must be set — there is no implicit
    // "any token works" mode. Used for live API reproduction without browser interaction.
    const debugBypassEnv = process.env.DEBUG_BYPASS_TOKEN;
    const debugTokenFromUrl = new URL(request.url).searchParams.get('debug');
    const debugTokenFromHeader = request.headers.get('x-debug-token');
    const providedDebugToken = debugTokenFromUrl || debugTokenFromHeader || null;
    const isDebug = Boolean(
      debugBypassEnv && providedDebugToken && providedDebugToken === debugBypassEnv
    );
    if (isDebug) console.log('[Chat] Debug bypass active — skipping Turnstile, streaming diagnostics');

    // Check for existing verified session (cookie set after first successful verification)
    const cookies = request.headers.get('cookie') || '';
    const hasVerifiedSession = cookies.includes('turnstile_verified=true');

    // Track if we need to set the session cookie in the response
    let shouldSetVerifiedCookie = false;

    if (isProduction && !isDebug && !hasVerifiedSession && !turnstileToken) {
      // No session and no token - need verification
      console.warn('[Chat] Missing Turnstile token and no verified session');
      return new Response(
        JSON.stringify({
          error: 'Bot verification required',
          message: 'Please refresh the page and try again.',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isDebug && turnstileToken && !hasVerifiedSession) {
      // Fresh token provided and no session yet - verify it
      // Get client IP for additional validation
      const forwarded = request.headers.get('x-forwarded-for');
      const clientIp = forwarded ? forwarded.split(',')[0].trim() : undefined;

      const turnstileResult = await verifyTurnstileToken(turnstileToken, clientIp);
      if (!turnstileResult.success) {
        console.warn('[Chat] Turnstile verification failed:', turnstileResult.error);
        return new Response(
          JSON.stringify({
            error: 'Bot verification failed',
            message: 'Please refresh the page and try again.',
          }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Token verified successfully - mark to set session cookie
      shouldSetVerifiedCookie = true;
      if (isDev) console.log('[Chat] Turnstile token verified, will set session cookie');
    } else if (hasVerifiedSession) {
      if (isDev) console.log('[Chat] Using existing verified session');
    }

    // In free mode, always use OpenRouter regardless of what the client sends.
    // This handles users with stale localStorage (e.g. old 'chutes' selection).
    const provider = process.env.NEXT_PUBLIC_FREE_MODE === 'true'
      ? 'openrouter'
      : (body.provider || 'openrouter');
    const chutesExternalApiKey = body.chutesApiKey || null;
    console.log('Chat request:', {
      provider,
      model: body.model || null,
      messageCount: Array.isArray(body.messages) ? body.messages.length : 0,
      hasExternalChutesKey: Boolean(chutesExternalApiKey),
    });
    if (provider !== 'openrouter' && provider !== 'chutes') {
      return new Response(
        JSON.stringify({ error: 'Unsupported provider' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const apiKey = body.apiKey;
    const priorityDocIds = validatePriorityDocIds(body.priorityDocIds);

    const messages = body.messages;
    const model =
      body.model ||
      (provider === 'chutes'
        ? process.env.CHUTES_DEFAULT_MODEL || ''
        : getDefaultFreeModel() || '~deepseek/deepseek-v4-flash-latest');

    const isFreeMode = process.env.NEXT_PUBLIC_FREE_MODE === 'true';

    if (provider === 'openrouter') {
      // In free mode, use the server-side OPENROUTER_API_KEY; otherwise require client key
      if (!isFreeMode && (!apiKey || typeof apiKey !== 'string')) {
        return new Response(
          JSON.stringify({ error: 'apiKey string required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    if (provider === 'chutes' && (!model || typeof model !== 'string')) {
      return new Response(
        JSON.stringify({ error: 'Chutes model required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find last user message for retrieval
    const lastUserMessage = [...messages].reverse().find((m: Record<string, unknown>) => getMessageRole(m) === 'user');
    if (!lastUserMessage) {
      return new Response(
        JSON.stringify({ error: 'No user message found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rawUserQuery = getMessageContent(lastUserMessage);
    if (!rawUserQuery) {
      return new Response(
        JSON.stringify({ error: 'Empty user message' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if this is a command (use raw query for exact command matching)
    const commandResponse = getCommandResponse(rawUserQuery);

    // Check if this is a direct stats query (keyword shortcut)
    const statsRequested = isStatsQuery(rawUserQuery);

    // Normalize query for RAG retrieval (handles "Q" → "Quilibrium", misspellings, etc.)
    const userQuery = normalizeQuery(rawUserQuery);

    // Per-phase timing: one `[chat] timing ...` line logged at first token (visible in Vercel
    // runtime logs). No user text, only milliseconds. Helps spot which stage regresses in prod.
    const tStart = Date.now();
    const phases: Record<string, number> = {};

    // Stats shortcut: fetch live stats and stream them back, skip RAG entirely
    if (statsRequested) {
      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          const textId = 'stats-response';
          writer.write({ type: 'text-start', id: textId });
          try {
            const snapshot = await computeStats();
            const formatted = formatWebStats(snapshot);
            writer.write({ type: 'text-delta', id: textId, delta: formatted });
          } catch (error) {
            console.error('Stats fetch error:', error);
            writer.write({
              type: 'text-delta',
              id: textId,
              delta: "I couldn't fetch network stats right now. The explorer API may be temporarily unavailable. Try again in a moment.",
            });
          }
          writer.write({ type: 'text-end', id: textId });
        },
      });

      const response = createUIMessageStreamResponse({ stream });
      if (shouldSetVerifiedCookie) {
        response.headers.append('Set-Cookie', buildTurnstileSessionCookie());
      }
      return response;
    }

    if (commandResponse) {
      // Return command response as a streamed message (for consistency with normal responses)
      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          const textId = 'command-response';
          // Must send text-start before text-delta
          writer.write({
            type: 'text-start',
            id: textId,
          });
          // Write the command response as text chunk
          writer.write({
            type: 'text-delta',
            id: textId,
            delta: commandResponse,
          });
          // End the text block
          writer.write({
            type: 'text-end',
            id: textId,
          });
        },
      });
      return createUIMessageStreamResponse({ stream });
    }

    // Auth and setup variables
    let chutesAccessToken: string | null = null;
    let refreshedTokenInfo:
      | { refreshToken?: string; expiresIn?: number }
      | null = null;
    // In free mode with OpenRouter, use server-side key; otherwise use client-provided key
    const openrouterKey = isFreeMode && provider === 'openrouter'
      ? (process.env.OPENROUTER_API_KEY || null)
      : (typeof apiKey === 'string' && apiKey.trim().length > 0 ? apiKey : null);

    // Guard: in free mode the server key must be present
    if (isFreeMode && provider === 'openrouter' && !openrouterKey) {
      console.error('[Free mode] OPENROUTER_API_KEY is not set on the server');
      return new Response(
        JSON.stringify({ error: 'Server configuration error', message: 'Free mode is enabled but the server API key is not configured. Please contact the administrator.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const useChutesEmbeddings = provider === 'chutes';

    // Handle Chutes authentication (must happen before streaming)
    if (provider === 'chutes' || useChutesEmbeddings) {
      // Normal mode priority: external API key > dev bypass > OAuth cookies
      if (chutesExternalApiKey && typeof chutesExternalApiKey === 'string' && chutesExternalApiKey.startsWith('cpk_')) {
        if (isDev) console.log('[Chutes] Using external API key');
        chutesAccessToken = chutesExternalApiKey;
      } else {
        const ensured = await ensureChutesAccessToken();
        chutesAccessToken = ensured.accessToken;
        if (ensured.refreshed) {
          refreshedTokenInfo = {
            refreshToken: ensured.refreshToken,
            expiresIn: ensured.expiresIn,
          };
        }
      }
      if (provider === 'chutes' && !chutesAccessToken) {
        return new Response(
          JSON.stringify({ error: 'Not authenticated with Chutes' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Start balance check in parallel (non-blocking, has 3s timeout)
    // Skip in free mode — the server key is trusted; a failed balance check would
    // incorrectly block all users instead of letting the actual API call fail.
    let balanceCheckPromise: Promise<{ hasCredits: boolean; error?: string }> | null = null;
    if (!isFreeMode) {
      if (provider === 'chutes' && chutesAccessToken) {
        balanceCheckPromise = checkChutesBalance(chutesAccessToken);
      } else if (provider === 'openrouter' && openrouterKey) {
        balanceCheckPromise = validateApiKeyWithCredits(openrouterKey).then((result) => ({
          hasCredits: result.hasCredits,
          error: result.error,
        }));
      }
    }

    // Check balance before starting stream (await in parallel with nothing - quick check)
    if (balanceCheckPromise) {
      try {
        const balanceResult = await balanceCheckPromise;
        if (!balanceResult.hasCredits) {
          const isChutes = provider === 'chutes';
          return new Response(
            JSON.stringify({
              error: 'Insufficient credits',
              code: isFreeMode ? 'free_credits_exhausted' : undefined,
              message: isFreeMode
                ? 'Free credits have been used up. Please connect your own AI provider to continue chatting.'
                : isChutes
                  ? 'Your Chutes account has run out of credits. Please add more credits at chutes.ai to continue chatting.'
                  : 'Your OpenRouter account has run out of credits. Please add more credits at openrouter.ai/settings/billing to continue chatting.',
            }),
            { status: 402, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch {
        // Balance check failed - proceed anyway, the actual API call will fail with proper error
      }
    }

    // Create provider using registry factory
    const providerConfig = getProvider(provider);
    if (!providerConfig) {
      return new Response(JSON.stringify({ error: 'Provider not found' }), { status: 404 });
    }

    const modelProvider = providerConfig.createProvider({
      apiKey: provider === 'openrouter' ? (openrouterKey || undefined) : undefined,
      accessToken: provider === 'chutes' ? chutesAccessToken || undefined : undefined,
    });

    // A tool that cannot possibly run is worse than no tool at all: the model
    // still spends whole turns calling it, and `create_knowledge_issue` has no
    // execute function, so such a turn ends with zero visible text and the user
    // gets an error instead of an answer (measured 5 of 30 runs on ordinary
    // questions, scripts/web-answer-probe.ts). Production has no GITHUB_TOKEN,
    // so createGitHubIssue() could never have filed anything from the web — the
    // stray calls cost users their answer and produced nothing.
    //
    // Declared HERE, above prepareQuery, because the same flag must drive both
    // the tool list AND the system prompt. Describing the tool while not passing
    // it makes the model emit the call as visible text, which the client strips
    // to the end of the message — a silent way to lose the whole answer.
    const issueToolAvailable = Boolean(process.env.GITHUB_TOKEN);

    // Embedding configuration for RAG
    const embeddingProvider = useChutesEmbeddings ? 'chutes' : 'openrouter';
    const embeddingModel =
      body.embeddingModel ||
      (useChutesEmbeddings
        ? process.env.CHUTES_EMBEDDING_MODEL || 'chutes-baai-bge-m3'
        : 'baai/bge-m3');

    // Create UI message stream - RAG retrieval and LLM streaming happen inside
    // Pick a random search message for this request
    const searchMessage = getRandomSearchMessage();

    // Diagnostics collected when isDebug is true. Emitted as `data-debug` events.
    const debugErrors: string[] = [];
    const writeDebug = (payload: Record<string, unknown>, writer: { write: (chunk: { type: `data-${string}`; data: unknown; transient?: boolean }) => void }) => {
      if (!isDebug) return;
      writer.write({ type: 'data-debug' as const, data: payload, transient: true });
    };

    /**
     * Emit a `data-error` SSE part the client can render. Always on (not gated by debug mode),
     * since this is the only way users learn what actually failed when the bot returns nothing.
     * `source` identifies the layer (rag, llm, ui-stream, empty-response) so the client can
     * choose how to style it; `message` is human-readable and free of secrets.
     */
    const writeError = (
      writer: { write: (chunk: { type: `data-${string}`; data: unknown; transient?: boolean }) => void },
      source: 'rag' | 'llm' | 'ui-stream' | 'empty-response' | 'fallback-exhausted',
      message: string
    ) => {
      writer.write({ type: 'data-error' as const, data: { source, message } });
    };

    // Log per-phase timing once, at the first streamed token. Shared by both the OpenRouter
    // and Chutes paths so `first_token` reflects real TTFT regardless of provider.
    let loggedTiming = false;
    const logTiming = () => {
      if (loggedTiming) return;
      loggedTiming = true;
      const parts = Object.entries(phases).map(([k, v]) => `${k}=${v}ms`).join(' ');
      console.log(`[chat] timing ${parts} first_token=${Date.now() - tStart}ms`);
    };

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        // Debug snapshot: env + request shape, before any work
        writeDebug({
          phase: 'request',
          freeMode: isFreeMode,
          provider,
          model,
          messageCount: messages.length,
          rawUserQuery: rawUserQuery.slice(0, 200),
          normalizedQuery: userQuery.slice(0, 200),
          hasOpenRouterKey: Boolean(openrouterKey),
          hasChutesToken: Boolean(chutesAccessToken),
          embeddingProvider,
          embeddingModel,
        }, writer);

        // Step 1: Search knowledge base
        writeStatus(writer, {
          stepId: 'search',
          label: searchMessage,
          status: 'active',
        });

        let chunks: RetrievedChunk[] = [];
        let systemPrompt = 'You are a helpful assistant that answers questions about Quilibrium.';
        // Used only by the tool-only recovery below, which re-asks WITHOUT tools
        // and must not be handed a prompt that describes one.
        let systemPromptNoTool = systemPrompt;
        let ragQuality: 'high' | 'low' | 'none' = 'none';
        let formattedSources: SourceReference[] = [];

        try {
          if (embeddingProvider === 'openrouter' && !openrouterKey) {
            console.warn('Skipping RAG retrieval: OpenRouter API key missing for embeddings.');
          } else {
            const tRag = Date.now();
            const prepared = await prepareQuery({
              query: userQuery,
              conversationHistory: [],
              embeddingProvider: embeddingProvider as 'openrouter' | 'chutes',
              embeddingApiKey: embeddingProvider === 'openrouter' ? openrouterKey || undefined : undefined,
              chutesAccessToken: embeddingProvider === 'chutes' ? chutesAccessToken || undefined : undefined,
              embeddingModel,
              cohereApiKey: process.env.COHERE_API_KEY,
              priorityDocIds,
              issueToolAvailable,
            });
            phases.rag = Date.now() - tRag;

            ({ systemPrompt, systemPromptNoTool, retrievedChunks: chunks, ragQuality, sources: formattedSources } = prepared);
            const maxSim = chunks.length > 0 ? Math.max(...chunks.map(c => c.similarity)).toFixed(3) : '0';
            console.log(
              `RAG retrieval: ${chunks.length} chunks, uiQuality=${ragQuality}, maxSimilarity=${maxSim}, avgSimilarity=${prepared.avgSimilarity.toFixed(3)}, model=${model}, provider=${provider}`
            );
          }

          // Step 1 complete
          writeStatus(writer, {
            stepId: 'search',
            label: searchMessage,
            description: chunks.length > 0 ? `Found ${chunks.length} relevant sources` : 'No sources found',
            status: 'completed',
          });

          writeDebug({
            phase: 'rag-complete',
            ragChunks: chunks.length,
            ragQuality,
            maxSimilarity: chunks.length > 0 ? Math.max(...chunks.map(c => c.similarity)) : 0,
            sourceCount: formattedSources.length,
            systemPromptLength: systemPrompt.length,
          }, writer);
        } catch (ragError) {
          const msg = ragError instanceof Error ? ragError.message : String(ragError);
          console.error('RAG retrieval error:', ragError);
          debugErrors.push(`rag: ${msg}`);
          writeDebug({ phase: 'rag-error', error: msg }, writer);
          writeError(writer, 'rag', `Knowledge retrieval failed: ${msg}`);
          // Mark search as completed even on error (we'll continue without RAG)
          writeStatus(writer, {
            stepId: 'search',
            label: searchMessage,
            description: 'Search completed',
            status: 'completed',
          });
        }

        // All queries go to the LLM — the personality and low-relevance
        // warning in the context block handle both casual interactions and
        // knowledge questions without documentation coverage.

        const llmMessages = messages.map((m: Record<string, unknown>) => ({
          role: getMessageRole(m),
          content: getMessageContent(m),
        }));

        const sources = formattedSources;

        // Chutes provider uses older @ai-sdk/provider versions incompatible with AI SDK v6's
      // toUIMessageStream(). Manually stream text to maintain proper text-start/delta/end protocol.
      if (provider === 'chutes') {
        if (isDev) console.log('[Chutes] Starting stream with model:', model, 'hasToken:', !!chutesAccessToken);
        const textId = `text-${Date.now()}`;
        writer.write({ type: 'text-start', id: textId });

        // Deterministic short-circuit: if this is a correction turn (bot asked for details,
        // user provided them), skip the model entirely — it often outputs garbage when
        // trying to call tools. Handle everything deterministically in code.
        const prevAssistantMsg = [...llmMessages].reverse().find((m: { role: string }) => m.role === 'assistant');
        const isCorrectionTurn = prevAssistantMsg && botAskedForCorrection(prevAssistantMsg.content) && !isVagueCorrection(rawUserQuery);

        if (isCorrectionTurn) {
          writer.write({ type: 'text-delta', id: textId, delta: "Got it, thanks for the correction!" });
          writer.write({ type: 'text-end', id: textId });

          // Find original Q&A for issue context
          const userMsgs = llmMessages.filter((m: { role: string }) => m.role === 'user');
          const assistantMsgs = llmMessages.filter((m: { role: string }) => m.role === 'assistant');
          const origQuestion = userMsgs.length >= 1 ? userMsgs[0].content : rawUserQuery;
          const origAnswer = assistantMsgs.length >= 1 ? assistantMsgs[0].content : '';

          try {
            const issueUrl = await createGitHubIssue({
              title: `Correction: ${rawUserQuery.slice(0, 80)}`,
              correction: rawUserQuery,
              discordUsername: 'Web UI user',
              originalQuestion: origQuestion,
              quilyAnswer: origAnswer,
            });
            console.log(`[auto-issue] Created ${issueUrl} from web UI (deterministic)`);
            writer.write({
              type: 'data-correction-issue' as const,
              data: { url: issueUrl },
            });
          } catch (err) {
            console.error('[auto-issue] Failed to create GitHub issue:', err);
          }
        } else {
        // Normal flow — stream from the model

        let receivedAnyContent = false;
        let hadError = false;
        let fullResponseText = ''; // Collect for follow-up parsing
        const currentModelUrl = model;

        // Capture tool calls from the successful stream attempt
        let capturedToolCalls: Array<{ toolName: string; args: Record<string, string> }> = [];

        // Helper to attempt streaming from a model
        const tryStreamModel = async (modelUrl: string): Promise<{ success: boolean; error?: string }> => {
          let capturedError: string | undefined;
          let localReceivedContent = false;

          try {
            const streamResult = streamText({
              model: modelProvider(modelUrl) as Parameters<typeof streamText>[0]['model'],
              system: systemPrompt,
              messages: llmMessages,
              // Same gate as the OpenRouter branch below. This path had the
              // identical defect — an execute-less tool that can end a turn with
              // no text — and additionally treats a tool-only turn as success
              // (see the return below), so it has no recovery at all.
              ...(issueToolAvailable ? { tools: ragTools } : {}),
              onError: (error) => {
                // Capture error from onError callback (may not throw)
                const errObj = error.error;
                capturedError = errObj instanceof Error ? errObj.message : String(errObj);
                console.error('LLM streaming error:', capturedError);
              },
            });

            let isFirstChunk = true;
            for await (const chunk of streamResult.textStream) {
              if (chunk) {
                logTiming();
                localReceivedContent = true;
                receivedAnyContent = true;
                fullResponseText += chunk;
                // Strip leading whitespace from first chunk to prevent markdown
                // interpreting indentation as code blocks (some models like DeepSeek
                // add heavy leading indentation)
                const processedChunk = isFirstChunk ? chunk.trimStart() : chunk;
                isFirstChunk = false;
                if (processedChunk) {
                  writer.write({ type: 'text-delta', id: textId, delta: processedChunk });
                }
              }
            }

            // Capture tool calls after text stream is consumed
            try {
              const tc = await streamResult.toolCalls;
              if (tc && tc.length > 0) {
                capturedToolCalls = tc.map((t) => ({ toolName: t.toolName, args: ('input' in t ? t.input : {}) as Record<string, string> }));
              }
            } catch {
              // Tool calls may not be available
            }

            // If we got no content but captured an error, return the error
            if (!localReceivedContent && capturedError) {
              return { success: false, error: capturedError };
            }
            // Model may produce only a tool call with no text — that's still a success
            return { success: localReceivedContent || capturedToolCalls.length > 0 };
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Streaming failed';
            return { success: false, error: capturedError || errorMsg };
          }
        };

        // Try primary model first
        const triedModels: string[] = [];
        let lastResult = await tryStreamModel(currentModelUrl);
        triedModels.push(currentModelUrl);

        // If primary failed with model unavailability, try fallback models
        while (!lastResult.success && lastResult.error && isModelUnavailableError(lastResult.error)) {
          const fallbacks = getChutesFallbackModels(model, triedModels);
          if (fallbacks.length === 0) {
            // No more fallbacks available
            hadError = true;
            writeError(writer, 'fallback-exhausted', `All Chutes models tried and unavailable: ${triedModels.join(', ')}`);
            writer.write({
              type: 'text-delta',
              id: textId,
              delta: '**All available models are temporarily unavailable.** The Chutes servers may be overloaded. Please try again later or switch to OpenRouter in [Settings](/settings).',
            });
            break;
          }

          const fallback = fallbacks[0];
          console.log(`[Chutes] Model unavailable, trying fallback: ${fallback.displayName}`);
          // Notify user about fallback
          writer.write({
            type: 'text-delta',
            id: textId,
            delta: `*The selected model is temporarily unavailable. Switching to ${fallback.displayName}...*\n\n`,
          });

          lastResult = await tryStreamModel(fallback.url);
          triedModels.push(fallback.url);

          if (lastResult.success) {
            // Fallback succeeded
            break;
          } else if (lastResult.error && !isModelUnavailableError(lastResult.error)) {
            // Non-503 error, stop trying fallbacks
            break;
          }
          // Otherwise loop continues to try next fallback
        }

        // Handle final failure (non-503 errors or after all fallbacks exhausted)
        // But if this is a correction flow (bot asked for details, user provided them),
        // the model may fail because it tries to call a tool. That's OK — the deterministic
        // path will create the issue, so write a friendly acknowledgment instead of an error.
        if (!lastResult.success && !hadError) {
          const lastAsstMsg = [...llmMessages].reverse().find((m: { role: string }) => m.role === 'assistant');
          const isCorrectionTurn = lastAsstMsg && botAskedForCorrection(lastAsstMsg.content) && !isVagueCorrection(rawUserQuery);

          if (isCorrectionTurn) {
            // Model failed but this is a correction turn — write acknowledgment
            writer.write({
              type: 'text-delta',
              id: textId,
              delta: "Got it, thanks for the correction!",
            });
            // Don't mark as error — let the issue creation logic run below
          } else {
            hadError = true;
            const errorMsg = lastResult.error || 'Unknown error';
            console.error('Chutes streaming error:', errorMsg);
            writeError(writer, 'llm', errorMsg);

            if (isCreditsError(errorMsg)) {
              writer.write({
                type: 'text-delta',
                id: textId,
                delta: '**Your Chutes account has run out of credits.** Please add more credits at [chutes.ai](https://chutes.ai) to continue chatting.',
              });
            } else if (!receivedAnyContent) {
              writer.write({
                type: 'text-delta',
                id: textId,
                delta: '**Unable to get a response.** This may be due to an authentication issue or the model being temporarily unavailable. Please try a different model in [Settings](/settings) or try again in a moment.',
              });
            } else {
              writer.write({ type: 'text-delta', id: textId, delta: `\n\nError: ${errorMsg}` });
            }
          }
        }

        // If model produced a tool call (structured or text-based) but no visible text,
        // inject a fallback acknowledgment so the user doesn't see an empty bubble.
        // This mirrors what the Discord handler does with its "Thanks for the correction!" fallback.
        const hasToolCall = !hadError && (
          capturedToolCalls.some((tc) => tc.toolName === 'create_knowledge_issue') ||
          fullResponseText.includes('create_knowledge_issue')
        );
        if (hasToolCall) {
          const visibleText = fullResponseText.replace(TOOL_CALL_TEXT_REGEX, '').trim();
          if (!visibleText) {
            writer.write({
              type: 'text-delta',
              id: textId,
              delta: "Thanks for letting me know! Let me look into that and file it for review.",
            });
          }
        }

        writer.write({ type: 'text-end', id: textId });

        // Only write sources and follow-ups if we got actual content (not on error/empty response)
        if (!hadError) {
          // Send RAG quality for confidence indicator
          writer.write({
            type: 'data-rag-quality' as const,
            data: { quality: ragQuality },
          });

          for (const source of sources) {
            // Encode metadata into title for client display
            // Format: "Title|doc_type|published_date" (pipe-separated for parsing)
            const titleWithMeta = [
              source.title || source.heading || source.file,
              source.doc_type || '',
              source.published_date || '',
            ].join('|');
            writer.write({
              type: 'source-url',
              sourceId: `source-${source.index}-${source.id}`,
              url: source.url ?? '',
              title: titleWithMeta,
            });
          }

          // Parse and send follow-up questions
          const { questions } = parseFollowUpQuestions(fullResponseText);
          if (questions && questions.length > 0) {
            writer.write({
              type: 'data-follow-up' as const,
              data: questions,
            });
          }

          // Handle correction issue creation — two approaches:
          // 1. Model-based: model called the tool (structured or as text)
          // 2. Deterministic: bot previously asked for correction details, user provided them
          // Both skip if user message is vague ("wrong", "nope", etc.)
          const lastAssistantMsg = [...llmMessages].reverse().find((m) => m.role === 'assistant');
          const lastUserMsg = [...llmMessages].reverse().find((m) => m.role === 'user');

          // Try model-based tool call first
          const issueCall = capturedToolCalls.find((tc) => tc.toolName === 'create_knowledge_issue');
          const issueCallKind: 'knowledge' | 'behavior' | undefined =
            issueCall?.args?.kind === 'behavior' || issueCall?.args?.kind === 'knowledge'
              ? issueCall.args.kind
              : undefined;
          let issueArgs: { title: string; correction: string; kind?: 'knowledge' | 'behavior' } | null =
            issueCall?.args?.title && issueCall?.args?.correction
              ? { title: issueCall.args.title, correction: issueCall.args.correction, kind: issueCallKind }
              : parseToolCallFromText(fullResponseText);

          // Deterministic fallback: if bot asked for correction and user provided details
          // Track the original question and wrong answer for the issue body
          let issueOriginalQuestion = '';
          let issueQuilyAnswer = '';

          if (!issueArgs && lastAssistantMsg && botAskedForCorrection(lastAssistantMsg.content)) {
            if (!isVagueCorrection(rawUserQuery)) {
              // Walk back conversation to find original Q&A (before the correction flow)
              const userMsgs = llmMessages.filter((m: { role: string }) => m.role === 'user');
              const assistantMsgs = llmMessages.filter((m: { role: string }) => m.role === 'assistant');
              // Original question is the first user message
              issueOriginalQuestion = userMsgs.length >= 1 ? userMsgs[0].content : rawUserQuery;
              // Original wrong answer is the first assistant message (before "tell me more")
              issueQuilyAnswer = assistantMsgs.length >= 1 ? assistantMsgs[0].content : '';
              issueArgs = {
                title: `Correction: ${rawUserQuery.slice(0, 80)}`,
                correction: rawUserQuery,
              };
            }
          }

          if (issueArgs && !isVagueCorrection(rawUserQuery)) {
            try {
              const issueUrl = await createGitHubIssue({
                title: issueArgs.title,
                correction: issueArgs.correction,
                discordUsername: 'Web UI user',
                originalQuestion: issueOriginalQuestion || lastUserMsg?.content || userQuery,
                quilyAnswer: issueQuilyAnswer || lastAssistantMsg?.content || '',
                kind: issueArgs.kind,
              });
              console.log(`[auto-issue] Created ${issueUrl} from web UI`);
              writer.write({
                type: 'data-correction-issue' as const,
                data: { url: issueUrl },
              });
            } catch (err) {
              console.error('[auto-issue] Failed to create GitHub issue from web UI:', err);
            }
          }
        }
        } // end normal (non-correction) flow
      } else {
        // OpenRouter and other providers: use standard toUIMessageStream()
        // Provider routing for latency: OpenRouter's default load-balancing can land on a slow
        // provider (measured TTFT p50 ~4.4s, worst run ~11s). `sort: 'latency'` cuts p50 to ~1.5s
        // and removes the slow tail. The quantization allowlist excludes fp4 (DeepInfra/AtlasCloud
        // serve deepseek-v4-flash at fp4 = degraded quality) so the latency sort can't trade
        // quality for speed. Toggle: OPENROUTER_SORT="" disables the sort via env.
        const providerSort = process.env.OPENROUTER_SORT ?? 'latency';
        // Tail-latency cap (seconds, per-percentile): `sort:'latency'` orders by MEDIAN and
        // does NOT protect against a provider that accepts then stalls (OpenRouter only
        // deprioritizes providers that ERROR in the last 30s, not slow ones). Kaya measured
        // SiliconFlow TTFT up to 222s when pinned, so a p90 cap is pure upside. Toggle:
        // OPENROUTER_MAX_LATENCY_P90="" disables it; a number overrides the 4s default.
        const maxLatencyEnv = process.env.OPENROUTER_MAX_LATENCY_P90 ?? '4';
        const maxLatencyP90 = maxLatencyEnv.trim() === '' ? undefined : Number(maxLatencyEnv);
        // Chronic-trap providers to exclude outright (belt-and-suspenders over the p90 cap).
        // Empty by default — the trap set must be RE-MEASURED for Quily's ZDR/quant filters
        // (its allowlist includes int8, unlike Kaya's) before pinning a name here.
        // Set e.g. OPENROUTER_IGNORE="siliconflow" once measured.
        const ignoreProviders = (process.env.OPENROUTER_IGNORE ?? '')
          .split(',').map((s) => s.trim()).filter(Boolean);
        // Build OpenRouter routing (latency sort + quantization allowlist + tail cap + ignore)
        // and merge the env-driven ZDR flag on top. `withZdr` adds `zdr: true` when
        // OPENROUTER_ZDR=true, else returns the base unchanged.
        const openrouterRouting =
          provider === 'openrouter'
            ? withZdr(
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
              )
            : undefined;
        // Reasoning toggle. deepseek-v4-flash emits `delta.reasoning` before `delta.content`,
        // so with reasoning ON the user stares at a blank screen for the whole reasoning phase
        // (measured 3-4s of that gap in the A/B, see .agents/reports/*-reasoning-ab.md). Quily is
        // a facts-from-RAG bot, not a math/code bot, so reasoning adds little precision here.
        // Default OFF once the A/B confirmed no quality loss; OPENROUTER_REASONING="on"|"true"
        // re-enables it. Passed as a raw setting because the SDK type requires max_tokens/effort
        // even for the pure-disable case, which the OpenRouter API does not.
        const modelSettings: Record<string, unknown> = {};
        if (openrouterRouting) modelSettings.provider = openrouterRouting;
        Object.assign(modelSettings, reasoningSettings());
        const openrouterModel = Object.keys(modelSettings).length > 0
          ? (modelProvider as ReturnType<typeof createOpenRouter>)(
              model,
              modelSettings as Parameters<ReturnType<typeof createOpenRouter>>[1]
            )
          : modelProvider(model);
        const streamModel = openrouterModel as Parameters<typeof streamText>[0]['model'];

        /**
         * Recovery for a turn that produced only a tool call.
         *
         * Re-asks WITHOUT tools, which is the only configuration measured at zero
         * dead runs (scripts/web-answer-probe.ts, 2026-09-11: as-shipped 5/30 with
         * no answer, no-tools 0/30). Writes the text parts by hand rather than
         * merging a second UI stream, because the outer stream is already closing
         * by the time onFinish runs — same manual protocol the Chutes branch uses.
         *
         * DORMANT IN PRODUCTION TODAY. It can only fire when a tool call happened,
         * which now requires GITHUB_TOKEN, which production does not set. The
         * recovery measurements above were necessarily taken with that token
         * present. In prod the gate alone is what fixes the defect; this is here
         * for the deploy that adds the token, and for the Discord-shaped configs
         * that do set it. Do not read a green prod as evidence this path works.
         *
         * Returns the recovered text, or '' if recovery itself failed.
         */
        // Recovery-stream errors, kept out of `debugErrors` so they cannot
        // suppress the empty-response gate. Surfaced in the debug payload.
        const retryErrors: string[] = [];
        const retryWithoutTools = async (): Promise<string> => {
          // onFinish fires on client disconnect too (the SDK calls it from the
          // stream's cancel() as well as its flush()), so without this check a
          // disconnect would start a whole second generation that nobody
          // receives and that still gets billed.
          if (request.signal.aborted) return '';
          try {
            const retry = streamText({
              model: streamModel,
              // NOT `systemPrompt`. Recovery only runs when the tool WAS offered,
              // so systemPrompt describes a tool we are deliberately not passing
              // here — the one configuration that makes the model write the call
              // as visible prose, which the client then strips to the end of the
              // message. Using it would let the retry erase the answer it exists
              // to rescue.
              system: systemPromptNoTool,
              messages: llmMessages,
              abortSignal: request.signal,
              // textStream silently DROPS error parts rather than throwing, and
              // streamText's default onError only console.errors. Without this
              // handler a 429 or a dropped stream during recovery would end the
              // for-await quietly, return '', and leave no trace anywhere.
              //
              // Collected SEPARATELY from debugErrors on purpose. The empty
              // response gate below is guarded on `debugErrors.length === 0`
              // (meaning "no error has been shown to the user yet"), so pushing a
              // recovery failure into that same array suppressed the gate: the
              // retry produced no text AND no error was written, leaving total
              // silence — the exact failure this recovery exists to prevent.
              onError: (error) => {
                const msg = error.error instanceof Error ? error.error.message : String(error.error);
                console.error('[tool-only-retry] Recovery stream error:', msg);
                retryErrors.push(`tool-only-retry: ${msg}`);
              },
            });
            // BUFFERED, not streamed through. The writer has no take-back, so
            // anything written before the leak check below has already reached
            // the client and cannot be discarded — "discard" would then only mean
            // "don't count it", while the bytes still rendered. This is a rescue
            // path that runs after a turn already failed, so correctness beats
            // the few hundred milliseconds of streaming it costs.
            let out = '';
            for await (const chunk of retry.textStream) {
              if (chunk) out += chunk;
            }

            // Belt and braces on top of using the no-tool prompt. If the model
            // still leaked a tool call into prose, the client deletes from there
            // to the end of the message, so treating this as a success would
            // suppress the error AND show nothing.
            if (leaksToolCallText(out)) {
              console.error('[tool-only-retry] Recovery leaked a tool call into text — discarding');
              return '';
            }
            // Whitespace is not an answer. Returning it would be truthy at the
            // caller and suppress the empty-response error, which is the same
            // raw-truthiness mistake this file already fixed for the primary
            // reply — one layer down.
            if (!visibleAnswerText(out)) {
              console.error('[tool-only-retry] Recovery produced no visible text — discarding');
              return '';
            }

            const id = `text-retry-${Date.now()}`;
            writer.write({ type: 'text-start', id });
            writer.write({ type: 'text-delta', id, delta: out });
            writer.write({ type: 'text-end', id });
            return out;
          } catch (e) {
            console.error('[tool-only-retry] Recovery failed:', e);
            return '';
          }
        };

        const result = streamText({
          model: streamModel,
          system: systemPrompt,
          messages: llmMessages,
          abortSignal: request.signal,
          ...(issueToolAvailable ? { tools: ragTools } : {}),
          onChunk: () => logTiming(),
          onError: (error) => {
            const msg = error.error instanceof Error ? error.error.message : String(error.error);
            console.error('LLM streaming error:', msg);
            debugErrors.push(`llm: ${msg}`);
            writeError(writer, 'llm', msg);
          },
        });

        writer.merge(result.toUIMessageStream({
          onError: (error: unknown) => {
            const msg = error instanceof Error ? error.message : 'An error occurred while streaming the response.';
            console.error('UI message stream error:', error);
            debugErrors.push(`ui-stream: ${msg}`);
            writeError(writer, 'ui-stream', msg);
            return msg;
          },
          onFinish: async () => {
            // Declared out here so the follow-up parsing below can fall back to it.
            let recovered = '';
            // Debug snapshot after streaming completes
            try {
              const text = await result.text;
              const tools = await result.toolCalls;

              // The model can end a turn on a tool call with no usable text.
              // Measured against live prod 2026-09-11: 17% of runs on ordinary
              // questions, including "What is Quilibrium?". Recover before saying
              // anything went wrong — the user asked a question and is entitled to
              // an answer, not an explanation.
              //
              // The threshold is not just `=== 0`: a local run produced a 2-char
              // reply alongside the tool call, which reaches the user as an
              // answer-shaped nothing.
              //
              // INFERRED, not measured: what is believed to keep this off the
              // persona's deliberate one-word deflections (see personality.ts,
              // "when the honest answer is silence, send a single word") is the
              // tool-call conjunct, NOT the number — a terse reply with no tool
              // call is never touched. A deflection that coincides with a
              // `kind: "behavior"` filing would still be overwritten.
              //
              // Measure what the USER SEES, not the raw stream. The client strips
              // the follow-up JSON block and everything from a leaked tool call
              // onward before rendering (see MessageBubble), so a reply that is
              // only the follow-up block, or only whitespace, has hundreds of raw
              // characters and renders as an empty bubble. Testing raw length let
              // both cases through with no answer and no error at all.
              const visibleText = visibleAnswerText(text);
              const attemptedRecovery =
                visibleText.length < MIN_USABLE_ANSWER_CHARS
                && debugErrors.length === 0
                && (tools?.length ?? 0) > 0;
              if (attemptedRecovery) {
                console.warn('[tool-only-retry] Turn produced only a tool call — re-asking without tools');
                recovered = await retryWithoutTools();
              }

              // Only now, with recovery exhausted, is this genuinely an empty
              // response. The old copy blamed provider rate-limiting for every
              // empty turn, which was wrong in the common case and sent users to
              // switch model in Settings over a prompt bug.
              //
              // Keyed on `visibleText`, the same measure the recovery uses, so
              // the two halves cannot disagree about what counts as empty. This
              // also covers the cases recovery never sees: a whitespace-only or
              // follow-up-JSON-only reply with NO tool call now produces an
              // error instead of a silent empty bubble.
              //
              // `attemptedRecovery` stays in the condition so a short reply whose
              // recovery FAILED still surfaces an error rather than leaving the
              // user with an answer-shaped nothing and no explanation.
              //
              // `debugErrors` here means "an error has already been shown to the
              // user", which is why recovery-stream failures go to `retryErrors`
              // instead. Mixing them let a failed recovery suppress this branch
              // and produce total silence.
              // `visibleAnswerText(recovered)`, NOT `!recovered`. Raw truthiness
              // let a whitespace-only recovery ("   ") count as a success and
              // suppress this branch, producing exactly the silence the recovery
              // exists to prevent. Judge the recovery by the same measure as the
              // primary reply: what the user would actually see.
              const recoveredVisible = visibleAnswerText(recovered);
              if ((visibleText.length === 0 || attemptedRecovery) && !recoveredVisible && debugErrors.length === 0) {
                writeError(
                  writer,
                  'empty-response',
                  'The model returned no content. Try asking again — if it keeps happening, the upstream provider may be rate-limiting or dropping the stream, and you can switch model in Settings.'
                );
              }

              writeDebug({
                phase: 'stream-finished',
                outputLength: text.length,
                outputPreview: text.slice(0, 300),
                toolCallNames: (tools || []).map((t) => t.toolName),
                toolOnlyRecoveredChars: recovered.length,
                issueToolOffered: issueToolAvailable,
                hasToolCallTextLeak: leaksToolCallText(text),
                errors: debugErrors,
                retryErrors,
              }, writer);
            } catch (e) {
              writeDebug({ phase: 'stream-finished', error: String(e), errors: debugErrors }, writer);
            }

            // Send RAG quality for confidence indicator
            writer.write({
              type: 'data-rag-quality' as const,
              data: { quality: ragQuality },
            });

            for (const source of sources) {
              // Encode metadata into title for client display
              // Format: "Title|doc_type|published_date" (pipe-separated for parsing)
              const titleWithMeta = [
                source.title || source.heading || source.file,
                source.doc_type || '',
                source.published_date || '',
              ].join('|');
              writer.write({
                type: 'source-url',
                sourceId: `source-${source.index}-${source.id}`,
                url: source.url ?? '',
                title: titleWithMeta,
              });
            }

            // Parse and send follow-up questions. Prefers the recovered text so a
            // rescued turn still gets follow-up chips. `||` was wrong here: two of
            // three measured recoveries had 2 chars of original text, which is
            // truthy, so the chips were parsed from "Ok" and silently lost.
            try {
              const baseText = await result.text;
              const fullText = recovered.length > baseText.length ? recovered : baseText;
              const { questions } = parseFollowUpQuestions(fullText);
              if (questions && questions.length > 0) {
                writer.write({
                  type: 'data-follow-up' as const,
                  data: questions,
                });
              }
            } catch (e) {
              console.warn('[FollowUp] Failed to get full text for parsing:', e);
            }

            // Handle correction issue creation (same dual approach as Chutes path)
            try {
              const lastAssistantMsg = [...llmMessages].reverse().find((m) => m.role === 'assistant');
              const lastUserMsg = [...llmMessages].reverse().find((m) => m.role === 'user');

              const toolCalls = await result.toolCalls;
              const issueCall = toolCalls?.find((tc) => tc.toolName === 'create_knowledge_issue');
              const issueInput = issueCall && 'input' in issueCall ? issueCall.input as { title?: string; correction?: string; kind?: 'knowledge' | 'behavior' } : null;
              const fullText = await result.text;
              let issueArgs: { title: string; correction: string; kind?: 'knowledge' | 'behavior' } | null =
                issueInput?.title && issueInput?.correction
                  ? { title: issueInput.title, correction: issueInput.correction, kind: issueInput.kind }
                  : parseToolCallFromText(fullText);

              // Deterministic fallback
              let issueOriginalQuestion = '';
              let issueQuilyAnswer = '';
              if (!issueArgs && lastAssistantMsg && botAskedForCorrection(lastAssistantMsg.content)) {
                if (!isVagueCorrection(rawUserQuery)) {
                  const userMsgs = llmMessages.filter((m: { role: string }) => m.role === 'user');
                  const assistantMsgs = llmMessages.filter((m: { role: string }) => m.role === 'assistant');
                  issueOriginalQuestion = userMsgs.length >= 1 ? userMsgs[0].content : rawUserQuery;
                  issueQuilyAnswer = assistantMsgs.length >= 1 ? assistantMsgs[0].content : '';
                  issueArgs = {
                    title: `Correction: ${rawUserQuery.slice(0, 80)}`,
                    correction: rawUserQuery,
                  };
                }
              }

              if (issueArgs && !isVagueCorrection(rawUserQuery)) {
                const issueUrl = await createGitHubIssue({
                  title: issueArgs.title,
                  correction: issueArgs.correction,
                  discordUsername: 'Web UI user',
                  originalQuestion: issueOriginalQuestion || lastUserMsg?.content || userQuery,
                  quilyAnswer: issueQuilyAnswer || lastAssistantMsg?.content || '',
                  kind: issueArgs.kind,
                });
                console.log(`[auto-issue] Created ${issueUrl} from web UI`);
                writer.write({
                  type: 'data-correction-issue' as const,
                  data: { url: issueUrl },
                });
              }
            } catch (err) {
              console.error('[auto-issue] Failed to handle tool calls from web UI:', err);
            }
          },
        }));
      }
    },
    onError: (error) => {
      console.error('createUIMessageStream error:', error);
      return error instanceof Error ? error.message : 'An error occurred.';
    },
  });

    const response = createUIMessageStreamResponse({ stream });

    // Set Turnstile verified session cookie (browser session duration - no maxAge)
    // This allows subsequent requests to skip token verification
    if (shouldSetVerifiedCookie) {
      response.headers.append(
        'Set-Cookie',
        buildTurnstileSessionCookie()
      );
    }

    // If we refreshed Chutes token, update cookies on response
    if (provider === 'chutes' && refreshedTokenInfo?.expiresIn && chutesAccessToken) {
      response.headers.append(
        'Set-Cookie',
        buildSetCookieHeader(COOKIE_ACCESS_TOKEN, chutesAccessToken, refreshedTokenInfo.expiresIn)
      );
      if (refreshedTokenInfo.refreshToken) {
        response.headers.append(
          'Set-Cookie',
          buildSetCookieHeader(COOKIE_REFRESH_TOKEN, refreshedTokenInfo.refreshToken, 60 * 60 * 24 * 30)
        );
      }
    }

    return response;
  } catch (error) {
    console.error('Chat API error:', error);

    // Check for insufficient credits error (402) - works for both OpenRouter and Chutes
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isInsufficientCredits =
      errorMessage.includes('402') ||
      errorMessage.toLowerCase().includes('insufficient') ||
      errorMessage.toLowerCase().includes('credit') ||
      errorMessage.toLowerCase().includes('balance') ||
      errorMessage.toLowerCase().includes('payment required');

    const isChutesUnauthorized =
      errorMessage.toLowerCase().includes('unauthorized') ||
      errorMessage.toLowerCase().includes('invalid token') ||
      errorMessage.includes('401');

    if (isInsufficientCredits) {
      // Detect provider from error message context
      const isChutesError =
        errorMessage.toLowerCase().includes('chutes') ||
        errorMessage.includes('api.chutes.ai');
      const isFreeModeCatch = process.env.NEXT_PUBLIC_FREE_MODE === 'true';
      return new Response(
        JSON.stringify({
          error: 'Insufficient credits',
          code: isFreeModeCatch ? 'free_credits_exhausted' : undefined,
          message: isFreeModeCatch
            ? 'Free credits have been used up. Please connect your own AI provider to continue chatting.'
            : isChutesError
              ? 'Your Chutes account has run out of credits. Please add more credits at chutes.ai to continue chatting.'
              : 'Your OpenRouter account has run out of credits. Please add more credits at openrouter.ai/settings/billing to continue chatting.',
        }),
        {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (isChutesUnauthorized) {
      return new Response(
        JSON.stringify({
          error: 'Not authenticated with Chutes',
          message: 'Your Chutes session expired. Please sign in again.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: errorMessage,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
