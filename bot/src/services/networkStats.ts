// bot/src/services/networkStats.ts
// Re-exports shared stats + adds file-based history management (bot-only, runs on VPS).

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export { computeStats, formatDiscordStats } from '../../../src/lib/networkStats';
export type { NetworkSnapshot } from '../../../src/lib/networkStats';

import type { NetworkSnapshot } from '../../../src/lib/networkStats';

const HISTORY_FILE = join(process.cwd(), 'stats-history.json');
const MAX_HISTORY_DAYS = 30;

export async function loadHistory(): Promise<NetworkSnapshot[]> {
  try {
    const raw = await readFile(HISTORY_FILE, 'utf-8');
    return JSON.parse(raw) as NetworkSnapshot[];
  } catch {
    return [];
  }
}

async function saveHistory(history: NetworkSnapshot[]): Promise<void> {
  const trimmed = history.slice(-MAX_HISTORY_DAYS);
  await writeFile(HISTORY_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
}

export async function recordSnapshot(snapshot: NetworkSnapshot): Promise<void> {
  const history = await loadHistory();
  const idx = history.findIndex((h) => h.date === snapshot.date);
  if (idx >= 0) history[idx] = snapshot;
  else history.push(snapshot);
  await saveHistory(history);
}
