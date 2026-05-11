---
title: "Quilibrium Network Health Snapshot — May 11, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-11
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

**Date:** May 11, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-11)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 334 |
| Total Workers | 43,950 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,387 | 76.2% |
| Warning (3–5 active provers) | 452 | 14.4% |
| Halt Risk (<3 active provers) | 293 | 9.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,357 |
| Ring 1 | 8–15 | 1,525 |
| Ring 2 | 16–23 | 177 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 27 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,501 |
| Joining | 17,449 |
| Leaving | 2,021 |
| Rejected | 18,811 |

## Summary

As of May 11, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,387 (76.2%) are healthy, 452 (14.4%) need more coverage, and 293 (9.4%) are at halt risk. The network has 334 peers and 43,950 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
