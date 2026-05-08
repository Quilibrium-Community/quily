---
title: "Quilibrium Network Health Snapshot — May 8, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-08
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

**Date:** May 8, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-08)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 321 |
| Total Workers | 43,489 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,385 | 76.1% |
| Warning (3–5 active provers) | 455 | 14.5% |
| Halt Risk (<3 active provers) | 292 | 9.3% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,361 |
| Ring 1 | 8–15 | 1,522 |
| Ring 2 | 16–23 | 169 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,311 |
| Joining | 17,178 |
| Leaving | 2,047 |
| Rejected | 18,453 |

## Summary

As of May 8, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,385 (76.1%) are healthy, 455 (14.5%) need more coverage, and 292 (9.3%) are at halt risk. The network has 321 peers and 43,489 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
