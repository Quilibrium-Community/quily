---
title: "Quilibrium Network Health Snapshot — October 16, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-10-16
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

**Date:** October 16, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-10-16)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 97 |
| Peers | 105 |
| Total Workers | 1,056 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 50 | 51.5% |
| Warning (3–5 active provers) | 42 | 43.3% |
| Halt Risk (<3 active provers) | 4 | 4.1% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 56 |
| Ring 1 | 8–15 | 33 |
| Ring 2 | 16–23 | 7 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 1 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 717 |
| Joining | 339 |
| Leaving | 364 |
| Rejected | 0 |

## Summary

As of October 16, 2026, the Quilibrium network has 97 total shards. Of these, 50 (51.5%) are healthy, 42 (43.3%) need more coverage, and 4 (4.1%) are at halt risk. The network has 105 peers and 1,056 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
