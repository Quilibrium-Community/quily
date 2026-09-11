---
title: "Quilibrium Network Health Snapshot — September 11, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-09-11
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

**Date:** September 11, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-09-11)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 35 |
| Peers | 113 |
| Total Workers | 212 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 3 | 8.6% |
| Warning (3–5 active provers) | 9 | 25.7% |
| Halt Risk (<3 active provers) | 19 | 54.3% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 31 |
| Ring 1 | 8–15 | 0 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 4 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 75 |
| Joining | 137 |
| Leaving | 59 |
| Rejected | 0 |

## Summary

As of September 11, 2026, the Quilibrium network has 35 total shards. Of these, 3 (8.6%) are healthy, 9 (25.7%) need more coverage, and 19 (54.3%) are at halt risk. The network has 113 peers and 212 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
