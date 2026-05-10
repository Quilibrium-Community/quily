#!/usr/bin/env tsx
/**
 * Hit the live /api/chat endpoint on quily.quilibrium.one with the debug bypass.
 *
 * Reads DEBUG_BYPASS_TOKEN from .env.local (NEVER prints it). Streams the SSE
 * response, separates user-visible text from `data-debug` events, and prints a
 * structured summary at the end. Designed to be run by an agent without the
 * user having to paste the token.
 *
 * Usage:
 *   yarn prod-curl "What is Quilibrium?"
 *   yarn prod-curl "What is Q?" --provider openrouter
 *   yarn prod-curl "..." --raw          # dump the raw SSE stream
 *   yarn prod-curl "..." --url https://my-preview.vercel.app   # custom target
 */
import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';

// Load .env.local first (overrides), then .env. Never log values.
loadEnv({ path: resolve(process.cwd(), '.env.local') });
loadEnv({ path: resolve(process.cwd(), '.env') });

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const value = (name: string, def: string) => {
  const i = args.indexOf(`--${name}`);
  if (i >= 0 && args[i + 1]) {
    args.splice(i, 2);
    return args[i] ?? def; // index has shifted after splice
  }
  return def;
};

const raw = flag('raw');
if (raw) args.splice(args.indexOf('--raw'), 1);
const provider = value('provider', 'openrouter');
const targetUrl = value('url', 'https://quily.quilibrium.one');

const question = args.join(' ').trim();
if (!question) {
  console.error('Usage: yarn prod-curl "<question>" [--provider openrouter|chutes] [--url <base>] [--raw]');
  process.exit(1);
}

const token = process.env.DEBUG_BYPASS_TOKEN;
if (!token) {
  console.error('[prod-curl] DEBUG_BYPASS_TOKEN is not set in .env.local.');
  console.error('  Generate one:  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64url\'))"');
  console.error('  Add to .env.local AND Vercel prod env (vercel env add DEBUG_BYPASS_TOKEN production).');
  process.exit(2);
}

const url = `${targetUrl}/api/chat?debug=${encodeURIComponent(token)}`;
const body = {
  messages: [{ role: 'user', parts: [{ type: 'text', text: question }] }],
  provider,
};

console.error(`[prod-curl] POST ${targetUrl}/api/chat (debug bypass active)`);
console.error(`[prod-curl] Question: ${question}`);
console.error('');

async function main() {
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 90_000);

let response: Response;
try {
  response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: controller.signal,
  });
} catch (err) {
  clearTimeout(timeout);
  console.error('[prod-curl] fetch failed:', err);
  process.exit(3);
}

if (!response.ok) {
  clearTimeout(timeout);
  const text = await response.text();
  console.error(`[prod-curl] HTTP ${response.status} ${response.statusText}`);
  console.error(text.slice(0, 1000));
  process.exit(4);
}

if (!response.body) {
  clearTimeout(timeout);
  console.error('[prod-curl] Response has no body');
  process.exit(5);
}

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

interface DebugEvent {
  phase: string;
  [k: string]: unknown;
}
const debugEvents: DebugEvent[] = [];
const sources: { url?: string; title?: string }[] = [];
const followUps: string[] = [];
let visibleText = '';

// AI SDK v6 streams data parts as JSON lines. Each chunk contains `type` and either
// `delta`, `data`, etc. We parse what we recognize and pass through the rest in --raw.
const parseDataPart = (line: string): { type?: string; delta?: string; id?: string; data?: unknown; sourceId?: string; url?: string; title?: string } | null => {
  const trimmed = line.trim();
  if (!trimmed.startsWith('data:')) return null;
  const json = trimmed.slice(5).trim();
  if (!json || json === '[DONE]') return null;
  try { return JSON.parse(json); } catch { return null; }
};

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value, { stream: true });
  if (raw) process.stdout.write(chunk);
  buffer += chunk;

  let idx: number;
  while ((idx = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, idx);
    buffer = buffer.slice(idx + 1);
    if (raw) continue;

    const part = parseDataPart(line);
    if (!part) continue;

    if (part.type === 'text-delta' && typeof part.delta === 'string') {
      visibleText += part.delta;
      process.stdout.write(part.delta);
    } else if (part.type === 'data-debug' && part.data) {
      debugEvents.push(part.data as DebugEvent);
    } else if (part.type === 'source-url') {
      sources.push({ url: part.url, title: part.title });
    } else if (part.type === 'data-follow-up' && Array.isArray(part.data)) {
      followUps.push(...(part.data as string[]));
    }
  }
}

clearTimeout(timeout);

if (raw) process.exit(0);

console.log('\n');
console.log('─'.repeat(72));
console.log('SUMMARY');
console.log('─'.repeat(72));
console.log(`Visible output:  ${visibleText.length} chars`);
console.log(`Sources sent:    ${sources.length}`);
console.log(`Follow-ups sent: ${followUps.length}`);
console.log(`Debug events:    ${debugEvents.length}`);

if (debugEvents.length === 0) {
  console.log('\n⚠️  No data-debug events received. Either DEBUG_BYPASS_TOKEN does not match');
  console.log('    the value in Vercel prod env, or the deployment predates the bypass code.');
}

for (const ev of debugEvents) {
  console.log(`\n  ▸ ${ev.phase}`);
  for (const [k, v] of Object.entries(ev)) {
    if (k === 'phase') continue;
    const str = typeof v === 'string' ? (v.length > 200 ? v.slice(0, 200) + '…' : v) : JSON.stringify(v);
    console.log(`     ${k}: ${str}`);
  }
}
}

main().catch((err) => {
  console.error('[prod-curl] fatal:', err);
  process.exit(99);
});
