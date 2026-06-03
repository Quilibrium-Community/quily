/**
 * Direct in-process adapter — bypasses the Next.js dev server.
 *
 * The HTTP eval path (`runner.ts` sendChatRequest) requires `yarn dev` to be
 * running, which is expensive: Turbopack + Tailwind dev-mode resolution
 * burns ~1.5GB RAM and the noisy stderr flood from a pre-existing Tailwind
 * resolution bug in this repo has crashed the dev server (and the machine)
 * during multi-model benchmark runs.
 *
 * This adapter replicates the chat route's core path:
 *   1. prepareQuery() — RAG retrieval + system prompt build
 *   2. generateText() — non-streaming LLM call (eval doesn't need deltas)
 *
 * What it intentionally does NOT replicate (not relevant to benchmarking):
 *   - Turnstile bot verification
 *   - Free-mode auth gating, Chutes OAuth/fallback chain
 *   - Streaming protocol (text-start/delta/end frames)
 *   - GitHub issue creation from tool calls
 *   - data-status / data-debug / data-error stream parts
 *
 * Memory footprint: ~200MB (tsx + node + supabase-js + openrouter-sdk)
 * vs ~1.5GB for `yarn dev`. No recompile loops, no port to manage.
 */

import { generateText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { prepareQuery } from '../../src/lib/rag/service.js';
import { ragTools } from '../../src/lib/rag/tools.js';
import type { ParsedResponse, SourceEntry } from './types.js';

/**
 * Mirror of `COMMAND_RESPONSES` in app/api/chat/route.ts.
 *
 * Slash commands bypass the LLM entirely in the production route — we must
 * mirror them here, otherwise benchmark tests like `command-help` get the
 * model's improvised answer instead of the canned text, scoring 0 on
 * `must_contain_command_response` checks.
 *
 * Keep this short — only the responses tested by the eval suite need to be
 * exact. If the chat route's command list grows, sync here on benchmark days.
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

export interface DirectAdapterConfig {
  /** OpenRouter API key for both embeddings (RAG) and LLM calls */
  apiKey: string;
  /** Model ID to test, e.g. "deepseek/deepseek-v3.2" */
  model: string;
  /** Optional override for embedding model (defaults to baai/bge-m3) */
  embeddingModel?: string;
  /** Per-test timeout in ms (applied to LLM call only; RAG has its own internal timeout) */
  timeoutMs: number;
}

/**
 * Run a single chat exchange in-process.
 *
 * Mirrors the shape of `sendChatRequest` in runner.ts so the rest of the
 * eval pipeline (criterion evaluation, judgment file generation, reporting)
 * does not need to change.
 */
export async function sendChatRequestDirect(
  messages: { role: string; content: string }[],
  config: DirectAdapterConfig
): Promise<ParsedResponse> {
  const t0 = Date.now();

  // Find the last user message — that's the query the chat route uses for RAG.
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser || !lastUser.content) {
    return {
      text: '',
      sources: [],
      followUpQuestions: [],
      statusMessages: [],
      latencyMs: 0,
      error: 'No user message in input',
    };
  }

  // Command shortcut — must run BEFORE RAG/LLM, same as the chat route.
  const cmd = COMMAND_RESPONSES[lastUser.content.trim().toLowerCase()];
  if (cmd) {
    return {
      text: cmd,
      sources: [],
      followUpQuestions: [],
      statusMessages: [],
      latencyMs: Date.now() - t0,
    };
  }

  try {
    // Step 1: RAG retrieval + system prompt build.
    const prepared = await prepareQuery({
      query: lastUser.content,
      conversationHistory: [],
      embeddingProvider: 'openrouter',
      embeddingApiKey: config.apiKey,
      embeddingModel: config.embeddingModel || 'baai/bge-m3',
      cohereApiKey: process.env.COHERE_API_KEY,
    });

    // Step 2: LLM call. Same provider + tools wiring as the chat route's
    // OpenRouter branch, but generateText (non-streaming) — we only need
    // the final text to evaluate criteria.
    const openrouter = createOpenRouter({ apiKey: config.apiKey });

    const llmMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    }));

    const result = await Promise.race([
      generateText({
        model: openrouter(config.model) as Parameters<typeof generateText>[0]['model'],
        system: prepared.systemPrompt,
        messages: llmMessages,
        tools: ragTools,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${config.timeoutMs}ms`)), config.timeoutMs)
      ),
    ]);

    const sources: SourceEntry[] = prepared.sources.map((s) => ({
      sourceId: `source-${s.index}-${s.id}`,
      url: s.url ?? '',
      title: s.title || s.heading || s.file || '',
    }));

    return {
      text: result.text,
      sources,
      followUpQuestions: [], // Parsed by evaluateCriterion if needed via must_have_follow_ups
      statusMessages: [],
      latencyMs: Date.now() - t0,
    };
  } catch (err) {
    return {
      text: '',
      sources: [],
      followUpQuestions: [],
      statusMessages: [],
      latencyMs: Date.now() - t0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
