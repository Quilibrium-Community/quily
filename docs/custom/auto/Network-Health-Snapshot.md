---
title: "Quilibrium Network Health Snapshot — August 15, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-08-15
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

**Date:** August 15, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-08-15)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 41 |
| Peers | 88 |
| Total Workers | 564 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 14 | 34.1% |
| Warning (3–5 active provers) | 1 | 2.4% |
| Halt Risk (<3 active provers) | 7 | 17.1% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 8 |
| Ring 1 | 8–15 | 0 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 14 |
| Unassigned | 0 | 19 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 484 |
| Joining | 80 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of August 15, 2026, the Quilibrium network has 41 total shards. Of these, 14 (34.1%) are healthy, 1 (2.4%) need more coverage, and 7 (17.1%) are at halt risk. The network has 88 peers and 564 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
