---
title: "Quilibrium Network Health Snapshot — August 3, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-08-03
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

**Date:** August 3, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-08-03)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 14 |
| Peers | 62 |
| Total Workers | 129 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 4 | 28.6% |
| Warning (3–5 active provers) | 10 | 71.4% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 14 |
| Ring 1 | 8–15 | 0 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 73 |
| Joining | 56 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of August 3, 2026, the Quilibrium network has 14 total shards. Of these, 4 (28.6%) are healthy, 10 (71.4%) need more coverage, and 0 (0.0%) are at halt risk. The network has 62 peers and 129 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
