---
title: "Quilibrium Network Health Snapshot — May 15, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-15
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

**Date:** May 15, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-15)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 346 |
| Total Workers | 43,966 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,387 | 76.2% |
| Warning (3–5 active provers) | 454 | 14.5% |
| Halt Risk (<3 active provers) | 291 | 9.3% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,357 |
| Ring 1 | 8–15 | 1,526 |
| Ring 2 | 16–23 | 176 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 27 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,502 |
| Joining | 17,464 |
| Leaving | 2,044 |
| Rejected | 18,849 |

## Summary

As of May 15, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,387 (76.2%) are healthy, 454 (14.5%) need more coverage, and 291 (9.3%) are at halt risk. The network has 346 peers and 43,966 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
