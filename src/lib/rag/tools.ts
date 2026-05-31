import { tool, zodSchema } from 'ai';
import { z } from 'zod';

/**
 * Tools available to the RAG LLM during response generation.
 * These are NOT auto-executed — the caller inspects toolCalls and acts on them.
 */
export const ragTools = {
  create_knowledge_issue: tool({
    description:
      'Report a factual error in the Quilibrium knowledge base (docs, transcripts, announcements). ' +
      'ONLY call when the user (a) gives a specific factual correction, (b) says a prior answer is wrong about a Quilibrium topic (even without the correct value — flag as needs-research), or (c) explicitly asks to open an issue about a knowledge topic. ' +
      'NEVER call for: bot-meta feedback (prompt, persona, style, behavior), clarification questions, or generic disagreement. When in doubt, do NOT call.',
    inputSchema: zodSchema(
      z.object({
        title: z
          .string()
          .describe('Short issue title summarizing the knowledge correction, e.g. "Node version outdated: should be v2.1.0.22"'),
        correction: z
          .string()
          .describe('What is factually wrong and what the correct Quilibrium information should be'),
      }),
    ),
    // No execute function — handled manually in the Discord mention handler
  }),
};
