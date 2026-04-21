---
title: "Quilibrium Network Health Snapshot — April 21, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-21
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

**Date:** April 21, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-21)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 408 |
| Total Workers | 41,754 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,361 | 76.2% |
| Warning (3–5 active provers) | 478 | 15.4% |
| Halt Risk (<3 active provers) | 259 | 8.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,519 |
| Ring 1 | 8–15 | 1,357 |
| Ring 2 | 16–23 | 175 |
| Ring 3+ | 24+ | 47 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 25,810 |
| Joining | 15,944 |
| Leaving | 1,693 |
| Rejected | 4,986 |

## Summary

As of April 21, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,361 (76.2%) are healthy, 478 (15.4%) need more coverage, and 259 (8.4%) are at halt risk. The network has 408 peers and 41,754 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
