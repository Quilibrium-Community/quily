---
title: "Quilibrium Network Health Snapshot — April 2, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-02
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

**Date:** April 2, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-02)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 437 |
| Total Workers | 38,101 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,343 | 75.6% |
| Warning (3–5 active provers) | 504 | 16.3% |
| Halt Risk (<3 active provers) | 251 | 8.1% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Workers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,075 |
| Ring 1 | 8–15 | 1,175 |
| Ring 2 | 16–23 | 709 |
| Ring 3+ | 24+ | 139 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 24,685 |
| Joining | 13,416 |
| Leaving | 1,354 |
| Rejected | 1,378 |

## Summary

As of April 2, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,343 (75.6%) are healthy, 504 (16.3%) need more coverage, and 251 (8.1%) are at halt risk. The network has 437 peers and 38,101 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
