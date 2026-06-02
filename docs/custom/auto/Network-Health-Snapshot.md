---
title: "Quilibrium Network Health Snapshot — June 2, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-02
type: network_status
topics:
  - network health
  - network status
  - shard health
  - peers
  - workers
  - stats
  - current status
  - latest update
  - network update
---

# Quilibrium Network Health Snapshot

**Date:** June 2, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-02)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 323 |
| Total Workers | 45,319 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,415 | 77.1% |
| Warning (3–5 active provers) | 661 | 21.1% |
| Halt Risk (<3 active provers) | 56 | 1.8% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,285 |
| Ring 1 | 8–15 | 1,597 |
| Ring 2 | 16–23 | 169 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 35 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 27,290 |
| Joining | 18,029 |
| Leaving | 2,132 |
| Rejected | 19,367 |

## Summary

As of June 2, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,415 (77.1%) are healthy, 661 (21.1%) need more coverage, and 56 (1.8%) are at halt risk. The network has 323 peers and 45,319 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
