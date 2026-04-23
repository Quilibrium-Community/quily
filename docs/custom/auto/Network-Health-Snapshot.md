---
title: "Quilibrium Network Health Snapshot — April 23, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-23
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

**Date:** April 23, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-23)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 425 |
| Total Workers | 42,432 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,376 | 76.7% |
| Warning (3–5 active provers) | 463 | 14.9% |
| Halt Risk (<3 active provers) | 259 | 8.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,433 |
| Ring 1 | 8–15 | 1,442 |
| Ring 2 | 16–23 | 177 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,046 |
| Joining | 16,386 |
| Leaving | 1,784 |
| Rejected | 5,196 |

## Summary

As of April 23, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,376 (76.7%) are healthy, 463 (14.9%) need more coverage, and 259 (8.4%) are at halt risk. The network has 425 peers and 42,432 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
