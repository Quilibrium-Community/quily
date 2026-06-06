---
title: "Quilibrium Network Health Snapshot — June 6, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-06
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

**Date:** June 6, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-06)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 350 |
| Total Workers | 45,514 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,432 | 77.7% |
| Warning (3–5 active provers) | 632 | 20.2% |
| Halt Risk (<3 active provers) | 68 | 2.2% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,284 |
| Ring 1 | 8–15 | 1,602 |
| Ring 2 | 16–23 | 164 |
| Ring 3+ | 24+ | 47 |
| Unassigned | 0 | 35 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 27,294 |
| Joining | 18,220 |
| Leaving | 2,589 |
| Rejected | 19,737 |

## Summary

As of June 6, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,432 (77.7%) are healthy, 632 (20.2%) need more coverage, and 68 (2.2%) are at halt risk. The network has 350 peers and 45,514 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
