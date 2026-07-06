---
title: "Quilibrium Network Health Snapshot — July 6, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-07-06
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

**Date:** July 6, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-07-06)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 49 |
| Peers | 117 |
| Total Workers | 635 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 0 | 0.0% |
| Warning (3–5 active provers) | 7 | 14.3% |
| Halt Risk (<3 active provers) | 8 | 16.3% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 15 |
| Ring 1 | 8–15 | 0 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 31 |
| Joining | 604 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of July 6, 2026, the Quilibrium network has 49 total shards. Of these, 0 (0.0%) are healthy, 7 (14.3%) need more coverage, and 8 (16.3%) are at halt risk. The network has 117 peers and 635 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
