---
title: "Quilibrium Network Health Snapshot — May 3, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-03
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

**Date:** May 3, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-03)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 448 |
| Total Workers | 43,292 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,377 | 76.7% |
| Warning (3–5 active provers) | 460 | 14.8% |
| Halt Risk (<3 active provers) | 261 | 8.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,386 |
| Ring 1 | 8–15 | 1,490 |
| Ring 2 | 16–23 | 176 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,282 |
| Joining | 17,010 |
| Leaving | 1,876 |
| Rejected | 9,421 |

## Summary

As of May 3, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,377 (76.7%) are healthy, 460 (14.8%) need more coverage, and 261 (8.4%) are at halt risk. The network has 448 peers and 43,292 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
