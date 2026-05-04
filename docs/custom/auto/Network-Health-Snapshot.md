---
title: "Quilibrium Network Health Snapshot — May 4, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-04
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

**Date:** May 4, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-04)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 278 |
| Total Workers | 43,163 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,378 | 76.8% |
| Warning (3–5 active provers) | 459 | 14.8% |
| Halt Risk (<3 active provers) | 261 | 8.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,386 |
| Ring 1 | 8–15 | 1,495 |
| Ring 2 | 16–23 | 171 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,229 |
| Joining | 16,934 |
| Leaving | 1,947 |
| Rejected | 9,603 |

## Summary

As of May 4, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,378 (76.8%) are healthy, 459 (14.8%) need more coverage, and 261 (8.4%) are at halt risk. The network has 278 peers and 43,163 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
