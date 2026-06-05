---
title: "Quilibrium Network Health Snapshot — June 5, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-05
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

**Date:** June 5, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-05)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 344 |
| Total Workers | 45,672 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,455 | 78.4% |
| Warning (3–5 active provers) | 618 | 19.7% |
| Halt Risk (<3 active provers) | 59 | 1.9% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,198 |
| Ring 1 | 8–15 | 1,697 |
| Ring 2 | 16–23 | 155 |
| Ring 3+ | 24+ | 47 |
| Unassigned | 0 | 35 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 27,462 |
| Joining | 18,210 |
| Leaving | 2,358 |
| Rejected | 19,649 |

## Summary

As of June 5, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,455 (78.4%) are healthy, 618 (19.7%) need more coverage, and 59 (1.9%) are at halt risk. The network has 344 peers and 45,672 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
