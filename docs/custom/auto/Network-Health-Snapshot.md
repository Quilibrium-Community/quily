---
title: "Quilibrium Network Health Snapshot — June 15, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-15
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

**Date:** June 15, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-15)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 318 |
| Total Workers | 57,460 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 3,079 | 98.3% |
| Warning (3–5 active provers) | 19 | 0.6% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 141 |
| Ring 1 | 8–15 | 2,756 |
| Ring 2 | 16–23 | 157 |
| Ring 3+ | 24+ | 44 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 30,789 |
| Joining | 26,671 |
| Leaving | 4,836 |
| Rejected | 35,880 |

## Summary

As of June 15, 2026, the Quilibrium network has 3,132 total shards. Of these, 3,079 (98.3%) are healthy, 19 (0.6%) need more coverage, and 0 (0.0%) are at halt risk. The network has 318 peers and 57,460 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
