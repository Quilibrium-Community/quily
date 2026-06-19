---
title: "Quilibrium Network Health Snapshot — June 19, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-19
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

**Date:** June 19, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-19)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 351 |
| Total Workers | 61,012 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 3,094 | 98.8% |
| Warning (3–5 active provers) | 4 | 0.1% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 89 |
| Ring 1 | 8–15 | 2,794 |
| Ring 2 | 16–23 | 171 |
| Ring 3+ | 24+ | 44 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 31,530 |
| Joining | 29,482 |
| Leaving | 5,053 |
| Rejected | 41,821 |

## Summary

As of June 19, 2026, the Quilibrium network has 3,132 total shards. Of these, 3,094 (98.8%) are healthy, 4 (0.1%) need more coverage, and 0 (0.0%) are at halt risk. The network has 351 peers and 61,012 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
