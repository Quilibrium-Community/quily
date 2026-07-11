/**
 * OpenRouter provider-routing helpers shared by the user-facing chat paths
 * (web chat route + Discord bot RAG service).
 *
 * Zero Data Retention (ZDR): when OPENROUTER_ZDR="true", OpenRouter restricts
 * routing to endpoints that do NOT retain prompts (privacy). deepseek-v4-flash
 * has several ZDR-compatible providers (DeepInfra, etc.), so enabling this does
 * not risk "no providers available"; the effect is excluding endpoints that
 * retain or train on prompt data. Toggled via env so it can be flipped without
 * touching code — set OPENROUTER_ZDR=true in .env / the VPS environment.
 */

/** Provider-routing preferences accepted by @openrouter/ai-sdk-provider. */
export type OpenRouterProviderRouting = {
  order?: string[];
  allow_fallbacks?: boolean;
  require_parameters?: boolean;
  only?: string[];
  ignore?: string[];
  quantizations?: string[];
  sort?: 'price' | 'throughput' | 'latency';
  zdr?: boolean;
  /**
   * Per-percentile latency cap in seconds. `sort:'latency'` orders providers by
   * MEDIAN latency but does not protect against a provider that accepts the request
   * then stalls (OpenRouter only deprioritizes providers that ERROR in the last 30s,
   * not slow ones). This caps the acceptable tail so a provider whose p90 exceeds the
   * limit is not routed to. Kaya measured SiliconFlow TTFT up to 222s without this cap.
   */
  preferred_max_latency?: { p50?: number; p90?: number; p99?: number };
};

/** True when Zero Data Retention routing is enabled via env. */
export const OPENROUTER_ZDR_ENABLED = process.env.OPENROUTER_ZDR === 'true';

/**
 * Merge the env-driven ZDR flag into an OpenRouter provider-routing block.
 * Returns `undefined` when there is nothing to configure, so callers can spread
 * it or pass model settings without an empty `provider: {}`.
 *
 * @param base - existing routing preferences (e.g. primary-model `order`)
 */
export function withZdr(
  base?: OpenRouterProviderRouting
): OpenRouterProviderRouting | undefined {
  if (!OPENROUTER_ZDR_ENABLED) return base;
  return { ...base, zdr: true };
}
