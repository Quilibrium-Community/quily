---
title: "Quilibrium Network Health Snapshot — July 14, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-07-14
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

**Date:** July 14, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-07-14)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 49 |
| Peers | 113 |
| Total Workers | 118 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 0 | 0.0% |
| Warning (3–5 active provers) | 11 | 22.4% |
| Halt Risk (<3 active provers) | 38 | 77.6% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 49 |
| Ring 1 | 8–15 | 0 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 118 |
| Joining | 0 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of July 14, 2026, the Quilibrium network has 49 total shards. Of these, 0 (0.0%) are healthy, 11 (22.4%) need more coverage, and 38 (77.6%) are at halt risk. The network has 113 peers and 118 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
