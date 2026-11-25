/**
 * Offline presentation regression tests: free, deterministic, safe for CI.
 *
 * A scripted model answer goes through the production web route and the
 * production Discord mention handler, with retrieval served from fixtures.
 * This pins down how citations become source footers on both surfaces, so a
 * prompt, model or formatter change cannot silently drop them (GitHub #169).
 * Whether a real model cites well is checked by live.ts, which costs money.
 */
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { JSDOM } from 'jsdom';
import { evidence, type EvidenceFixture } from './fixtures';
import { runFixture } from './run-fixture';
import type { ParsedResponse } from '../types';
import type { RelevanceQuality } from '../../../src/lib/rag/prompt';

const MODEL = 'fixture/model';
const DISCLAIMER = /I can make mistakes/;

async function run(fixture: EvidenceFixture, answer: string) {
  const result = await runFixture(fixture, MODEL, { answer });
  assert.equal(result.web.error, undefined, 'Web stream reported an error');
  assert.equal(result.discord.messages.length, 1, 'Discord should send exactly one reply');
  return { web: result.web, discord: result.discord.messages[0] };
}

/** Footer lines Discord shows, e.g. ["[2]", "[3]"]. */
function discordFooter(reply: string): string[] {
  if (!/\*\*Sources:\*\*/.test(reply)) return [];
  return [...reply.matchAll(/^-# • (\[[\d,]+\])/gm)].map((match) => match[1]);
}

// ─── Web UI rendering (jsdom) ──────────────────────────────────────────────

let dom: JSDOM;
before(() => {
  dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'http://localhost/' });
  const globals: Record<string, unknown> = {
    window: dom.window,
    document: dom.window.document,
    navigator: dom.window.navigator,
    HTMLElement: dom.window.HTMLElement,
    Node: dom.window.Node,
    MutationObserver: dom.window.MutationObserver,
    getComputedStyle: dom.window.getComputedStyle.bind(dom.window),
    requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0),
    cancelAnimationFrame: (id: number) => clearTimeout(id),
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  }
});
after(() => dom.window.close());

/** Render the assistant bubble the web app would show and return footer labels. */
async function webFooter(response: ParsedResponse): Promise<{ labels: string[]; warning: boolean }> {
  const React = await import('react');
  const { act } = React;
  const { createRoot } = await import('react-dom/client');
  const { MessageBubble } = await import('../../../src/components/chat/MessageBubble');

  const message = {
    id: 'fixture',
    role: 'assistant' as const,
    parts: [
      { type: 'text' as const, text: response.text },
      ...response.sources.map((source) => ({
        type: 'source-url' as const,
        sourceId: source.sourceId,
        url: source.url,
        title: source.title,
      })),
    ],
  };

  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(React.createElement(MessageBubble, {
      message: message as never,
      ragQuality: response.ragQuality as RelevanceQuality,
    }));
  });
  const toggle = [...container.querySelectorAll('button')].find((b) => /\d+ sources?/.test(b.textContent ?? ''));
  if (toggle) await act(async () => { toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true })); });
  const labels = [...container.querySelectorAll('li')]
    .map((li) => li.textContent?.match(/^\[[\d,]+\]/)?.[0])
    .filter((label): label is string => Boolean(label));
  const warning = /may not be fully supported/.test(container.textContent ?? '');
  await act(async () => root.unmount());
  container.remove();
  return { labels, warning };
}

// ─── Cases ──────────────────────────────────────────────────────────────────

test('strong retrieval, cited answer: both surfaces list exactly the cited sources by their real numbers', async () => {
  const { web, discord } = await run(evidence.high, 'External developers cannot deploy a DEX today [2]. Public deployment tooling is required [3].');

  assert.equal(web.ragQuality, 'high');
  assert.deepEqual(web.sources.map((s) => s.sourceId), ['source-1-201', 'source-2-202', 'source-3-203', 'source-4-204', 'source-5-205']);
  // Footer numbers must match the inline numbers, not list position.
  assert.deepEqual((await webFooter(web)).labels, ['[2]', '[3]']);

  assert.deepEqual(discordFooter(discord), ['[2]', '[3]']);
  assert.match(discord, /\[2\] \*\*Documentation:\*\* Deployment roadmap/);
  assert.match(discord, DISCLAIMER);
});

test('strong retrieval, uncited answer: no footer on either surface', async () => {
  const { web, discord } = await run(evidence.high, 'External developers cannot deploy a DEX on Quilibrium yet.');

  // Only cited sources are listed. Discord briefly showed a "Related sources"
  // fallback here (PR #170); it attached unrelated docs to jokes and
  // "I don't know" replies, so it was removed.
  assert.deepEqual((await webFooter(web)).labels, []);
  assert.deepEqual(discordFooter(discord), []);
  assert.doesNotMatch(discord, /sources:/i);
  assert.match(discord, DISCLAIMER);
});

test('weak retrieval, cited answer: footer plus low-confidence warning on both surfaces', async () => {
  const { web, discord } = await run(evidence.low, 'The docs only cover node log monitoring [1], not app deployment.');

  assert.equal(web.ragQuality, 'low');
  const rendered = await webFooter(web);
  assert.deepEqual(rendered.labels, ['[1]']);
  assert.ok(rendered.warning, 'Web should warn on low-quality retrieval');

  assert.deepEqual(discordFooter(discord), ['[1]']);
  assert.match(discord, /not very confident/);
});

test('weak retrieval, uncited answer: no footer on either surface', async () => {
  const { web, discord } = await run(evidence.low, "I couldn't find anything in the docs about deploying a DEX.");
  assert.deepEqual((await webFooter(web)).labels, []);
  assert.deepEqual(discordFooter(discord), []);
  assert.match(discord, DISCLAIMER);
});

test('no retrieval: no sources, no footer, no citation links on either surface', async () => {
  const { web, discord } = await run(evidence.none, "The documentation doesn't cover this. Check the official docs.");

  assert.equal(web.ragQuality, 'none');
  assert.deepEqual(web.sources, []);
  assert.deepEqual((await webFooter(web)).labels, []);
  assert.deepEqual(discordFooter(discord), []);
});

test('citation numbers with no matching retrieved source never produce a footer entry', async () => {
  const { web, discord } = await run(evidence.high, 'External developers cannot deploy a DEX today [9].');

  assert.deepEqual((await webFooter(web)).labels, []);
  assert.deepEqual(discordFooter(discord), [], 'Phantom [9] must not get a numbered footer');
  assert.doesNotMatch(discord, /sources:/i, 'Phantom [9] must not produce any footer');
});
