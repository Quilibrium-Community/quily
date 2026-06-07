---
title: "Quilibrium Network Health Snapshot — June 7, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-07
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

**Date:** June 7, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-07)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 351 |
| Total Workers | 45,849 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,436 | 77.8% |
| Warning (3–5 active provers) | 648 | 20.7% |
| Halt Risk (<3 active provers) | 48 | 1.5% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,240 |
| Ring 1 | 8–15 | 1,652 |
| Ring 2 | 16–23 | 159 |
| Ring 3+ | 24+ | 47 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 27,447 |
| Joining | 18,402 |
| Leaving | 2,451 |
| Rejected | 19,931 |

## Summary

As of June 7, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,436 (77.8%) are healthy, 648 (20.7%) need more coverage, and 48 (1.5%) are at halt risk. The network has 351 peers and 45,849 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
