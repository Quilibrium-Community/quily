---
title: "Quilibrium Network Health Snapshot — August 31, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-08-31
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

**Date:** August 31, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-08-31)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 48 |
| Peers | 96 |
| Total Workers | 1,308 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 27 | 56.3% |
| Warning (3–5 active provers) | 2 | 4.2% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 2 |
| Ring 1 | 8–15 | 0 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 27 |
| Unassigned | 0 | 19 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 1,219 |
| Joining | 89 |
| Leaving | 1 |
| Rejected | 0 |

## Summary

As of August 31, 2026, the Quilibrium network has 48 total shards. Of these, 27 (56.3%) are healthy, 2 (4.2%) need more coverage, and 0 (0.0%) are at halt risk. The network has 96 peers and 1,308 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
