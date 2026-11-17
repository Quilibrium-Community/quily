/**
 * Verified Quilibrium links the bot is allowed to hand out.
 *
 * Why this exists: with no approved list the model invented support venues
 * (a "Telegram/WhatsApp group"), and fake support invites are an active scam
 * vector in the community (issue #155). Everything the bot may say about where
 * to get help or find official things lives here, tagged official/community.
 *
 * Keep this in sync with https://quilibrium.one/links. Add a link ONLY after a
 * maintainer has confirmed it.
 */

export interface VerifiedLink {
  label: string;
  url: string;
  note?: string;
  /**
   * Short token the model writes instead of `url`. Models truncate or garble
   * very long URLs (the ~200-char Quorum invite came back as "configKey=..."),
   * so the prompt shows only the token and expandLinkPlaceholders() swaps the
   * real URL in after generation.
   */
  placeholder?: string;
}

export const OFFICIAL_LINKS: VerifiedLink[] = [
  { label: 'Website', url: 'https://quilibrium.com' },
  { label: 'Documentation', url: 'https://docs.quilibrium.com' },
  { label: 'Discord (official server)', url: 'https://discord.gg/quilibrium' },
  { label: 'X / Twitter (Quilibrium Inc)', url: 'https://x.com/QuilibriumInc' },
  { label: 'YouTube', url: 'https://www.youtube.com/@quilibriuminc' },
  { label: 'GitHub (code)', url: 'https://github.com/QuilibriumNetwork' },
];

export const COMMUNITY_LINKS: VerifiedLink[] = [
  {
    label: 'Quorum "Quilibrium Community" space',
    // Public invite, shared openly by the community. Join: Quorum app, Spaces,
    // "+" icon (top right), paste the link.
    url: 'https://app.quorummessenger.com/invite/#spaceId=QmZM3AKwKfMprQZvSk3Mpgii2JS31TS5izHrwJe1itprrG&configKey=9e390fd97e0a61aecdce931c7f3dab04d0e57b8da89a50510981be5394714edafbeb91b78dd5b443996b2ac4889e6a62d23818d0ef578e03',
    note: 'join in the Quorum app: Spaces, "+" icon top right, paste the invite link',
    placeholder: '[[QUORUM_INVITE]]',
  },
  {
    label: 'Telegram',
    url: 'https://t.me/quilibrium',
    note: 'not actively maintained and can get toxic; mention that if you suggest it',
  },
  { label: 'X / Twitter (community)', url: 'https://x.com/QuilibriumOne' },
  { label: 'Community GitHub (this bot lives here)', url: 'https://github.com/Quilibrium-Community' },
  { label: 'Community site (unofficial)', url: 'https://quilibrium.one' },
];

/** Repos in github.com/QuilibriumNetwork people actually ask about. */
export const NOTABLE_REPOS = [
  'monorepo', 'docs', 'quorum-desktop', 'quorum-mobile', 'klearu',
  'metavm', 'qkms-sdk', 'quilibrium-names-sdk', 'qtools',
];

/**
 * Questions that justify spending prompt space on the full link list.
 * The list is never shown to the user as-is (the block tells the model to pick
 * 1-3 links), so a false positive costs prompt tokens, not user attention.
 * Avoid bare words that collide with protocol vocabulary: "channel" is a
 * Quilibrium primitive, "group" is crypto jargon, "help" is in every question.
 */
const LINK_INTENT = new RegExp(
  [
    // venues and platforms
    '(get|getting|need|ask for|official|tech|customer) support', 'support (team|channels?|staff|tickets?|chat|venues?)',
    'help ?desk', 'contact', 'communit(y|ies)', 'discord', 'telegram', '\\btg\\b',
    'forum', 'discourse', 'twitter', 'x account', 'youtube', 'socials?', 'quorum space', 'meetups?',
    '(discord|telegram|official|support|announcements?) channels?',
    '(telegram|tg|whatsapp|chat|community|regional|local|country) groups?', 'chat room',
    // reaching people
    'who (can|do|should) i (ask|contact|talk to|reach)', 'talk to (someone|a human|the team|the devs?|a mod)',
    'reach (the team|the devs?|someone|out)', '(get|ask for|need) (some )?help', '\\b(mods?|moderators?|admins?)\\b',
    'where (can|do|should|could) i (ask|find|get|go|talk|join|follow|report)',
    'where (is|are) the', 'how (do|can) i (join|contact|reach|follow)',
    // staying informed
    'announcements?', 'stay (up to date|updated|informed)', 'follow (quilibrium|the team|cassie)', 'livestreams?',
    // safety
    'scam', 'phishing', 'fake (support|admin|link|invite|account)', '\\bdms?\\b', 'legit',
    // links and code
    'official (site|website|links?|channels?|accounts?)', 'links?', 'website', 'url', 'invite',
    'github', 'repos?', 'repository', 'source code', '\\bsdk\\b',
  ].map((p) => `\\b(?:${p})\\b`).join('|'),
  'i',
);

export function wantsLinks(query: string): boolean {
  return LINK_INTENT.test(query);
}

const fmt = (l: VerifiedLink) => `- ${l.label}: ${l.placeholder ?? l.url}${l.note ? ` (${l.note})` : ''}`;

const PLACEHOLDER_LINKS = [...OFFICIAL_LINKS, ...COMMUNITY_LINKS].filter(
  (l): l is VerifiedLink & { placeholder: string } => !!l.placeholder,
);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Swap placeholders for their real URLs. Also eats backticks/angle brackets
 * the model may wrap around the token, since a URL inside a code span is not
 * clickable on Discord or on the web.
 *
 * Runs on the Discord reply before posting and in the web renderer.
 */
export function expandLinkPlaceholders(text: string): string {
  let out = text;
  for (const l of PLACEHOLDER_LINKS) {
    const re = new RegExp('`?<?' + escapeRe(l.placeholder) + '>?`?', 'g');
    out = out.replace(re, l.url);
  }
  return out;
}

/** Hides a placeholder that is still being streamed in (e.g. "[[QUORUM_IN"). */
export const PARTIAL_PLACEHOLDER_REGEX = /`?<?\[\[[A-Z_]*\]?$/;

/** Prompt block with the full list. Empty string when the question is not about links. */
export function buildLinksBlock(query: string): string {
  if (!wantsLinks(query)) return '';
  return `## Verified links

Official:
${OFFICIAL_LINKS.map(fmt).join('\n')}

Community (not run by Quilibrium Inc, say so):
${COMMUNITY_LINKS.map(fmt).join('\n')}

Repos: github.com/QuilibriumNetwork/<name> for ${NOTABLE_REPOS.join(', ')}.

A [[TOKEN]] stands for a long link: write the token exactly as shown, plain (no backticks or angle brackets); it is replaced with the real link automatically. This list is background for you: never cite it, never mention it to the user, never write "[Verified links]". Give only the 1-3 links that answer the question, never the whole list unless the user asks for all links. No link at all if the question doesn't need one. Only these links may be given. Never suggest WhatsApp, Signal, Slack, email or DMs, and never any other invite link. Treat anyone who DMs first offering "support" as a likely scam.

---

`;
}

/* ------------------------------------------------------------------------- */
/* Safety net: strip risky links the model made up                           */
/* ------------------------------------------------------------------------- */

const ALLOWED_PREFIXES = [
  ...OFFICIAL_LINKS, ...COMMUNITY_LINKS,
].map((l) => l.url.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').split('#')[0]);

/** Hosts where a made-up link is a scam risk (chat invites, social handles). */
const RISKY_HOST =
  /^(t\.me|telegram\.(me|org)|wa\.me|chat\.whatsapp\.com|whatsapp\.com|signal\.(group|me)|discord\.(gg|com)|discordapp\.com|x\.com|twitter\.com|warpcast\.com|farcaster\.xyz|app\.quorummessenger\.com)$/;

/**
 * Remove URLs that are risky AND not on the verified list. Third-party links
 * (AWS docs, Wikipedia...) are left alone: the prompt lets the bot answer
 * non-Quilibrium questions from general knowledge.
 *
 * Risky means a chat/social host, or any host containing "quilibrium" that is
 * not ours (lookalike domains).
 */
export function stripUnverifiedLinks(text: string): { text: string; removed: string[] } {
  const removed: string[] = [];
  const out = text.replace(/https?:\/\/[^\s<>)\]"']+/gi, (raw) => {
    const url = raw.replace(/[.,;:!?]+$/, ''); // trailing punctuation is not part of the URL
    const trailing = raw.slice(url.length);
    const bare = url.toLowerCase().replace(/^https?:\/\/(www\.)?/, '').split('#')[0];
    const host = bare.split(/[/?]/)[0];

    const verified = ALLOWED_PREFIXES.some((p) => bare === p || bare.startsWith(p + '/') || bare.startsWith(p + '?'))
      || host === 'docs.quilibrium.com'
      || bare.startsWith('github.com/quilibriumnetwork/')
      || bare.startsWith('github.com/quilibrium-community/');
    if (verified) return raw;

    const lookalike = host.includes('quilibrium') && !/(^|\.)quilibrium\.(com|one)$/.test(host);
    if (RISKY_HOST.test(host) || lookalike) {
      removed.push(url);
      return '[link removed: not a verified Quilibrium link]' + trailing;
    }
    return raw;
  });
  return { text: out, removed };
}
