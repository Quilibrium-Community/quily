---
title: "Quilibrium Network Health Snapshot — April 10, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-10
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

**Date:** April 10, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-10)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 375 |
| Total Workers | 40,854 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,352 | 75.9% |
| Warning (3–5 active provers) | 481 | 15.5% |
| Halt Risk (<3 active provers) | 265 | 8.6% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Workers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1 |
| Ring 1 | 8–15 | 1,845 |
| Ring 2 | 16–23 | 1,103 |
| Ring 3+ | 24+ | 149 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 25,563 |
| Joining | 15,291 |
| Leaving | 1,649 |
| Rejected | 4,967 |

## Summary

As of April 10, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,352 (75.9%) are healthy, 481 (15.5%) need more coverage, and 265 (8.6%) are at halt risk. The network has 375 peers and 40,854 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
