import { tool, zodSchema } from 'ai';
import { z } from 'zod';

/**
 * Tools available to the RAG LLM during response generation.
 * These are NOT auto-executed — the caller inspects toolCalls and acts on them.
 */
export const ragTools = {
  create_knowledge_issue: tool({
    description:
      'Open a GitHub issue so maintainers can fix or extend the knowledge base. Users rarely say "open an issue" — infer intent from what they say. Two kinds via the `kind` field. ' +
      'Use "knowledge" (default) when EITHER: (a) the user says or implies a prior answer about Quilibrium subject matter (protocol, products, commands, doc content) is wrong, outdated, or incomplete — file even if they do NOT supply the correct value (use a placeholder correction body); OR (b) the user says something SHOULD ALWAYS be stated about a Quilibrium topic that the docs do not cover (a forward-looking knowledge gap, e.g. "always warn about the security implications of X") — file even if the details are still coming. ' +
      'Use "behavior" for a specific, reproducible Quily misbehavior (wrong refusal, false disclaimer, broken instruction-following) where the user points to a concrete instance. ' +
      'DO NOT call for: a plain question you can just answer, greeting/joke/banter, generic disagreement with no factual claim, or complaints about your tone/persona/general style. ' +
      'If the message is a correction or a knowledge gap about a real Quilibrium topic, FILE IT — a missing value still files a placeholder. When torn between "correction" and "just a question", lean toward filing.',
    inputSchema: zodSchema(
      z.object({
        title: z
          .string()
          .describe('Short issue title. For knowledge: "Node version outdated: should be v2.1.0.22". For behavior: "Bot disclaims URLs that aren\'t in the message".'),
        correction: z
          .string()
          .describe('For "knowledge": what is wrong and the correct Quilibrium info, OR the knowledge gap the user wants covered. If the user has not supplied the value yet, write a placeholder like "User reports the above is wrong / should be covered; details to follow — needs maintainer research." Never leave empty. For "behavior": describe the misbehavior, the exact user message that triggered it, and what the bot should have done instead.'),
        kind: z
          .enum(['knowledge', 'behavior'])
          .optional()
          .describe('Type of issue. Default "knowledge" — for factual corrections AND forward-looking knowledge gaps about Quilibrium topics. Use "behavior" only for a reproducible bot misbehavior with a concrete example.'),
      }),
    ),
    // No execute function — handled manually in the Discord mention handler
  }),
};
