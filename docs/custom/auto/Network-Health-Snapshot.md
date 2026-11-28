---
title: "Quilibrium Network Health Snapshot — November 28, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-11-28
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

**Date:** November 28, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-11-28)

## Overview

| Metric | Value |
|---|---|
| World Size | 81.25 GB |
| Total Shards | 165 |
| Peers | 136 |
| Total Workers | 3,726 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 165 | 100.0% |
| Warning (3–5 active provers) | 0 | 0.0% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 0 |
| Ring 1 | 8–15 | 9 |
| Ring 2 | 16–23 | 115 |
| Ring 3+ | 24+ | 41 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 3,487 |
| Joining | 239 |
| Leaving | 144 |
| Rejected | 0 |

## Summary

As of November 28, 2026, the Quilibrium network has 165 total shards. Of these, 165 (100.0%) are healthy, 0 (0.0%) need more coverage, and 0 (0.0%) are at halt risk. The network has 136 peers and 3,726 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
