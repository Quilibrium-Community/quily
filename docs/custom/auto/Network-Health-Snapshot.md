---
title: "Quilibrium Network Health Snapshot — June 3, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-03
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

**Date:** June 3, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-03)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 334 |
| Total Workers | 45,461 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,446 | 78.1% |
| Warning (3–5 active provers) | 611 | 19.5% |
| Halt Risk (<3 active provers) | 75 | 2.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,210 |
| Ring 1 | 8–15 | 1,673 |
| Ring 2 | 16–23 | 169 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 27,352 |
| Joining | 18,109 |
| Leaving | 2,327 |
| Rejected | 19,470 |

## Summary

As of June 3, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,446 (78.1%) are healthy, 611 (19.5%) need more coverage, and 75 (2.4%) are at halt risk. The network has 334 peers and 45,461 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
