---
title: "Quilibrium Network Health Snapshot — June 10, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-10
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

**Date:** June 10, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-10)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 419 |
| Total Workers | 47,120 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,497 | 79.7% |
| Warning (3–5 active provers) | 600 | 19.2% |
| Halt Risk (<3 active provers) | 1 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,009 |
| Ring 1 | 8–15 | 1,894 |
| Ring 2 | 16–23 | 152 |
| Ring 3+ | 24+ | 43 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 27,090 |
| Joining | 20,030 |
| Leaving | 3,272 |
| Rejected | 24,462 |

## Summary

As of June 10, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,497 (79.7%) are healthy, 600 (19.2%) need more coverage, and 1 (0.0%) are at halt risk. The network has 419 peers and 47,120 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
