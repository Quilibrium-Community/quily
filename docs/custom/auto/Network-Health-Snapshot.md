---
title: "Quilibrium Network Health Snapshot — September 6, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-09-06
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

**Date:** September 6, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-09-06)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 80 |
| Peers | 98 |
| Total Workers | 1,652 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 80 | 100.0% |
| Warning (3–5 active provers) | 0 | 0.0% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 0 |
| Ring 1 | 8–15 | 5 |
| Ring 2 | 16–23 | 61 |
| Ring 3+ | 24+ | 14 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 1,641 |
| Joining | 11 |
| Leaving | 44 |
| Rejected | 0 |

## Summary

As of September 6, 2026, the Quilibrium network has 80 total shards. Of these, 80 (100.0%) are healthy, 0 (0.0%) need more coverage, and 0 (0.0%) are at halt risk. The network has 98 peers and 1,652 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
