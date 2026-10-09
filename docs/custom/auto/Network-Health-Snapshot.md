---
title: "Quilibrium Network Health Snapshot — October 9, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-10-09
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

**Date:** October 9, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-10-09)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 77 |
| Peers | 104 |
| Total Workers | 1,863 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 76 | 98.7% |
| Warning (3–5 active provers) | 0 | 0.0% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1 |
| Ring 1 | 8–15 | 18 |
| Ring 2 | 16–23 | 26 |
| Ring 3+ | 24+ | 31 |
| Unassigned | 0 | 1 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 1,605 |
| Joining | 258 |
| Leaving | 51 |
| Rejected | 0 |

## Summary

As of October 9, 2026, the Quilibrium network has 77 total shards. Of these, 76 (98.7%) are healthy, 0 (0.0%) need more coverage, and 0 (0.0%) are at halt risk. The network has 104 peers and 1,863 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
