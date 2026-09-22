---
title: "Quilibrium Network Health Snapshot — September 22, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-09-22
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

**Date:** September 22, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-09-22)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 23 |
| Peers | 117 |
| Total Workers | 553 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 5 | 21.7% |
| Warning (3–5 active provers) | 17 | 73.9% |
| Halt Risk (<3 active provers) | 1 | 4.3% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 20 |
| Ring 1 | 8–15 | 3 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 111 |
| Joining | 442 |
| Leaving | 243 |
| Rejected | 0 |

## Summary

As of September 22, 2026, the Quilibrium network has 23 total shards. Of these, 5 (21.7%) are healthy, 17 (73.9%) need more coverage, and 1 (4.3%) are at halt risk. The network has 117 peers and 553 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
