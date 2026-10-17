---
title: "Quilibrium Network Health Snapshot — October 17, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-10-17
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

**Date:** October 17, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-10-17)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 98 |
| Peers | 112 |
| Total Workers | 2,307 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 96 | 98.0% |
| Warning (3–5 active provers) | 1 | 1.0% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1 |
| Ring 1 | 8–15 | 17 |
| Ring 2 | 16–23 | 28 |
| Ring 3+ | 24+ | 51 |
| Unassigned | 0 | 1 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 2,127 |
| Joining | 180 |
| Leaving | 134 |
| Rejected | 0 |

## Summary

As of October 17, 2026, the Quilibrium network has 98 total shards. Of these, 96 (98.0%) are healthy, 1 (1.0%) need more coverage, and 0 (0.0%) are at halt risk. The network has 112 peers and 2,307 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
