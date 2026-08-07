---
title: "Quilibrium Network Health Snapshot — August 7, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-08-07
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

**Date:** August 7, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-08-07)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 14 |
| Peers | 71 |
| Total Workers | 100 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 13 | 92.9% |
| Warning (3–5 active provers) | 1 | 7.1% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 14 |
| Ring 1 | 8–15 | 0 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 86 |
| Joining | 14 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of August 7, 2026, the Quilibrium network has 14 total shards. Of these, 13 (92.9%) are healthy, 1 (7.1%) need more coverage, and 0 (0.0%) are at halt risk. The network has 71 peers and 100 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
