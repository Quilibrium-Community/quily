// src/lib/openrouter-reasoning.ts
// Single definition of the OpenRouter reasoning switch.
//
// Deliberately dependency-free so any caller can import it without dragging in
// a module chain. src/lib/rag/service.ts pulls in src/lib/supabase.ts, which
// throws at module load when NEXT_PUBLIC_SUPABASE_URL is unset — fine for the
// bot bundle, wrong as a dependency for a digest service that only needs one
// boolean.

/**
 * Whether to let the model emit reasoning tokens. Default OFF.
 *
 * Why off:
 * - The July 2026 A/B (.agents/reports/2026-07-11-reasoning-ab.md) found no
 *   quality loss for this facts-from-RAG bot.
 * - On the web path, reasoning deltas arrive before content deltas, so the user
 *   watches a blank screen for the 3-4s reasoning phase.
 * - On every path that sets an output cap, reasoning SHARES that cap with the
 *   answer and can consume all of it. That produced the bare-👀 Discord replies
 *   (GitHub #122/#123) and, on the digest services, empty or mid-sentence
 *   recaps once `~deepseek/deepseek-v4-flash-latest` began resolving to the
 *   0731 revision.
 *
 * Set OPENROUTER_REASONING=on|true|1 to re-enable.
 *
 * NOTE: this only reaches the OpenRouter API. The Chutes SDK exposes no
 * equivalent switch, so with BOT_LLM_PROVIDER=chutes reasoning is whatever the
 * provider defaults to and the cap-sharing risk is back.
 */
export function isReasoningEnabled(): boolean {
  return /^(on|true|1)$/i.test(process.env.OPENROUTER_REASONING ?? 'off');
}

/**
 * The OpenRouter model-settings fragment implementing the switch. Spread into a
 * request body or model settings object. Passed as a raw `{ enabled: false }`
 * because the OpenRouter API accepts that, while the SDK's type wants
 * max_tokens/effort even for the pure-disable case.
 */
export function reasoningSettings(): { reasoning?: { enabled: false } } {
  return isReasoningEnabled() ? {} : { reasoning: { enabled: false } };
}
