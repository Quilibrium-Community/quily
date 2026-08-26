---
title: "Quilibrium Network Health Snapshot — August 26, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-08-26
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

**Date:** August 26, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-08-26)

## Overview

| Metric | Value |
|---|---|
| World Size | 0 B |
| Total Shards | 76 |
| Peers | 86 |
| Total Workers | 391 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 36 | 47.4% |
| Warning (3–5 active provers) | 12 | 15.8% |
| Halt Risk (<3 active provers) | 25 | 32.9% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 51 |
| Ring 1 | 8–15 | 21 |
| Ring 2 | 16–23 | 1 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 3 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 387 |
| Joining | 4 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of August 26, 2026, the Quilibrium network has 76 total shards. Of these, 36 (47.4%) are healthy, 12 (15.8%) need more coverage, and 25 (32.9%) are at halt risk. The network has 86 peers and 391 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
