---
title: "Quilibrium Network Health Snapshot — October 3, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-10-03
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

**Date:** October 3, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-10-03)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 26 |
| Peers | 89 |
| Total Workers | 855 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 22 | 84.6% |
| Warning (3–5 active provers) | 4 | 15.4% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 4 |
| Ring 1 | 8–15 | 6 |
| Ring 2 | 16–23 | 16 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 380 |
| Joining | 475 |
| Leaving | 592 |
| Rejected | 0 |

## Summary

As of October 3, 2026, the Quilibrium network has 26 total shards. Of these, 22 (84.6%) are healthy, 4 (15.4%) need more coverage, and 0 (0.0%) are at halt risk. The network has 89 peers and 855 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
