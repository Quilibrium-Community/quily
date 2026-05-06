---
title: "Quilibrium Network Health Snapshot — May 6, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-06
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

**Date:** May 6, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-06)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 299 |
| Total Workers | 43,389 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,386 | 77.0% |
| Warning (3–5 active provers) | 454 | 14.7% |
| Halt Risk (<3 active provers) | 258 | 8.3% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,360 |
| Ring 1 | 8–15 | 1,513 |
| Ring 2 | 16–23 | 179 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,391 |
| Joining | 16,998 |
| Leaving | 1,883 |
| Rejected | 17,836 |

## Summary

As of May 6, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,386 (77.0%) are healthy, 454 (14.7%) need more coverage, and 258 (8.3%) are at halt risk. The network has 299 peers and 43,389 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
