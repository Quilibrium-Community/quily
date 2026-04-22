---
title: "Quilibrium Network Health Snapshot — April 22, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-22
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

**Date:** April 22, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-22)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 411 |
| Total Workers | 41,956 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,369 | 76.5% |
| Warning (3–5 active provers) | 470 | 15.2% |
| Halt Risk (<3 active provers) | 259 | 8.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,479 |
| Ring 1 | 8–15 | 1,397 |
| Ring 2 | 16–23 | 175 |
| Ring 3+ | 24+ | 47 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 25,933 |
| Joining | 16,023 |
| Leaving | 1,693 |
| Rejected | 4,986 |

## Summary

As of April 22, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,369 (76.5%) are healthy, 470 (15.2%) need more coverage, and 259 (8.4%) are at halt risk. The network has 411 peers and 41,956 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
