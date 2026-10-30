---
title: "Quilibrium Network Health Snapshot — October 30, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-10-30
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

**Date:** October 30, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-10-30)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.93 GB |
| Total Shards | 106 |
| Peers | 106 |
| Total Workers | 2,496 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 105 | 99.1% |
| Warning (3–5 active provers) | 1 | 0.9% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1 |
| Ring 1 | 8–15 | 17 |
| Ring 2 | 16–23 | 56 |
| Ring 3+ | 24+ | 32 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 2,148 |
| Joining | 348 |
| Leaving | 144 |
| Rejected | 0 |

## Summary

As of October 30, 2026, the Quilibrium network has 106 total shards. Of these, 105 (99.1%) are healthy, 1 (0.9%) need more coverage, and 0 (0.0%) are at halt risk. The network has 106 peers and 2,496 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
