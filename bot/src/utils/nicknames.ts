/**
 * Per-user forms of address, configured by the operator.
 *
 * A user can ask Quily to call them something. Left to itself Quily refuses:
 * the Provocation rules in `personality.ts` treat "call me X" as a reaction-seeking
 * demand, which is correct for a stranger pushing in a channel. This map is the
 * operator's override for the case where the request is genuine and consented.
 *
 * Deliberately env-driven rather than committed. This repo is public, and a file
 * pairing real Discord IDs with nicknames is both a privacy leak and, depending on
 * the nickname, a screenshot. Keeping it in the VPS environment means the list can
 * change without a deploy and never appears in git history.
 *
 * Format: DISCORD_USER_NICKNAMES=<id>:<nickname>,<id>:<nickname>
 * Nicknames cannot contain a comma or a colon.
 */

let cache: Map<string, string> | null = null;

function parse(): Map<string, string> {
  const map = new Map<string, string>();
  const raw = process.env.DISCORD_USER_NICKNAMES;
  if (!raw) return map;

  for (const entry of raw.split(',')) {
    const trimmed = entry.trim();
    if (!trimmed) continue;

    // Split on the FIRST colon only, so a stray colon in the nickname degrades
    // to a slightly odd nickname rather than silently dropping the entry.
    const sep = trimmed.indexOf(':');
    if (sep <= 0) {
      console.warn(`[nicknames] Skipping malformed entry (expected <id>:<name>): "${trimmed}"`);
      continue;
    }

    const userId = trimmed.slice(0, sep).trim();
    const nickname = trimmed.slice(sep + 1).trim();
    if (!userId || !nickname) {
      console.warn(`[nicknames] Skipping entry with empty id or nickname: "${trimmed}"`);
      continue;
    }
    if (!/^\d+$/.test(userId)) {
      console.warn(`[nicknames] Skipping entry with non-numeric Discord ID: "${userId}"`);
      continue;
    }
    map.set(userId, nickname);
  }

  return map;
}

/**
 * The configured form of address for a Discord user, or null if none is set.
 *
 * Parsed once and cached. The bot is restarted on deploy, so a config change is
 * picked up then; there is no need to re-read the environment per message.
 */
export function getNickname(userId: string): string | null {
  if (!cache) cache = parse();
  return cache.get(userId) ?? null;
}

/** Test seam — forces a re-read of the environment. */
export function resetNicknameCache(): void {
  cache = null;
}
