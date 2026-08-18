---
title: "Quilibrium Network Health Snapshot — August 18, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-08-18
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

**Date:** August 18, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-08-18)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 40 |
| Peers | 83 |
| Total Workers | 685 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 28 | 70.0% |
| Warning (3–5 active provers) | 0 | 0.0% |
| Halt Risk (<3 active provers) | 4 | 10.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 7 |
| Ring 1 | 8–15 | 11 |
| Ring 2 | 16–23 | 6 |
| Ring 3+ | 24+ | 8 |
| Unassigned | 0 | 8 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 447 |
| Joining | 238 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of August 18, 2026, the Quilibrium network has 40 total shards. Of these, 28 (70.0%) are healthy, 0 (0.0%) need more coverage, and 4 (10.0%) are at halt risk. The network has 83 peers and 685 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
