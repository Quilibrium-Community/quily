---
title: "Quilibrium Network Health Snapshot — August 30, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-08-30
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

**Date:** August 30, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-08-30)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 22 |
| Peers | 93 |
| Total Workers | 278 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 8 | 36.4% |
| Warning (3–5 active provers) | 0 | 0.0% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 0 |
| Ring 1 | 8–15 | 2 |
| Ring 2 | 16–23 | 3 |
| Ring 3+ | 24+ | 3 |
| Unassigned | 0 | 14 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 278 |
| Joining | 0 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of August 30, 2026, the Quilibrium network has 22 total shards. Of these, 8 (36.4%) are healthy, 0 (0.0%) need more coverage, and 0 (0.0%) are at halt risk. The network has 93 peers and 278 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
