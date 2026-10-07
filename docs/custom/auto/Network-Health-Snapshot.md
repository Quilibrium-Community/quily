---
title: "Quilibrium Network Health Snapshot — October 7, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-10-07
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

**Date:** October 7, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-10-07)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 48 |
| Peers | 105 |
| Total Workers | 1,543 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 46 | 95.8% |
| Warning (3–5 active provers) | 1 | 2.1% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 2 |
| Ring 1 | 8–15 | 9 |
| Ring 2 | 16–23 | 23 |
| Ring 3+ | 24+ | 13 |
| Unassigned | 0 | 1 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 1,030 |
| Joining | 513 |
| Leaving | 211 |
| Rejected | 0 |

## Summary

As of October 7, 2026, the Quilibrium network has 48 total shards. Of these, 46 (95.8%) are healthy, 1 (2.1%) need more coverage, and 0 (0.0%) are at halt risk. The network has 105 peers and 1,543 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
