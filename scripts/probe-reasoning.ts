/**
 * Probe: does the default free-mode model emit `reasoning` deltas before `content`,
 * and how big is the reasoning->content blank-screen gap? Prerequisite for task
 * 2026-07-11 item #1 (reasoning off). Measures ON vs OFF. No env values printed.
 *
 *   yarn tsx scripts/probe-reasoning.ts
 */
import 'dotenv/config';

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) { console.error('OPENROUTER_API_KEY not set'); process.exit(1); }
const model = process.env.FREE_MODE_DEFAULT_MODEL || 'deepseek/deepseek-v4-flash';

const log = (s: string) => process.stdout.write(s + '\n');

async function probe(reasoningEnabled: boolean): Promise<void> {
  const t0 = Date.now();
  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: 'system', content: 'You are Quily, a Quilibrium technical assistant. Answer concisely using the provided context.' },
      { role: 'user', content: 'How does Quilibrium consensus work? Explain the hypergraph and proof of meaningful work briefly.' },
    ],
    stream: true,
    max_tokens: 200,
    provider: { sort: 'latency', quantizations: ['fp8', 'fp16', 'bf16', 'fp32', 'int8', 'unknown'] },
  };
  if (!reasoningEnabled) body.reasoning = { enabled: false };

  const controller = new AbortController();
  const hardTimeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) { log(`[${reasoningEnabled ? 'ON ' : 'OFF'}] HTTP ${res.status}: ${await res.text()}`); return; }

    const reader = res.body!.getReader();
    const dec = new TextDecoder();
    let buf = '', firstReasoning: number | null = null, firstContent: number | null = null;
    let sawReasoning = false, sawContent = false, providerName: string | null = null;

    outer: while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') break outer;
        try {
          const j = JSON.parse(data);
          if (j.provider && !providerName) providerName = j.provider;
          const d = j.choices?.[0]?.delta;
          if (!d) continue;
          if (d.reasoning && !sawReasoning) { sawReasoning = true; firstReasoning = Date.now() - t0; }
          if (d.content && !sawContent) { sawContent = true; firstContent = Date.now() - t0; break outer; }
        } catch { /* ignore keep-alive / partial */ }
      }
    }
    controller.abort(); // stop the stream once we have first content

    const gap = (sawReasoning && sawContent && firstReasoning !== null && firstContent !== null)
      ? firstContent - firstReasoning : null;
    log(`[${reasoningEnabled ? 'ON ' : 'OFF'}] provider=${providerName || '?'} sawReasoning=${sawReasoning} firstReasoning=${firstReasoning ?? 'n/a'}ms firstContent=${firstContent ?? 'n/a'}ms gap=${gap === null ? 'n/a' : gap + 'ms'}`);
  } catch (e) {
    log(`[${reasoningEnabled ? 'ON ' : 'OFF'}] error: ${e instanceof Error ? e.message : String(e)}`);
  } finally {
    clearTimeout(hardTimeout);
  }
}

async function main() {
  log(`model: ${model}\n`);
  await probe(true);
  await probe(false);
  log('\ndone');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
