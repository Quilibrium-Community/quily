---
title: "Quilibrium Network Health Snapshot — June 12, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-12
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

**Date:** June 12, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-12)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 565 |
| Total Workers | 52,331 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,997 | 95.7% |
| Warning (3–5 active provers) | 101 | 3.2% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 474 |
| Ring 1 | 8–15 | 2,430 |
| Ring 2 | 16–23 | 151 |
| Ring 3+ | 24+ | 43 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 29,421 |
| Joining | 22,910 |
| Leaving | 4,373 |
| Rejected | 31,688 |

## Summary

As of June 12, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,997 (95.7%) are healthy, 101 (3.2%) need more coverage, and 0 (0.0%) are at halt risk. The network has 565 peers and 52,331 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
