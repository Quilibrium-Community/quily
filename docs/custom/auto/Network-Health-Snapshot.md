---
title: "Quilibrium Network Health Snapshot — May 21, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-21
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

**Date:** May 21, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-21)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 280 |
| Total Workers | 44,323 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,390 | 76.3% |
| Warning (3–5 active provers) | 479 | 15.3% |
| Halt Risk (<3 active provers) | 263 | 8.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,336 |
| Ring 1 | 8–15 | 1,539 |
| Ring 2 | 16–23 | 176 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 35 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,672 |
| Joining | 17,651 |
| Leaving | 2,058 |
| Rejected | 18,959 |

## Summary

As of May 21, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,390 (76.3%) are healthy, 479 (15.3%) need more coverage, and 263 (8.4%) are at halt risk. The network has 280 peers and 44,323 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
