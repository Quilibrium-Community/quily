// src/lib/rag/visibleText.ts
// One definition of "what the user actually sees" in an assistant reply.
//
// The client renders less than the model emits: it strips the follow-up JSON
// block, and it strips a leaked tool call from that point to the END of the
// message. So a reply can carry hundreds of raw characters and still render as
// an empty bubble.
//
// This existed as four separate copies — two inline in app/api/chat/route.ts,
// one in scripts/web-answer-probe.ts, one in MessageBubble — and they have to
// agree. The server decides whether to show an error based on this; the probe
// decides whether a run counted as answered. When the probe's copy drifted from
// the route's, it scored raw length and reported "0/30 delivered" for runs the
// user would have seen as blank.

import { parseFollowUpQuestions } from './followUpParser';

export const ANSWER_ONLY_INSTRUCTION = 'Write only the user-facing answer. Keep any deliberation, source-checking notes, and plans for writing the answer out of the reply.';

const ISSUE_MEMORY_NOTE = /^\s*\(?I (?:filed|could not file) a GitHub issue for this\.\)?\s*$/i;

/** Remove standalone issue-filing notes previously inserted into Discord history. */
export function stripIssueMemoryNotes(text: string): string {
  const lines = text.split(/\r?\n/);
  const answerLines = lines.filter((line) => !ISSUE_MEMORY_NOTE.test(line));
  return answerLines.length === lines.length ? text : answerLines.join('\n').trim();
}

const NARRATES_REQUEST = /(?:^|[.!?]\s+|\n)\s*the user (?:is asking|wants to know|might (?:also )?be interested)\b/i;
const PLANS_ANSWER = /(?:^|[.!?]\s+|\n)\s*(?:first,\s*)?(?:I (?:need to check the (?:documentation|sources)|should make sure to mention)|the response should be concise)\b/i;

/** Detect model-facing drafting in the answer field, where SDK reasoning filtering cannot see it. */
export function hasDraftingLeak(text: string): boolean {
  const prose = text.replace(/^\s*```[^\n]*\n[\s\S]*?^\s*```[^\n]*$/gm, '');
  return NARRATES_REQUEST.test(prose) && PLANS_ANSWER.test(prose);
}

/** Release ordinary paragraphs while holding a possible drafting tail for validation. */
export function createDraftingStreamGate() {
  let pending = '';

  return {
    push(delta: string): string {
      pending += delta;
      let ready = '';
      const boundaryRe = /\r?\n[ \t]*\r?\n/g;
      boundaryRe.lastIndex = 0;
      let boundary: RegExpExecArray | null;
      while ((boundary = boundaryRe.exec(pending))) {
        const end = boundary.index + boundary[0].length;
        const block = pending.slice(0, end);
        // Grow the block until it closes any open code fence and contains a
        // letter, so a code sample or a `---` line is judged together with its
        // neighbours instead of stalling the stream until finish().
        if ((block.match(/```/g)?.length ?? 0) % 2 === 1 || !/\p{L}/u.test(block)) continue;
        // A possible drafting tail stays held until finish() can judge it whole.
        if (NARRATES_REQUEST.test(block) || PLANS_ANSWER.test(block)) break;
        ready += block;
        pending = pending.slice(end);
        boundaryRe.lastIndex = 0;
      }
      return ready;
    },
    finish(): string {
      const answer = hasDraftingLeak(pending) ? '' : pending;
      pending = '';
      return answer;
    },
  };
}

/**
 * Raw tool-call text some models emit instead of a structured call. Matches from
 * the start of the offending line to the end of the message, because the payload
 * runs on past it — which is why a leak on the FIRST line erases everything.
 *
 * Real examples seen in production:
 *   "فتรfunction<｜tool▁sep｜>create_knowledge_issue json {"title": "..."}"
 *   "kontsultatua nostfunction<｜tool▁sep｜>create_knowledge_issue json {"title": "..."}"
 */
export const TOOL_CALL_TEXT_REGEX = /[^\n]*create_knowledge_issue[\s\S]*$/;

/** True when a reply contains tool-call syntax that the client will strip. */
export function leaksToolCallText(text: string): boolean {
  return TOOL_CALL_TEXT_REGEX.test(text);
}

/**
 * The rendered text for a COMPLETED reply — the server-side mirror of
 * MessageBubble's getTextContent for the non-streaming case.
 *
 * Note `trim()` rather than the client's `trimEnd()`: callers here ask "is there
 * an answer at all", so leading whitespace must not count as content. That makes
 * this very slightly stricter than the client, never looser, which is the safe
 * direction for an emptiness test.
 */
export function visibleAnswerText(raw: string): string {
  return parseFollowUpQuestions(raw).cleanText.replace(TOOL_CALL_TEXT_REGEX, '').trim();
}

/**
 * Below this many visible characters, a reply is an answer-shaped nothing rather
 * than an answer. Measured: a local run returned 2 characters alongside a tool
 * call, which renders as a near-empty bubble.
 *
 * Exported so the route and scripts/web-answer-probe.ts cannot disagree about
 * where the line is — a harness using a different threshold from production is
 * measuring a system nobody ships.
 *
 * Deliberately tiny. It is only ever applied together with "a tool call also
 * fired", which is what keeps it away from the persona's intentional one-word
 * deflections (see personality.ts).
 */
export const MIN_USABLE_ANSWER_CHARS = 10;
