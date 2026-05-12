---
title: "Quilibrium Network Health Snapshot — May 12, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-12
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

**Date:** May 12, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-12)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 337 |
| Total Workers | 43,945 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,387 | 76.2% |
| Warning (3–5 active provers) | 451 | 14.4% |
| Halt Risk (<3 active provers) | 294 | 9.4% |

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
| Active | 26,496 |
| Joining | 17,449 |
| Leaving | 2,021 |
| Rejected | 18,834 |

## Summary

As of May 12, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,387 (76.2%) are healthy, 451 (14.4%) need more coverage, and 294 (9.4%) are at halt risk. The network has 337 peers and 43,945 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
