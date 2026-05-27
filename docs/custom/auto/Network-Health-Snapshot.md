---
title: "Quilibrium Network Health Snapshot — May 27, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-27
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

**Date:** May 27, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-27)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 296 |
| Total Workers | 45,040 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,406 | 76.8% |
| Warning (3–5 active provers) | 670 | 21.4% |
| Halt Risk (<3 active provers) | 56 | 1.8% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,330 |
| Ring 1 | 8–15 | 1,552 |
| Ring 2 | 16–23 | 169 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 35 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 27,146 |
| Joining | 17,894 |
| Leaving | 2,139 |
| Rejected | 19,333 |

## Summary

As of May 27, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,406 (76.8%) are healthy, 670 (21.4%) need more coverage, and 56 (1.8%) are at halt risk. The network has 296 peers and 45,040 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
