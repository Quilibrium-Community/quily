---
title: "Epochs and Frames: How Quilibrium's Protocol Clock Works"
source: Community reference (epoch.qstorage.quilibrium.com) via Issue #112
date: 2026-08-21
type: technical_reference
topics:
  - epoch
  - epochs
  - what is an epoch
  - how long is an epoch
  - how many frames in an epoch
  - epoch size
  - frames per epoch
  - 720 frames
  - frame
  - frames
  - frame number
  - frame time
  - epoch boundary
  - next epoch
  - current epoch
  - how do I calculate the epoch
  - epoch formula
  - protocol clock
  - three-epoch pipeline
  - propose settle effect
  - why is my node still joining
  - why am I not active yet
  - how long until my worker is active
  - prover status
  - joining status
  - active status
  - ExpiredJoin
  - leaving the network
  - re-confirm
  - prover ring
  - ring assignment
  - how is my ring calculated
  - ring 0
  - reward formula
  - how are rewards calculated
  - ring multiplier
  - data dilution
  - shard bundle
  - re-bundling
  - 32 provers
  - verkle tree
  - logical shards
---

# Epochs and Frames

## Short Answer

**One epoch is 720 frames on mainnet** (60 frames on testnet).

```
epoch = floor(frame / 720)
```

So frames 0-719 are Epoch 0, frames 720-1439 are Epoch 1, and so on. Frame numbers count up forever and never reset at an epoch boundary.

At the 10-second frame time the network has been holding since August 2026, **720 frames works out to roughly 2 hours per epoch**. Frame time is an observed network condition rather than a fixed protocol constant, so treat the 2-hour figure as derived from a 10s frame time, not as a guaranteed epoch duration.

The guiding principle from the reference: nothing on Quilibrium happens instantly. Everything follows the epoch clock.

---

## Epoch Boundaries

Epoch size is fixed. **How far you are from the next boundary is not.** Because frame numbers run continuously, the distance to the next boundary depends entirely on where in the current epoch you currently sit:

```
frames until next epoch = 720 - (frame mod 720)
```

That figure moves constantly and can be anywhere from 1 to 720 frames.

This matters when reading status updates. A statement like "the next epoch is ~113 frames away, about 19 minutes" is describing **a node's position at that moment**, not the length of an epoch. Epoch length is always 720 frames on mainnet, which is roughly 2 hours at a 10-second frame time.

---

## The Three-Epoch Pipeline

Joining the network is not immediate. A join moves through three epochs:

| Epoch | Stage | What happens |
|-------|-------|--------------|
| E | **Propose** | You submit the join request. Status reads `Joining`. |
| E+1 | **Settle** | The network confirms the join. Status still reads `Joining` (this is "deferred activation"). |
| E+2 | **Effect** | You become `Active` and start earning. |

This is why a node can look stuck on `Joining` for a while and still be perfectly healthy. At a 10s frame time, the full propose-to-active path spans roughly two epoch boundaries, so on the order of a few hours depending on where in the epoch the request landed.

**The confirm window is exactly one epoch.** If the confirmation in E+1 is missed, the action expires rather than carrying over.

---

## Prover Lifecycle States

| State | Meaning |
|-------|---------|
| `Joining` | Join submitted (epoch E), or confirmed but not yet effective (epoch E+1). |
| `Active` | Live from epoch E+2 onward. Proving and earning. |
| `ExpiredJoin` | The E+1 confirmation window was missed and the join expired. |
| `Leaving` | A leave request is working through the same E to E+2 sequence. |
| `ExpiredLeave` | The leave sequence lapsed. |
| `Paused` / `Rejected` / `Kicked` | Terminal or administrative states. |

**Re-confirmation is recurring, not one-time.** For data-shard participation, if `registeredEpoch < currentEpoch` you must re-confirm each epoch. This is an ongoing obligation, not something you do once at join time.

---

## Rings

A prover's ring is derived from its position in the sorted prover list:

```
ring = floor(rank / 8)
```

Eight provers fill a ring, so ranks 0-7 are Ring 0, ranks 8-15 are Ring 1, and so on.

The sort that produces `rank` uses three keys in order:

1. **Join frame**, ascending. Earlier joiners rank higher.
2. **Seniority**, descending. Higher seniority ranks higher.
3. **Address**, ascending. Tie-breaker only.

Seniority itself is a pre-existing per-prover attribute accumulated on-chain against the prover key. See the [node key management guide](gap-analysis/Node-Key-Management-Guide.md) for how seniority is tied to keys rather than peer IDs.

**Ring assignments are not permanent.** When a shard bundle subdivides, ring assignments reset on the new sub-bundles.

---

## Rewards

```
per_prover = (basis × shardSize/worldBytes) / (2^(ring+1) × √(dataShards) × 8)
```

Term by term:

- **`basis`** is the total reward pool for the frame.
- **`shardSize / worldBytes`** is your shard's share of total network data.
- **`2^(ring+1)`** is the ring penalty. Ring 0 gets 1/2, Ring 1 gets 1/4, Ring 2 gets 1/8, and so on. Being in a low ring matters a great deal.
- **`√(dataShards)`** is data dilution. `dataShards` is the **leaf count in the merkle tree** (accumulated state), **not** the number of provers. As the network accumulates more data, rewards thin for everyone.
- **`/ 8`** splits the result among the maximum 8 provers in a ring.

The practical takeaway: reward per prover falls as the network's stored state grows, and ring position dominates through the exponential penalty term.

---

## Shards and Bundles

- A **shard** is a logical division in a **64-ary verkle tree**, giving **4,096 possible logical shard slots**.
- A **shard bundle** groups logical shards under one unit identifier. As of the 2.1 Bloom reference, bundles run around **6 GB** each with roughly **14 active**.
- **Re-bundling (subdivision) triggers at 32 provers** on a bundle, because 32 is exactly four full rings of 8.
- Subdivision is **driven by prover density**, not by data volume alone.
- **No data moves during re-bundling.** Only the grouping changes, and ring assignments reset on the new sub-bundles.

---

## Architecture Context

- **Master process (core 0)** handles global consensus, system-wide coordination, and global execution.
- **Workers (cores 1+)** are each a complete stack doing shard-level frame proving and data storage.

Note that "prover" and "worker" are used loosely in community discussion. In this reference, a worker is a process occupying a core within a node, while prover refers to the network participant that holds a rank, ring and seniority.

Quilibrium 2.1 prioritises **memory and storage per worker** over raw CPU count. PoMW (Proof of Meaningful Work) covers VDFs, hypergraph operations and routing.

---

## What This Reference Does Not Cover

State these as unknown rather than guessing:

- Frame duration is not defined as a protocol constant anywhere in this source. The 10s figure is observed network behaviour reported in Discord during August 2026.
- The full list of events that fire at an epoch boundary beyond the join/leave/confirm pipeline.
- How shard **enrollment** (choosing which shard to cover) interacts with the epoch clock. For enrollment mechanics see the [official shard enrollment process](../quilibrium-official/run-node/shard-enrollment-process.md).
- Any command or tool for querying the current epoch directly.
- A formal definition of how seniority is accumulated or scored.

---

## Sources

- **epoch.qstorage.quilibrium.com** — community reference guide for the epoch and shard system, self-labelled "Quilibrium 2.1 Bloom — PQ / .25". Sections: Time, Architecture, Shards, Economics, Lifecycle, Summary. This is hosted on Quilibrium infrastructure but is not part of the official docs at docs.quilibrium.com, so prefer official docs where the two overlap.

---

*Last updated: 2026-08-21*
