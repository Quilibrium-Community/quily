---
title: "Quilibrium Network Health Snapshot — June 17, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-17
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

**Date:** June 17, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-17)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 315 |
| Total Workers | 57,983 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 3,094 | 98.8% |
| Warning (3–5 active provers) | 4 | 0.1% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 122 |
| Ring 1 | 8–15 | 2,773 |
| Ring 2 | 16–23 | 159 |
| Ring 3+ | 24+ | 44 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 30,672 |
| Joining | 27,311 |
| Leaving | 5,182 |
| Rejected | 38,339 |

## Summary

As of June 17, 2026, the Quilibrium network has 3,132 total shards. Of these, 3,094 (98.8%) are healthy, 4 (0.1%) need more coverage, and 0 (0.0%) are at halt risk. The network has 315 peers and 57,983 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
