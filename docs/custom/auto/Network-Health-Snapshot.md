---
title: "Quilibrium Network Health Snapshot — October 18, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-10-18
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

**Date:** October 18, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-10-18)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 99 |
| Peers | 115 |
| Total Workers | 2,297 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 97 | 98.0% |
| Warning (3–5 active provers) | 1 | 1.0% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1 |
| Ring 1 | 8–15 | 16 |
| Ring 2 | 16–23 | 32 |
| Ring 3+ | 24+ | 49 |
| Unassigned | 0 | 1 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 2,208 |
| Joining | 89 |
| Leaving | 58 |
| Rejected | 0 |

## Summary

As of October 18, 2026, the Quilibrium network has 99 total shards. Of these, 97 (98.0%) are healthy, 1 (1.0%) need more coverage, and 0 (0.0%) are at halt risk. The network has 115 peers and 2,297 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
