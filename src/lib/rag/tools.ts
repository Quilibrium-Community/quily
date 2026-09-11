import { tool, zodSchema } from 'ai';
import { z } from 'zod';

/**
 * Tools available to the RAG LLM during response generation.
 * These are NOT auto-executed — the caller inspects toolCalls and acts on them.
 *
 * service.ts skips its empty-reply retry when ANY tool call is present, while
 * the Discord handler's "Thanks for the correction!" branch keys on this one
 * tool by name. Both hold together only while this is the sole tool; adding a
 * second one means revisiting both sites.
 */
export const ragTools = {
  create_knowledge_issue: tool({
    description:
      'Open a GitHub issue so maintainers can fix or extend the knowledge base. Users rarely say "open an issue" — infer intent from what they say. Two kinds via the `kind` field. ' +
      'Use "knowledge" (default) when EITHER: (a) the user says or implies a prior answer about Quilibrium subject matter (protocol, products, commands, doc content) is wrong, outdated, or incomplete — file even if they do NOT supply the correct value (use a placeholder correction body); OR (b) the user says something SHOULD ALWAYS be stated about a Quilibrium topic that the docs do not cover (a forward-looking knowledge gap, e.g. "always warn about the security implications of X") — file even if the details are still coming. ' +
      'Use "behavior" for a specific, reproducible Quily misbehavior (wrong refusal, false disclaimer, broken instruction-following) where the user points to a concrete instance. ' +
      'NEVER call for a question, a how-to, a request for a tutorial, guide, explanation, comparison, wording or recommendation, or a greeting/joke/banter, generic disagreement with no factual claim, or complaints about your tone/persona/general style. A question is not a knowledge gap even when the docs do not fully answer it: answer what you can and say what is not documented. ' +
      'A message qualifies only if the user ASSERTS that a prior answer or the docs are wrong, outdated or missing something, or explicitly asks you to log/report/file/track a problem. If it does, FILE IT — a missing value still files a placeholder. ' +
      // Both clauses below are load-bearing and were added after measurement.
      // A run of this tool on plain questions produced, verbatim:
      //   {"title":"Demo: knowledge gap placeholder",
      //    "correction":"Placeholder — no issue here, just tool demonstration."}
      // The model was not misreading the user; it was exercising an available
      // tool for its own sake. Naming that failure explicitly is what stops it.
      'NEVER call this tool to demonstrate, test or exercise it, and never file a placeholder that says there is no real issue — if you would have to write "demo" or "no issue here", do not call it at all. ' +
      // Deliberately phrased as an instruction without the web-specific reason.
      // ragTools is shared, and on Discord a tool-only turn is NOT an error —
      // mention.ts turns it into "Thanks for the correction!" on purpose. Stating
      // the web consequence as a universal fact would be false there.
      'ALWAYS write your answer to the user as well: never send a turn that contains only this tool call and no text.',
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
