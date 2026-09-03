---
name: add-doc
description: Add one or more new documents to the Quily RAG knowledge base under `docs/custom/`. Handles URLs (WebFetch), file paths (Read), and pasted markdown — infers document type (discord_transcript, technical_reference, whitepaper_excerpt, blog_post, community_faq, community_guide, community_analysis), checks for duplicates/overlap with existing docs, adds YAML frontmatter, and writes the formatted file. Use ONLY when the user explicitly asks to add, ingest, or include a document/article/post/transcript in the knowledge base. Do NOT trigger on tangential mentions of docs. For official docs.quilibrium.com syncs use `sync-docs` instead. For livestream transcripts use `sync-transcripts`.
allowed-tools:
  - Read
  - Write
  - Glob
  - Grep
  - WebFetch
  - AskUserQuestion
  - Task
---

<objective>
Add one or more documents to the Quily chatbot's RAG knowledge base. All new docs go to `docs/custom/` (everything from official content not on docs.quilibrium.com to community-contributed content).

**Note:** For official docs from docs.quilibrium.com, use the `sync-docs` skill. For livestream transcripts, use the `sync-transcripts` skill.
</objective>

<document_taxonomy>

## Folder

All docs go to `docs/custom/`. Sub-folders:
- `docs/custom/auto/` — auto-generated docs (do not place manually written docs here)
- `docs/custom/gap-analysis/` — docs created by the doc-gap-analysis skill

## Document Types

- `discord_transcript` — Explanations from Cassie/team in Discord
- `technical_reference` — Architecture docs, deep-dives
- `whitepaper_excerpt` — Sections from the whitepaper
- `blog_post` — Official blog content
- `community_faq` — Community-compiled FAQs
- `community_guide` — Tutorials written by community
- `community_analysis` — Community research/analysis

</document_taxonomy>

<process>

<step name="parse-input">
**Parse the user's input:**

The user may provide:
- One or more URLs
- One or more file paths (e.g., `.temp/doc.md`)
- Pasted markdown content
- A mix of the above

The user will typically indicate the context in their message, e.g.:
- "Add this Discord explanation from Cassie about QNS"
- "Here's a community FAQ I compiled"
- "Add these blog posts: [urls]"

**Infer from user's message:**
- Document type — based on source description
- If unclear, default to asking ONE question about what the content is
</step>

<step name="fetch-content">
**Fetch all content in parallel:**

For each input:
- URL → Use WebFetch
- File path → Use Read
- Pasted content → Use directly

If multiple inputs, use Task tool to process in parallel.
</step>

<step name="analyze-and-check">
**For each document, analyze and check for overlap:**

1. **Extract metadata:**
   - Title (from content or infer)
   - Topics/keywords (5-10)
   - Source (URL, Discord, etc.)
   - Date (today if not specified)

2. **Check for duplicates:**
   - Search existing docs in `docs/custom/` for similar titles
   - Grep for key unique phrases to detect content overlap
   - Estimate overlap percentage

3. **Determine recommendation:**
   - No overlap → Proceed
   - Minor overlap (<30%) → Proceed with note
   - Significant overlap (30-70%) → Warn, may add new info
   - High overlap (>70%) → Recommend skip
</step>

<step name="present-summary">
**Present single summary for approval:**

For single doc:
```
📋 Document Analysis

Title: "QNS Privacy Mechanisms"
Source: Discord (Cassie)
Trust: Official → docs/custom/QNS-Privacy-Mechanisms.md
Type: discord_transcript
Topics: QNS, privacy, wallet, identity, metadata
Overlap: 12% with QNS-FAQ.md (different focus)

✓ Ready to add

Proceed? [Yes / Edit / Skip]
```

For batch:
```
📋 Batch Analysis (3 documents)

1. ✓ "QNS Privacy" → docs/custom/ (discord_transcript)
   Overlap: 12% with QNS-FAQ.md

2. ✓ "Node Troubleshooting" → docs/custom/ (community_guide)
   Overlap: None

3. ⚠ "Token Basics" → SKIP RECOMMENDED
   Overlap: 85% with existing Token-Overview.md

Add documents 1 & 2? [Yes / Review each / Add all / Cancel]
```

Use AskUserQuestion only here for final confirmation.
</step>

<step name="format-and-write">
**Format and write approved documents:**

For each approved doc:

1. **Create YAML frontmatter:**
```yaml
---
title: "Document Title"
source: discord | whitepaper | blog | community
author: Name (if applicable)
date: YYYY-MM-DD
type: <appropriate type>
topics:
  - topic1
  - topic2
---
```

2. **For community-contributed docs, add disclaimer after frontmatter:**
```markdown
> **Disclaimer**: This is community-contributed content and may not reflect official Quilibrium positions.
```

3. **Format content:**
   - Clean up markdown
   - Use clear section headers, but see the chunking warning below
   - Remove redundant info already well-covered elsewhere

4. **Write to `docs/custom/Title-Kebab-Case.md`**

5. **Check how it will chunk:**
   ```bash
   yarn doc:lint docs/custom/Title-Kebab-Case.md
   ```

### Write for the chunk, not the document

The retriever hands the model **individual chunks**, never the whole file. So the
unit that has to be correct on its own is the chunk. A document that reads
perfectly end to end can still produce a wrong answer, because no reader ever
sees it end to end.

> **Clear section headers are not automatically good.** They are good for
> retrieval precision, but the splitter breaks *on* them, so a `##` section
> becomes its own chunk. If one section says what works and the next says what
> does not, each chunk carries half the truth.
>
> This is not hypothetical. `Mainnet-Status-What-Is-Live.md` split with the
> boundary exactly on `## Live and working today`, leaving a lead chunk that
> asserted unavailability twenty-three times and named zero shipped products.
> Retrieved alone it could only say "the network isn't ready" — badly wrong, when
> Quorum, QStorage, QKMS, QNS, MegaRPC, Klearu and MetaVM had all shipped.

Practical rules:

- **Put a complete, compact summary near the top.** Keep both halves of any
  contrast inside a single table row or paragraph so they cannot be split apart.
  The lead chunk holds the title and is what broad queries land on first.
- **Let topic-scoped sections be one-sided**, but have them point at the other
  side in their first line.
- **Never end with a "Related docs" / "External sources" link list.** Cite inline
  instead: put each link next to the claim it supports, so it travels in the same
  chunk as the sentence it proves.

> **Why the link appendix is a bug, not a tidy habit.** If the splitter leaves the
> list isolated, that chunk spends one of the document's limited retrieval slots on
> something that can answer nothing. And URLs are not semantically inert: a list
> containing `getmonero.org/2024/04/27/fcmps.html` can outrank the section that
> actually explains membership proofs, handing the model links instead of facts.
> The failure is silent, because the bot just hedges.
>
> Measured 2026-09-03 while drafting `Privacy-Pools-vs-Quilibrium-Privacy.md`: its
> appendix chunked out on its own with 39 words of prose against 9 links, the
> lowest prose-to-link ratio of any chunk in the 59 authored docs.
>
> Sweeping the corpus for the same shape found 5 more docs ending in
> `Related Topics`, `Related Documents` or `See Also` lists; all were rewritten.
>
> **Whether it isolates is luck, which is why the rule is unconditional.** The
> splitter merges greedily, so a short list may be absorbed into the section above
> it today and split off tomorrow when someone adds a paragraph. Do not reason about
> whether your appendix "will" isolate. Just cite inline.
>
> If you still want pointers to sibling docs, **write them as sentences that state
> the fact the sibling establishes**, then name the file. That chunk then teaches
> something even when it surfaces alone.

`yarn doc:lint` runs the real ingest chunker over the file and shows the chunks a
retriever will actually see. It flags a lead chunk skewed toward "this does not
work" (`one-sided-lead`) and a document that ends in a reference list
(`link-appendix`). Add `--full` to print whole chunk bodies, `--strict` to exit
non-zero.

`link-appendix` reads the document's own section structure rather than the chunk
layout, so its answer does not change when a paragraph above the appendix grows.

**A green run is not proof of compliance.** It is a three-threshold heuristic, and
these all pass it silently (measured 2026-09-03): an appendix written with setext
headings (`Related docs` over `-----`); a blockquoted appendix; any short link-free
section placed after the appendix, which stops the backwards walk; and a list whose
glosses run past roughly twelve words per link. That last one matters, because
padding glosses is the wrong way to satisfy this rule. The point is to move each
link beside its claim, not to write longer labels.

Its `one-sided-lead` sibling is noisier: it counts availability phrases, so a doc
carrying a correct both-sides summary can still trip it when the "not live" half
naturally uses more such phrases than the "live" half. Read the flagged chunk
before acting on that one, and never reword accurate copy just to satisfy the
counter.

> **Do not replace an appendix with a new trailing prose section.** That is the trap
> the first attempt at this fell into: rewriting `## Related docs` into a
> `## Where to look next` paragraph cleared the lint while still leaving a pure
> pointer section at the end, which then chunked out on its own and produced exactly
> the dead retrieval slot the rule exists to prevent. It also pushed a one-chunk doc
> to two chunks, creating the problem where none had existed. Put each link **in the
> body**, beside the sentence it supports. Most of the time the link is already
> there and the appendix was pure duplication: of the five docs cleaned up on
> 2026-09-03, three had every appendix link already cited inline.

You do not have to remember to run it: `yarn ingest:run` reports the same thing
across every hand-authored doc on every run. It never blocks ingestion.

You do NOT need to repeat the document's subject in each section. Every chunk
reaches the model as `[N] Source: [<frontmatter title>](url)` directly above its
content, so attribution is already handled — just make sure the frontmatter
`title` is meaningful.
</step>

<step name="report">
**Final report:**

```
✅ Added [N] document(s)

Files:
- docs/custom/QNS-Privacy-Mechanisms.md
- docs/custom/Node-Troubleshooting.md

Next: Run `yarn ingest run` to update RAG database
```
</step>

</process>

<inference_rules>

**All docs go to `docs/custom/`.** No trust-level routing needed.

**Type Inference:**
- Discord messages → `discord_transcript`
- Whitepaper content → `whitepaper_excerpt`
- Architecture/technical deep-dive → `technical_reference`
- FAQ format → `community_faq` or `discord_transcript`
- Tutorial/how-to → `community_guide`
- Analysis/research → `community_analysis`

</inference_rules>

<examples>

**Example 1: Single Discord explanation**
```
User: "Add this Discord explanation from Cassie about wallet privacy"
[pastes content]

→ Infer: Official, discord_transcript
→ Analyze, check overlap
→ Present summary, confirm
→ Write to docs/custom/Wallet-Privacy.md
```

**Example 2: Batch community docs**
```
User: "Add these community guides I found:
- https://example.com/quil-setup
- https://example.com/node-faq"

→ Infer: community_guide type
→ Fetch both in parallel
→ Analyze each, check overlaps
→ Present batch summary
→ Write approved to docs/custom/
```

**Example 3: Mixed batch**
```
User: "Add this whitepaper section from .temp/consensus.md
and this community analysis from https://..."

→ Infer: First is whitepaper_excerpt, second is community_analysis
→ Process both
→ Present summary
→ Write both to docs/custom/
```

</examples>

---
*Last updated: 2026-06-03*
