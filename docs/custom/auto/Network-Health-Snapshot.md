---
title: "Quilibrium Network Health Snapshot — August 16, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-08-16
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

**Date:** August 16, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-08-16)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 43 |
| Peers | 91 |
| Total Workers | 621 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 26 | 60.5% |
| Warning (3–5 active provers) | 2 | 4.7% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 12 |
| Ring 1 | 8–15 | 2 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 14 |
| Unassigned | 0 | 15 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 550 |
| Joining | 71 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of August 16, 2026, the Quilibrium network has 43 total shards. Of these, 26 (60.5%) are healthy, 2 (4.7%) need more coverage, and 0 (0.0%) are at halt risk. The network has 91 peers and 621 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
