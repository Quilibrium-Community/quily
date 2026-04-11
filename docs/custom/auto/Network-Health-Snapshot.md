---
title: "Quilibrium Network Health Snapshot — April 11, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-11
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

**Date:** April 11, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-11)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 376 |
| Total Workers | 40,941 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,353 | 76.0% |
| Warning (3–5 active provers) | 480 | 15.5% |
| Halt Risk (<3 active provers) | 265 | 8.6% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Workers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1 |
| Ring 1 | 8–15 | 1,837 |
| Ring 2 | 16–23 | 1,117 |
| Ring 3+ | 24+ | 143 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 25,583 |
| Joining | 15,358 |
| Leaving | 1,680 |
| Rejected | 4,971 |

## Summary

As of April 11, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,353 (76.0%) are healthy, 480 (15.5%) need more coverage, and 265 (8.6%) are at halt risk. The network has 376 peers and 40,941 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
