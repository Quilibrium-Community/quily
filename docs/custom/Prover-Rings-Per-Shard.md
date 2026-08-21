---
title: "Prover Rings Per Shard — How Many Can Exist?"
source: Community Contribution (Issue #70), updated from 2.1 Bloom epoch reference (Issue #112)
date: 2026-08-21
type: faq
topics:
  - prover rings
  - rings per shard
  - shard rings
  - ring count
  - number of rings
  - shard replication
  - prover ring membership
  - ring 0
  - ring 1
  - ring 2
  - ring 3
  - sharded network
  - shard tiers
  - shard structure
  - network growth incentives
  - seniority priority rings
---

# Prover Rings Per Shard

## Short Answer

**The protocol does not impose a documented fixed maximum number of prover rings per shard.** What you actually see on the network (Ring 0, Ring 1, Ring 2, Ring 3+ in network snapshots) is **observational data**, not a protocol-defined cap.

The number of rings around a given shard grows organically as more nodes declare membership for that shard, with priority determined by seniority.

> **As of Quilibrium 2.1 Bloom:** There is no hard cap on rings, but ring depth is bounded *in practice* by re-bundling. A shard bundle **subdivides once it reaches 32 provers**, which is exactly four full rings of eight. Subdivision resets ring assignments on the new sub-bundles, so rings do not grow without limit on a single bundle. Ring membership is also no longer undocumented: `ring = floor(rank / 8)`. See [Epochs and Frames](Epochs-And-Frames.md) for the formulas and the reward consequences.

---

## How Prover Rings Work (Recap)

The Quilibrium network is **sharded across three tiers** (per the 2024-09-09 livestream on network architecture):

- **Tier 1 (global shards):** 256 global shards, ~19 KB total traffic across all of them
- **Tier 2 (core / app shards):** 65,536 core shards (or more — depends on fragmentation)
- **Tier 3 (data blocks):** actual data

> **Historical context (as of 2024-09-09):** The tier numbers above describe the 2.0-era architecture. The 2.1 Bloom reference describes the shard space differently: a **64-ary verkle tree with 4,096 logical shard slots**, grouped into **shard bundles** (~6 GB each, roughly 14 active). These are not contradictory descriptions of the same thing so much as two different eras and two different levels of description. **For anything about current shard structure, prefer the 2.1 figures.**

Each tier can have **prover rings** around it — groups of nodes that verify data at that shard level. Two key dynamics:

1. **Deeper tier = higher reward** (assuming there's data to prove there). This incentivizes nodes to cover the lower, data-heavy layers and provides broad replication.
2. **Seniority = priority.** When a node declares membership in a prover ring, its claim is prioritized based on how long it has been participating in the network.

When a node joins, it declares which under-replicated shards it intends to cover and asks to be inducted into the prover rings for those shards.

---

## Why There Isn't a Documented "Max Rings Per Shard"

The architecture is designed for **maximum replication where it's most needed**. The network's goal is to push nodes toward under-replicated shards, not to cap how many rings can exist:

- More nodes wanting to cover a popular/deep shard → more rings can form
- Few nodes available for a sparse shard → fewer rings, but priority pushes new nodes there
- Fragmentation: when a global shard becomes too large, it fragments, and nodes with priority can pick which fragment-shards they want to cover

What the public livestream and architecture docs explicitly cover:
- Three-tier sharded structure
- Ring-based verification at each tier
- Reward gradient favoring deeper tiers
- Seniority-based priority for ring induction
- Fragmentation as a scaling mechanism

What IS documented as of 2.1 Bloom:
- **How ring membership is assigned:** `ring = floor(rank / 8)`, where rank comes from sorting provers by join frame (ascending), then seniority (descending), then address (ascending). Eight provers per ring.
- **What triggers subdivision:** a shard bundle reaching 32 provers, driven by prover density.
- **The reward consequence of ring position:** rewards are divided by `2^(ring+1)`, so Ring 0 receives 1/2, Ring 1 receives 1/4, and so on.

See [Epochs and Frames](Epochs-And-Frames.md) for the full formulas and their source.

What is STILL not explicitly documented (so the bot should not invent it):
- A specific protocol-level maximum number of rings per shard
- Whether multiple rings on the same shard have differentiated roles
- How seniority itself is accumulated or scored as a value

---

## Observed "Ring N" Categories in Network Snapshots

When you see Ring 0, Ring 1, Ring 2, Ring 3+ in a network snapshot, that's a reflection of the current state — how many rings have actually been instantiated for a given shard — not a protocol-imposed cap. The numbers can change as nodes join, leave, or shift coverage.

---

## Authoritative Sources

- **Livestream 2024-09-09 — Quilibrium 2.0 launch update, network architecture:** the canonical explanation of three-tier sharding, prover rings, seniority, and fragmentation.
- **Livestream 2025-10-24 — Quilibrium 2.1 deep dive:** updated architecture for the 2.1 era, including enrollment and shard assignment.

- **epoch.qstorage.quilibrium.com (2.1 Bloom reference):** ring assignment formula, the 32-prover subdivision threshold, and the ring reward multiplier. Summarised in [Epochs and Frames](Epochs-And-Frames.md).

If you need a definitive answer on a maximum or a protocol cap, the right move is to ask in Discord  — the public docs do not pin this down.

---

*Last updated: 2026-08-21*
