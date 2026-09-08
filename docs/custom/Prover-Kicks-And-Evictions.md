---
title: "Prover Kicks and Evictions (including the Dashboard's \"Kicked provers\" panel)"
source: Community Contribution (Issue #115), grounded in official protocol docs and a live reading of dashboard.quilibrium.com on 2026-09-08
date: 2026-09-08
type: technical_reference
topics:
  - kick provers
  - kicked provers
  - what is kick provers
  - kick provers dashboard
  - kicked prover
  - ProverKick
  - 0x0307
  - prover kicked
  - why was my prover kicked
  - eviction
  - evicted
  - eviction risk
  - runway
  - prover evicted from shard
  - equivocation
  - conflicting frames
  - double signing
  - signing conflicting frames
  - blacklisted node
  - seniority stripped
  - loss of seniority
  - prover penalties
  - slashing on Quilibrium
  - Quilibrium dashboard panels
  - dashboard.quilibrium.com
---

# Prover Kicks and Evictions

## Short Answer

**"Kicked provers" on the Quilibrium Dashboard is a read-only panel showing provers that the network has forcibly removed.** It is a report, not a button. Nobody using the dashboard can kick anyone. There is no admin control here, and no user-facing action of any kind.

Two different things get confused under the word "kick", and the dashboard shows both in separate panels:

| | **Kicked** | **Evicted** |
|---|---|---|
| Cause | Provable misbehaviour (signing two conflicting frames) | Prolonged inactivity |
| Mechanism | A `ProverKick` message carrying a fraud proof | The "evictor" removes an idle allocation |
| Dashboard panel | **Kicked provers** | **Eviction risk** |
| Blame | Yes, this is punishment | No, this is housekeeping |

If you are a node operator worrying about your own node, the panel that matters to you is almost certainly **Eviction risk**, not **Kicked provers**.

---

## The "Kicked provers" panel

**Observed on dashboard.quilibrium.com on 2026-09-08, at frame 800,444.**

The panel shows a headline count (it read **"0 kicked"** at the time of writing) above a table broken down per shard filter, with these columns:

`Filter` · `Active` · `Joining` · `Paused` · `Leaving` · `Rejected` · `Kicked` · `Other` · `Total`

So despite its name, the panel is really a **prover lifecycle-state census per shard**, headlined by the kick count. The states in those columns are the same ones described in [Epochs and Frames](Epochs-And-Frames.md#prover-lifecycle-states).

A count of zero kicked provers is the healthy, expected reading. Kicks require a proof of misbehaviour, so they should be rare events rather than routine churn.

---

## What a kick actually is at the protocol level

A kick is a message type in the protocol: **`ProverKick`, opcode `0x0307`**, defined in the official [data structures reference](../quilibrium-official/protocol/data-structures.md).

Its payload is the most informative part, because it tells you exactly what a kick is *for*:

```text
[4 bytes] 0x00000307
[8 bytes] frame_number
[n bytes] kicked_prover_public_key
[n bytes] conflicting_frame_1
[n bytes] conflicting_frame_2
[n bytes] commitment
[n bytes] proof
[n bytes] traversal_proof (optional)
```

The message carries **two conflicting frames** plus a cryptographic proof. That makes a kick a **fraud proof**: it is a claim of the form "here is a prover, and here are two mutually contradictory frames it signed, and here is the proof". A kick is not a vote, an opinion, or a moderation decision. It is a submitted piece of evidence that the network can verify for itself.

This is why the official consensus doc lists the countermeasure to **"Nothing at Stake"** as *"economic penalties (through loss of seniority and eviction) for signing conflicting frames"*, and lists **Ejection** as *"removal from prover set for serious violations, complete loss of seniority"* ([consensus.md](../quilibrium-official/protocol/consensus.md)).

### What gets you kicked

**Equivocation.** The official decentralization doc defines it plainly: *"sending conflicting messages/transactions to different parts of the network at the same time"*, and states that a node found doing this *"will be outright blacklisted"* ([how does Quilibrium maintain decentralization](../quilibrium-official/discover/07-how-does-quilibrium-maintain-decentralization.md)).

### What it costs

The same doc spells out the penalty stack for provably misbehaving nodes: they *"get seniority stripped, evicted (kicked from the shard), blacklisted from network participation"*.

That is three separate losses, and the middle one is the expensive one over time:

1. **Seniority stripped.** Seniority can only be earned by running the node correctly for a long period. It cannot be bought and it cannot be transferred. Losing it means starting from zero on a fresh peer ID.
2. **Evicted from the shard.** Immediate loss of the position and its rewards.
3. **Blacklisted.** Barred from network participation.

Because seniority drives bids for higher-earning ring positions, losing it is described in the official docs as *"a staggering loss in potential income"*. The design intent is that misbehaving is never worth it.

### Why one honest prover is enough

The consensus doc notes that the proof system *"ensures one honest prover is sufficient to remove malicious majorities"*. Since a kick is a self-verifying fraud proof, a single honest participant who witnesses the equivocation can submit it. A colluding majority cannot suppress the evidence.

---

## The "Eviction risk" panel (the one operators should watch)

This is a separate panel and a completely different mechanism. Its own on-page description, read live on 2026-09-08:

> *"Active provers accruing inactivity toward eviction, most-at-risk first. Runway is the number of frames of continued inactivity before the evictor removes the allocation."*

Columns: `Prover` · `Shard filter` · `Runway` · `Inactive` · `Last active` · `Risk`.

- **Runway** — how many more frames of continued inactivity remain before the evictor acts. Counted in **frames**, not in time. Lower is more urgent; `0` means no runway left.
- **Inactive** — how many frames the prover has been inactive so far.
- **Last active** — the frame number at which the prover was last seen active.
- **Risk** — a status label. `Pending` was the observed value.

The headline count read **"488 at risk"** at frame 800,444. A number in the hundreds here is normal background churn, not a network emergency: it counts allocations drifting toward cleanup, not nodes being punished.

**Eviction is not a kick.** Nothing about appearing in this panel implies misbehaviour or a fraud proof. Related official language: seniority also *"decays on missed proof intervals"* ([consensus.md](../quilibrium-official/protocol/consensus.md)), so sustained inactivity is costly even before an eviction happens.

---

## Related prover message types

`ProverKick` sits in a family of prover lifecycle messages defined in the same official reference, which is useful context for reading the dashboard's state columns:

| Opcode | Message |
|--------|---------|
| `0x0304` | `ProverResume` |
| `0x0305` | `ProverConfirm` |
| `0x0306` | `ProverReject` |
| `0x0307` | **`ProverKick`** |
| `0x0308` | `ProverUpdate` |

---

## What This Reference Does Not Cover

State these as unknown rather than guessing:

- **Who may submit a `ProverKick`** and whether submission is permissionless. The message format is documented; the submission policy is not.
- **The exact inactivity threshold the evictor uses**, or how `Runway` is computed from it. The dashboard reports the resulting number without publishing the rule.
- **Whether a blacklist is permanent** or has any appeal, recovery or expiry path. The docs say "blacklisted from network participation" and stop there.
- **What the `Risk` column's full set of values is.** Only `Pending` was observed.
- **Whether "Rejected" and "Kicked" in the dashboard's state columns map one-to-one** onto `ProverReject` (`0x0306`) and `ProverKick` (`0x0307`). The naming strongly suggests it, but no source confirms the mapping.
- **Any procedure for a node operator to contest a kick.** Nothing in the documentation describes one.
- **Historical kick counts.** The panel showed a live value of 0; no time series was available.

---

## Sources

- [Official protocol data structures](../quilibrium-official/protocol/data-structures.md) — `ProverKick (0x0307)` wire format and the surrounding prover message family.
- [Official consensus reference](../quilibrium-official/protocol/consensus.md) — penalty system (slashing, reputation, ejection) and the Nothing-at-Stake guarantee.
- [How does Quilibrium maintain decentralization](../quilibrium-official/discover/07-how-does-quilibrium-maintain-decentralization.md) — equivocation definition, blacklisting, and the seniority-loss cost analysis.
- [Epochs and Frames](Epochs-And-Frames.md) — prover lifecycle states, rings and seniority.
- **dashboard.quilibrium.com** — panel names, column layouts, on-page descriptions and live counts read directly from the page on 2026-09-08 at frame 800,444. Live values change constantly; treat the specific numbers here as a snapshot, and the structure as the durable part.

---

*Last updated: 2026-09-08*
