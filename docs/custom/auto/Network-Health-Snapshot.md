---
title: "Quilibrium Network Health Snapshot — July 19, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-07-19
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

**Date:** July 19, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-07-19)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 49 |
| Peers | 127 |
| Total Workers | 138 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 9 | 18.4% |
| Warning (3–5 active provers) | 2 | 4.1% |
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
| Active | 138 |
| Joining | 0 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of July 19, 2026, the Quilibrium network has 49 total shards. Of these, 9 (18.4%) are healthy, 2 (4.1%) need more coverage, and 38 (77.6%) are at halt risk. The network has 127 peers and 138 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
