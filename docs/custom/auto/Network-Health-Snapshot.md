---
title: "Quilibrium Network Health Snapshot — May 10, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-10
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

**Date:** May 10, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-10)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 332 |
| Total Workers | 43,838 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,386 | 76.2% |
| Warning (3–5 active provers) | 453 | 14.5% |
| Halt Risk (<3 active provers) | 293 | 9.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,364 |
| Ring 1 | 8–15 | 1,518 |
| Ring 2 | 16–23 | 177 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 27 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,428 |
| Joining | 17,410 |
| Leaving | 2,013 |
| Rejected | 18,795 |

## Summary

As of May 10, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,386 (76.2%) are healthy, 453 (14.5%) need more coverage, and 293 (9.4%) are at halt risk. The network has 332 peers and 43,838 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
