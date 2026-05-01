---
title: "Quilibrium Current Network Status"
source: Community Compilation (Issues #64, #66)
date: 2026-05-01
type: guide
topics:
  - network status
  - mainnet
  - shard-out
  - token utility
  - mining rewards
  - transactions
---

# Quilibrium Current Network Status

**Last updated:** May 1, 2026

## Summary

Quilibrium 2.1 was released to mainnet on **April 14, 2025**. The network is live and operational, but it is **NOT yet fully launched**. Several core features remain disabled until the multi-shard transition ("shard-out") completes.

## What Works Now

| Feature | Status | Notes |
|---|---|---|
| **Q Name Service (QNS)** | ✅ Functional | Private identity layer |
| **QStorage** | ✅ Functional | Encrypted storage service |
| **Quorum messaging** | ✅ Functional | P2P messenger running on the network |
| **Node operation** | ✅ Functional | Running a node contributes to network coverage |
| **Alt-fee basis app shards** | ✅ Available | Services can launch while token shards are still resolving |

## What Does NOT Work Yet

| Feature | Status | When It Will Work |
|---|---|---|
| **Token transfers** | ❌ Disabled | After shard-out completes |
| **Transaction processing** | ❌ Disabled | After shard-out completes |
| **Mining rewards** | ❌ Not active | After shard-out completes |
| **Full token utility** | ❌ Not active | After shard-out completes |
| **Permissionless app deployment** | ❌ Not available | After sharding is fully enabled |

## Shard-Out: The Final Milestone

The shard-out transition is the process of migrating the network from its current state to full multi-shard operation. Until this completes:

- The QUIL token shards remain locked
- Transaction processing cannot begin
- Mining rewards cannot be distributed
- Full decentralization (beacon decommissioning) is pending

## Live Network Metrics

For current quantitative network metrics (shard counts, worker numbers, halt-risk status, etc.), see the auto-generated snapshot:

- **`docs/custom/auto/Network-Health-Snapshot.md`** — updated daily from the Quilibrium Explorer API

This document covers qualitative network status only (what works, what doesn't, and common confusion), which changes on a slower timescale than daily metrics.

## Common Confusion

### "Is the network live on mainnet?"
Yes — Quilibrium 2.1 is on mainnet and has been since April 2025. However, "live on mainnet" does not mean all features are active. The network is operational for QNS, QStorage, and Quorum, but financial/token features remain disabled until shard-out.

### "When will tokens/transactions/mining work?"
These will activate when the shard-out process completes and 100% shard coverage is achieved. There is no announced date; progress is tracked via the network explorer and Discord dev-updates.

## Sources

- Discord dev-updates (ongoing)
- March 30, 2026 livestream: Quilibrium State of the Union (MetaVM & MegaRPC)
- Community issue reports #64 and #66
