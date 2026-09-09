---
title: "Quilibrium Network Health Snapshot — September 9, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-09-09
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

**Date:** September 9, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-09-09)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 91 |
| Peers | 111 |
| Total Workers | 1,487 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 82 | 90.1% |
| Warning (3–5 active provers) | 8 | 8.8% |
| Halt Risk (<3 active provers) | 1 | 1.1% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 29 |
| Ring 1 | 8–15 | 61 |
| Ring 2 | 16–23 | 1 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 793 |
| Joining | 694 |
| Leaving | 454 |
| Rejected | 0 |

## Summary

As of September 9, 2026, the Quilibrium network has 91 total shards. Of these, 82 (90.1%) are healthy, 8 (8.8%) need more coverage, and 1 (1.1%) are at halt risk. The network has 111 peers and 1,487 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
