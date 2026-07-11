---
title: "Quilibrium Network Health Snapshot — July 11, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-07-11
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

**Date:** July 11, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-07-11)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 49 |
| Peers | 101 |
| Total Workers | 1,788 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 49 | 100.0% |
| Warning (3–5 active provers) | 0 | 0.0% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 27 |
| Ring 1 | 8–15 | 22 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 413 |
| Joining | 1,375 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of July 11, 2026, the Quilibrium network has 49 total shards. Of these, 49 (100.0%) are healthy, 0 (0.0%) need more coverage, and 0 (0.0%) are at halt risk. The network has 101 peers and 1,788 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
