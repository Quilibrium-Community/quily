---
title: "Quilibrium Network Health Snapshot — June 16, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-16
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

**Date:** June 16, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-16)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 280 |
| Total Workers | 57,556 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 3,089 | 98.6% |
| Warning (3–5 active provers) | 9 | 0.3% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 104 |
| Ring 1 | 8–15 | 2,793 |
| Ring 2 | 16–23 | 157 |
| Ring 3+ | 24+ | 44 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 30,773 |
| Joining | 26,783 |
| Leaving | 4,940 |
| Rejected | 37,124 |

## Summary

As of June 16, 2026, the Quilibrium network has 3,132 total shards. Of these, 3,089 (98.6%) are healthy, 9 (0.3%) need more coverage, and 0 (0.0%) are at halt risk. The network has 280 peers and 57,556 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
