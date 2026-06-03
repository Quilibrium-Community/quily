import { tool, zodSchema } from 'ai';
import { z } from 'zod';

/**
 * Tools available to the RAG LLM during response generation.
 * These are NOT auto-executed — the caller inspects toolCalls and acts on them.
 */
export const ragTools = {
  create_knowledge_issue: tool({
    description:
      'Open a GitHub issue for the maintainers. Two kinds are supported via the `kind` field: ' +
      '"knowledge" (default) for factual errors about Quilibrium subject matter (protocol, products, commands, doc content); ' +
      '"behavior" for a specific, reproducible Quily misbehavior (wrong refusal, false disclaimer, broken instruction-following) that the user explicitly wants tracked. ' +
      'Call ONLY when the user (a) gives a specific factual correction, (b) says a prior answer is wrong about Quilibrium (use "knowledge"), (c) explicitly asks to file an issue about a knowledge topic, OR (d) reports a specific reproducible bot misbehavior AND explicitly asks for it to be tracked (use "behavior"). ' +
      'NEVER call for: vague meta-instructions about the prompt/persona/style, clarification questions, generic disagreement, or "you should be friendlier"-style commentary without a concrete misbehavior example. When in doubt, do NOT call.',
    inputSchema: zodSchema(
      z.object({
        title: z
          .string()
          .describe('Short issue title. For knowledge: "Node version outdated: should be v2.1.0.22". For behavior: "Bot disclaims URLs that aren\'t in the message".'),
        correction: z
          .string()
          .describe('For "knowledge": what is factually wrong and what the correct Quilibrium info should be. For "behavior": describe the misbehavior, include the exact user message that triggered it and what the bot should have done instead.'),
        kind: z
          .enum(['knowledge', 'behavior'])
          .optional()
          .describe('Type of issue. Default "knowledge". Use "behavior" only for reproducible bot misbehavior with a concrete example.'),
      }),
    ),
    // No execute function — handled manually in the Discord mention handler
  }),
};
