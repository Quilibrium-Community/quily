---
title: "Quilibrium Network Health Snapshot — May 17, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-17
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

**Date:** May 17, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-17)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 354 |
| Total Workers | 44,009 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,389 | 76.3% |
| Warning (3–5 active provers) | 465 | 14.8% |
| Halt Risk (<3 active provers) | 278 | 8.9% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,353 |
| Ring 1 | 8–15 | 1,522 |
| Ring 2 | 16–23 | 176 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 35 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,527 |
| Joining | 17,482 |
| Leaving | 2,045 |
| Rejected | 18,894 |

## Summary

As of May 17, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,389 (76.3%) are healthy, 465 (14.8%) need more coverage, and 278 (8.9%) are at halt risk. The network has 354 peers and 44,009 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
