---
title: "Quilibrium Network Health Snapshot — June 9, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-09
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

**Date:** June 9, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-09)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 365 |
| Total Workers | 45,860 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,422 | 77.3% |
| Warning (3–5 active provers) | 672 | 21.5% |
| Halt Risk (<3 active provers) | 4 | 0.1% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,175 |
| Ring 1 | 8–15 | 1,725 |
| Ring 2 | 16–23 | 154 |
| Ring 3+ | 24+ | 44 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,876 |
| Joining | 18,984 |
| Leaving | 3,215 |
| Rejected | 21,395 |

## Summary

As of June 9, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,422 (77.3%) are healthy, 672 (21.5%) need more coverage, and 4 (0.1%) are at halt risk. The network has 365 peers and 45,860 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
