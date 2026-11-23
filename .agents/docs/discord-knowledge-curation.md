---
type: doc
title: Discord Knowledge Curation
description: Operator workflow for reviewing durable knowledge from selected Discord conversations
status: done
created: 2026-11-23
updated: 2026-11-23
---

# Discord Knowledge Curation

Use this on demand to find durable explanations missing from Quily's docs. The first pass defaults to the last 180 complete UTC days. Short-lived news and incidents stay in the recap workflow.

## Weekly operator run

Start the owner-only workflow from the configured machine:

```powershell
ssh quily-vps '~/.quily-discord-curation/bin/weekly --plan'
ssh quily-vps '~/.quily-discord-curation/bin/weekly'
```

Run on demand, typically once a week. The default baseline is November 23, 2026 UTC, immediately after the completed editorial pass. The collector fills missing intervals for both authors in both channels through the last complete UTC day. Each page is checkpointed. An interrupted run can be repeated with the same command. A missed week is covered on the next run. The preview reads the ledger without contacting Discord.

The launcher runs on the VPS under the operator account. It supplies the existing bot credential using the approved loader and refreshes the private review batch after successful collection. Use the same VPS ledger when recording decisions. The bundle, launcher and loader live under `~/.quily-discord-curation/bin/`; update the bundle from `scripts/curate-discord/index.ts` when the collector changes.

After collecting, review the pending anchors with the criteria below. Compare durable claims with the previous repository docs and current primary sources. Save the decisions to the VPS ledger with `review-many`, refresh `batch`, and prepare a summary with the covered dates, open questions and proposed edits. Run a local ingestion dry run after the approved edits. Publish and ingest only with separate authorization, then verify live answers and their citations.

To invoke the full editorial workflow in an agent session, use: “Run the private weekly Discord curation workflow in `.agents/docs/discord-knowledge-curation.md`. Collect on the VPS, review the new material and return the editorial batch for approval.”

## Historical backfill and coverage

Start with:

```bash
yarn curate-discord status
```

Confirm the bot can read message text and history in both configured source channels. Check channel names, guild, and access; a zero result is not evidence of no messages until access is confirmed.
Run with the existing `DISCORD_BOT_TOKEN` available to the process through the approved credential loader.

Estimate review volume with a seven-day sample from each channel:

```bash
yarn curate-discord sample
```

Review the sample counts, reconstructed conversations, ambiguous items, and estimated 180-day workload before collecting the full interval. If the volume is too high, prioritize Cassie's 180 days and leave Black Swan pending; if that is still too large, start with Cassie's most recent 60 days and record the older 120 days as pending. Narrow the date range if channel paging is too heavy. These are scope decisions, not reasons to mark unreviewed dates complete.

Collect the agreed interval:

```bash
yarn curate-discord collect
```

Use `--author cassie` or `--author black-swan` to collect only one author's anchors. Use `--from YYYY-MM-DD --to YYYY-MM-DD` for a specific UTC interval, with the end date excluded. A later default run resumes unfinished intervals and otherwise continues from the latest collection end for each channel and author. Use an explicit interval for an older gap.

The collector checkpoints pages to `.quily-discord-curation/ledger.json` in the operator's home directory. The status command shows requested dates, any fetch errors, and which ranges have reviewed anchors. Treat the ledger as private source material. Unthreaded anchors without a common reply chain are separate items with nearby context for manual review. Exclude personal details, logs, and unrelated replies from drafts.

## Reconstruct conversations and triage claims

The source channels are `1212446222367985726` and `1212804347759427654`. Select anchors by author ID, then recover the original question, reply chain, relevant follow-ups, and nearby unthreaded discussion. Follow parent references or readable threads, including context that crosses the date boundary. Mark an item incomplete when missing or ambiguous context could change its meaning.

Apply scope-specific criteria:

- **Cassie** (`597996105300705301`): consider substantive explanations broadly across protocol, products, architecture, and operations. Separate confirmed behavior from intent, estimates, and proposals.
- **Black Swan** (`1215272706577006593`): retain technical guidance only when it applies to node runners generally, including documented prerequisites for a common setup. Require a reusable symptom, explanation, procedure, or diagnostic and state its conditions. A one-machine fix, pasted log, or environment-specific command needs evidence for a broader lesson.

Triage each claim separately, even when several appear in one conversation:

| Decision | Handling |
| --- | --- |
| Durable explanation | Verify, then amend the owning custom doc or propose a new topic doc. |
| Version- or setup-specific guidance | Verify the supported scope; keep that scope beside the advice and record a release or review trigger. |
| Short-lived update or workaround | Leave it to the recap workflow. A temporary workaround may still contain a durable explanation worth extracting. |
| Tentative, unclear, or incomplete | Hold for corroboration or clarification. |
| Duplicate or superseded | Skip and record why existing or later guidance takes precedence. |

Compare candidates with official docs, custom docs, existing recaps, and later evidence. Check release notes or implementation when available. Flag conflicts with official documentation for review.

## Draft, approve, and publish

Prepare a private review batch grouped by topic. For every proposed claim include:

- proposed wording and claim-level decision;
- classification and applicable version/setup scope;
- source message links and dates, plus any relevant conversation context;
- corroboration, conflicts, or missing context;
- proposed action: amend an existing section or create a new topic doc.

Include accepted and rejected examples in the pilot batch so the selection criteria can be checked. Wait for editorial approval of the batch before changing `docs/custom/`. After approval, edit the closest existing topic doc when one owns the subject; otherwise add a focused topic file. Keep Discord provenance next to each claim, with message link and date, since readers may not be able to open Discord. State qualifications in the same section as the guidance so they remain with the ingested chunk. Do not edit official mirrors, generated custom docs, or recap outputs through this workflow.

Save claim decisions in the private ledger with `yarn curate-discord review <conversation-id> <decisions-file>`. The file is a JSON array. Each item requires `claim`, `reason`, `disposition`, `evidenceIds`, and the `anchorIds` it reviews. Supported dispositions are `durable`, `version-specific`, `short-lived`, `tentative`, `duplicate-or-superseded`, and `irrelevant`. Durable and version-specific claims require `targetDoc` and `proposedWording`. Version-specific claims also require `scope` and `reviewTrigger`. Recording an editorial decision updates coverage. Publishing still requires batch approval.

Run `yarn curate-discord batch` to write `review-batch.json` beside the ledger. It groups proposed changes by target document, resolves citations to message links and dates, and lists other decisions and pending conversations for the editor.

Use `yarn curate-discord review-many <decisions-file>` to save a reviewed batch in one operation. The input is a JSON array of entries with `conversationId` and `claims`. Each `claims` array has the same format as the single-conversation command. A validation failure leaves the saved ledger intact.

Before adding a Discord claim, compare it with the repository documentation as it stood before curation and with any newer authoritative source that covers the same feature or version. If the sources disagree or the message describes an implementation whose current state cannot be confirmed, record the uncertainty in the ledger. Reuse the same claim text and anchor IDs to correct an earlier decision.

## Ingest and validate retrieval

Before upload, run the normal ingestion dry run and inspect the affected chunks for wording, scope, and source links. After the approved docs are published and ingested, ask representative questions through Quily's normal retrieval path:

1. Ask about each approved topic and confirm the curated guidance is retrieved with its qualifications and provenance.
2. Include a question where release or setup scope changes the answer.
3. Include a question where the older Discord answer would mislead; confirm the superseded guidance is no longer retrieved from the prior custom-doc chunks.

Record the questions, retrieved sources, and pass/fail result with the private review record. Keep any failed or uncovered ranges pending for a later run.

*Last updated: 2026-11-23*
