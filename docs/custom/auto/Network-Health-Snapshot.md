---
title: "Quilibrium Network Health Snapshot — April 3, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-03
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

**Date:** April 3, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-03)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 319 |
| Total Workers | 38,543 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,341 | 75.6% |
| Warning (3–5 active provers) | 492 | 15.9% |
| Halt Risk (<3 active provers) | 265 | 8.6% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Workers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 626 |
| Ring 1 | 8–15 | 1,611 |
| Ring 2 | 16–23 | 729 |
| Ring 3+ | 24+ | 132 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 24,600 |
| Joining | 13,943 |
| Leaving | 1,429 |
| Rejected | 2,146 |

## Summary

As of April 3, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,341 (75.6%) are healthy, 492 (15.9%) need more coverage, and 265 (8.6%) are at halt risk. The network has 319 peers and 38,543 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
