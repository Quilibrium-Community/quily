#!/usr/bin/env tsx
/**
 * Fetch and pretty-print Vercel production runtime logs for the chat route.
 *
 * Why this exists: `vercel logs <url>` is interactive-streaming-only and prints
 * nothing useful when piped or run by an agent. This wraps the non-interactive
 * `vercel logs --no-follow --json` form and filters down to the events that
 * actually matter when debugging.
 *
 * Usage:
 *   yarn prod-logs                     # last 1h, /api/chat events only
 *   yarn prod-logs --since 6h          # custom window
 *   yarn prod-logs --all               # show all routes, not just /api/chat
 *   yarn prod-logs --errors            # only error/warning level
 *   yarn prod-logs --query "RAG"       # full-text search via vercel CLI
 *   yarn prod-logs --raw               # dump raw JSON lines for piping
 */
import { execFileSync } from 'node:child_process';

const vercelBin = process.platform === 'win32' ? 'vercel.cmd' : 'vercel';

interface LogEntry {
  id: string;
  timestamp: number;
  level: string;
  message: string;
  source: string;
  domain: string;
  requestMethod?: string;
  requestPath?: string;
  responseStatusCode?: number;
  logs?: { level: string; message: string }[];
}

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const value = (name: string, def: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};

const since = value('since', '1h');
const limit = value('limit', '200');
const query = value('query', '');
const showAll = flag('all');
const errorsOnly = flag('errors');
const raw = flag('raw');

const cmd = ['logs', '--no-follow', '--json', '--environment', 'production', '--since', since, '--limit', limit];
if (query) cmd.push('--query', query);
if (errorsOnly) cmd.push('--level', 'error', '--level', 'warning');

console.error(`[prod-logs] vercel ${cmd.join(' ')}`);

let stdout: string;
try {
  stdout = execFileSync(vercelBin, cmd, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, shell: process.platform === 'win32' });
} catch (err) {
  const e = err as { stdout?: string; stderr?: string; message?: string };
  console.error('[prod-logs] vercel CLI failed:', e.stderr || e.message);
  process.exit(1);
}

const lines = stdout.split('\n').filter((l) => l.trim().startsWith('{'));
const entries: LogEntry[] = lines.flatMap((l) => {
  try { return [JSON.parse(l)]; } catch { return []; }
});

if (raw) {
  for (const e of entries) console.log(JSON.stringify(e));
  process.exit(0);
}

const filtered = showAll ? entries : entries.filter((e) => (e.requestPath || '').startsWith('/api/chat'));

const ts = (n: number) => new Date(n).toISOString().replace('T', ' ').replace(/\..+/, '');
const status = (code?: number) => {
  if (!code) return '   ';
  if (code >= 500) return `\x1b[31m${code}\x1b[0m`; // red
  if (code >= 400) return `\x1b[33m${code}\x1b[0m`; // yellow
  return `\x1b[32m${code}\x1b[0m`; // green
};
const lvl = (l: string) => {
  if (l === 'error' || l === 'fatal') return `\x1b[31m${l.toUpperCase()}\x1b[0m`;
  if (l === 'warning') return `\x1b[33mWARN\x1b[0m`;
  return `\x1b[2m${l.toUpperCase()}\x1b[0m`;
};

console.error(`[prod-logs] ${entries.length} total events, ${filtered.length} matching filter\n`);

for (const e of filtered.reverse()) {
  const meta = `${ts(e.timestamp)}  ${status(e.responseStatusCode)}  ${(e.requestMethod || '').padEnd(4)} ${e.requestPath || ''}`;
  console.log(meta);
  for (const sub of e.logs || []) {
    const oneLine = sub.message.replace(/\n/g, ' ').replace(/\s+/g, ' ').slice(0, 240);
    console.log(`  ${lvl(sub.level)}  ${oneLine}`);
  }
  console.log();
}
