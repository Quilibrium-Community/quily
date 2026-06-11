/**
 * Syncs the Quilibrium ecosystem project list into the RAG knowledge base.
 *
 * Source: a public ecosystem.json emitted by the www-dev site build
 * (https://quilibrium.com/ecosystem.json by default). That file is a data
 * mirror of QuilibriumNetwork/www-dev/src/ecosystem/projects/*.json. Because
 * www-dev is a private repo, we read its public build output rather than the
 * repo directly — no token, no cross-org access.
 *
 * Output: one markdown doc per project under docs/custom/auto/ecosystem/,
 * each with frontmatter + readable prose. The ingest pipeline globs these
 * recursively; `ingest run --clean` removes docs for projects that disappear.
 *
 * All ecosystem projects are included, even ones (metavm, klearu, quorum, …)
 * that also have richer hand-written docs elsewhere in docs/custom/. The
 * ecosystem entries are additive project-overview cards — they serve "what is
 * X / what runs on Quilibrium" queries, while the deep docs serve technical
 * queries — and they don't contradict the deep docs.
 *
 * Usage: tsx scripts/sync-ecosystem.ts
 */

import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { resolve, join } from 'path';

const FEED_URL = process.env.ECOSYSTEM_FEED_URL || 'https://quilibrium.com/ecosystem.json';
const OUT_DIR = resolve(__dirname, '../docs/custom/auto/ecosystem');

const NETWORK_LABELS: Record<string, string> = {
  protocol: 'Quilibrium Protocol (a core piece of Quilibrium, built into the network itself)',
  'built-on': 'Built on Quilibrium (an app that runs on Quilibrium and needs the network to work)',
  integrates: 'Plugs into Quilibrium (an app or tool that connects to Quilibrium but runs on its own servers)',
};

// ── Types ────────────────────────────────────────────────────────────────────

interface EcosystemLink {
  platform: string;
  url: string;
  label?: string;
}

interface EcosystemProject {
  id: string;
  title: string;
  description: string;
  website: string;
  links?: EcosystemLink[];
  tags?: string[];
  network: string;
  callout?: { type: string; text: string };
}

interface EcosystemFeed {
  count: number;
  projects: EcosystemProject[];
}

// ── Markup → prose ───────────────────────────────────────────────────────────

/**
 * Convert the ecosystem description's inline markup into plain readable prose
 * for RAG. The site renders `**bold**`, `` `code` ``, and `[[slug|text]]`
 * wiki-links; for retrieval we want clean text, not markup tokens.
 *   **bold**         -> bold (kept, markdown-safe)
 *   `code`           -> code (kept, markdown-safe)
 *   [[slug]]         -> slug, prettified ("metavm" -> "MetaVM"-ish is not known
 *                       here, so we use the slug's title-cased form)
 *   [[slug|text]]    -> text
 *   [note] ... [/note] -> the inner text, unwrapped
 */
function stripWikiMarkup(text: string, titleBySlug: Map<string, string>): string {
  let out = text;

  // [note] ... [/note] -> inner text
  out = out.replace(/\[note\]([\s\S]*?)\[\/note\]/g, (_m, inner) => inner.trim());

  // [[slug|custom text]] -> custom text
  out = out.replace(/\[\[([^[\]\n|]+?)\|([^[\]\n]+?)\]\]/g, (_m, _slug, custom) => custom);

  // [[slug]] -> known title, else title-cased slug
  out = out.replace(/\[\[([^[\]\n|]+?)\]\]/g, (_m, slug: string) => {
    const known = titleBySlug.get(slug.trim());
    if (known) return known;
    return slug
      .split('-')
      .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
      .join(' ');
  });

  return out;
}

// ── Doc builder ──────────────────────────────────────────────────────────────

function buildDoc(project: EcosystemProject, titleBySlug: Map<string, string>, dateIso: string): string {
  const description = stripWikiMarkup(project.description, titleBySlug);

  const topics = [
    project.title,
    project.id,
    'Quilibrium ecosystem',
    'ecosystem project',
    'projects on Quilibrium',
    'apps on Quilibrium',
    ...(project.tags ?? []),
  ];

  const links = (project.links ?? [])
    .filter((l) => l.url && l.url !== project.website)
    .map((l) => `- ${l.label || l.platform}: ${l.url}`);

  const networkLine = NETWORK_LABELS[project.network] || project.network;

  let md = `---
title: "${project.title.replace(/"/g, "'")}"
source: quilibrium.com/ecosystem (automated)
date: ${dateIso.split('T')[0]}
type: community_reference
topics:
${topics.map((t) => `  - ${t}`).join('\n')}
---

# ${project.title}

**Part of the official Quilibrium ecosystem.** Relation to the network: ${networkLine}.

${description}

`;

  md += `**Website:** ${project.website}\n`;
  if (links.length > 0) {
    md += `\n**Links:**\n${links.join('\n')}\n`;
  }
  if (project.tags && project.tags.length > 0) {
    md += `\n**Categories:** ${project.tags.join(', ')}\n`;
  }
  if (project.callout?.text) {
    md += `\n> Note: ${stripWikiMarkup(project.callout.text, titleBySlug)}\n`;
  }

  md += `\n---\n\n*This document is auto-generated from the official Quilibrium ecosystem page at quilibrium.com/ecosystem.*\n`;

  return md;
}

function normalizeForCompare(s: string): string {
  return s.replace(/^date: .+$/m, '');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Syncing Quilibrium ecosystem projects...');
  console.log(`  Feed: ${FEED_URL}`);

  const res = await fetch(FEED_URL, { headers: { 'User-Agent': 'quily-chatbot-sync' } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ecosystem feed: HTTP ${res.status}`);
  }
  const feed = (await res.json()) as EcosystemFeed;
  const projects = feed.projects ?? [];
  console.log(`  Feed has ${projects.length} projects`);

  if (projects.length === 0) {
    throw new Error('Feed returned no usable projects — refusing to wipe existing docs');
  }

  // Title lookup so [[slug]] wiki-links render as the real project name.
  const titleBySlug = new Map<string, string>();
  for (const p of projects) titleBySlug.set(p.id, p.title);

  mkdirSync(OUT_DIR, { recursive: true });

  const dateIso = new Date().toISOString();
  const wantedFiles = new Set<string>();
  let written = 0;
  let unchanged = 0;

  for (const project of projects) {
    const filename = `${project.id}.md`;
    wantedFiles.add(filename);
    const outPath = join(OUT_DIR, filename);
    const md = buildDoc(project, titleBySlug, dateIso);

    if (existsSync(outPath)) {
      const existing = readFileSync(outPath, 'utf-8');
      if (normalizeForCompare(existing) === normalizeForCompare(md)) {
        unchanged++;
        continue;
      }
    }
    writeFileSync(outPath, md, 'utf-8');
    written++;
  }

  // Remove docs for projects no longer in the feed (or newly excluded).
  let removed = 0;
  for (const file of readdirSync(OUT_DIR)) {
    if (!file.endsWith('.md')) continue;
    if (!wantedFiles.has(file)) {
      rmSync(join(OUT_DIR, file));
      removed++;
      console.log(`  Removed stale doc: ${file}`);
    }
  }

  console.log(`\nDone. ${written} written, ${unchanged} unchanged, ${removed} removed.`);
}

main().catch((err) => {
  // Graceful failure: warn but exit 0 so the daily CI workflow continues and
  // existing ecosystem docs are preserved unchanged.
  console.warn('Warning: ecosystem sync failed, skipping:', err.message || err);
  process.exit(0);
});
