---
title: "Quilibrium Network Health Snapshot — May 25, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-25
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

**Date:** May 25, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-25)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 266 |
| Total Workers | 44,777 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,398 | 76.6% |
| Warning (3–5 active provers) | 617 | 19.7% |
| Halt Risk (<3 active provers) | 117 | 3.7% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,350 |
| Ring 1 | 8–15 | 1,532 |
| Ring 2 | 16–23 | 169 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 35 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,913 |
| Joining | 17,864 |
| Leaving | 2,105 |
| Rejected | 19,265 |

## Summary

As of May 25, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,398 (76.6%) are healthy, 617 (19.7%) need more coverage, and 117 (3.7%) are at halt risk. The network has 266 peers and 44,777 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
