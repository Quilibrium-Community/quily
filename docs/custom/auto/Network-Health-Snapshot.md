---
title: "Quilibrium Network Health Snapshot — May 26, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-26
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

**Date:** May 26, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-26)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 292 |
| Total Workers | 44,889 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,402 | 76.7% |
| Warning (3–5 active provers) | 655 | 20.9% |
| Halt Risk (<3 active provers) | 75 | 2.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,345 |
| Ring 1 | 8–15 | 1,537 |
| Ring 2 | 16–23 | 169 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 35 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 27,067 |
| Joining | 17,822 |
| Leaving | 2,110 |
| Rejected | 19,280 |

## Summary

As of May 26, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,402 (76.7%) are healthy, 655 (20.9%) need more coverage, and 75 (2.4%) are at halt risk. The network has 292 peers and 44,889 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
