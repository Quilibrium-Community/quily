---
title: "Quilibrium Network Health Snapshot — July 31, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-07-31
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

**Date:** July 31, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-07-31)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 14 |
| Peers | 63 |
| Total Workers | 44 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 0 | 0.0% |
| Warning (3–5 active provers) | 7 | 50.0% |
| Halt Risk (<3 active provers) | 7 | 50.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 14 |
| Ring 1 | 8–15 | 0 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 35 |
| Joining | 9 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of July 31, 2026, the Quilibrium network has 14 total shards. Of these, 0 (0.0%) are healthy, 7 (50.0%) need more coverage, and 7 (50.0%) are at halt risk. The network has 63 peers and 44 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
