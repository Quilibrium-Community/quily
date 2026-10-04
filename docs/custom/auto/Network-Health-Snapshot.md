---
title: "Quilibrium Network Health Snapshot — October 4, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-10-04
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

**Date:** October 4, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-10-04)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 26 |
| Peers | 92 |
| Total Workers | 1,063 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 26 | 100.0% |
| Warning (3–5 active provers) | 0 | 0.0% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 0 |
| Ring 1 | 8–15 | 2 |
| Ring 2 | 16–23 | 5 |
| Ring 3+ | 24+ | 19 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 906 |
| Joining | 157 |
| Leaving | 42 |
| Rejected | 0 |

## Summary

As of October 4, 2026, the Quilibrium network has 26 total shards. Of these, 26 (100.0%) are healthy, 0 (0.0%) need more coverage, and 0 (0.0%) are at halt risk. The network has 92 peers and 1,063 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
