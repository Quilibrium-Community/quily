---
title: "Quilibrium Network Health Snapshot — June 11, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-11
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

**Date:** June 11, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-11)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 483 |
| Total Workers | 49,913 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,742 | 87.5% |
| Warning (3–5 active provers) | 356 | 11.4% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 743 |
| Ring 1 | 8–15 | 2,161 |
| Ring 2 | 16–23 | 151 |
| Ring 3+ | 24+ | 43 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 28,219 |
| Joining | 21,694 |
| Leaving | 3,696 |
| Rejected | 27,871 |

## Summary

As of June 11, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,742 (87.5%) are healthy, 356 (11.4%) need more coverage, and 0 (0.0%) are at halt risk. The network has 483 peers and 49,913 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
