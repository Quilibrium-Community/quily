/**
 * OpenRouter provider-routing helpers shared by the user-facing chat paths
 * (web chat route + Discord bot RAG service).
 *
 * Let OpenRouter fail over between eligible providers serving the same model.
 * A fixed provider list can become incompatible as model aliases and hosting
 * availability change.
 */

/** Provider-routing preferences accepted by @openrouter/ai-sdk-provider. */
type OpenRouterProviderRouting = {
  ignore?: string[];
  quantizations?: string[];
  sort?: 'price' | 'throughput' | 'latency';
  zdr?: boolean;
  /** Preferred time to first token, in seconds. The caller still needs a timeout. */
  preferred_max_latency?: { p50?: number; p90?: number; p99?: number };
};

export function getOpenRouterChatRouting(): OpenRouterProviderRouting | undefined {
  const sort = process.env.OPENROUTER_SORT ?? 'latency';
  const zdr = process.env.OPENROUTER_ZDR === 'true' ? { zdr: true } : undefined;
  if (!sort) return zdr;

  const latencySetting = (process.env.OPENROUTER_MAX_LATENCY_P90 ?? '4').trim();
  const p90 = Number(latencySetting);
  const ignore = (process.env.OPENROUTER_IGNORE ?? '')
    .split(',').map((provider) => provider.trim()).filter(Boolean);

  return {
    sort: sort as OpenRouterProviderRouting['sort'],
    quantizations: ['fp8', 'fp16', 'bf16', 'fp32', 'int8', 'unknown'],
    ...(latencySetting && Number.isFinite(p90) ? { preferred_max_latency: { p90 } } : {}),
    ...(ignore.length ? { ignore } : {}),
    ...zdr,
  };
}
