---
title: "Quilibrium Network Health Snapshot — April 26, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-26
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

**Date:** April 26, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-26)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 439 |
| Total Workers | 42,564 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,377 | 76.7% |
| Warning (3–5 active provers) | 462 | 14.9% |
| Halt Risk (<3 active provers) | 259 | 8.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,399 |
| Ring 1 | 8–15 | 1,477 |
| Ring 2 | 16–23 | 175 |
| Ring 3+ | 24+ | 47 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,180 |
| Joining | 16,384 |
| Leaving | 1,831 |
| Rejected | 5,404 |

## Summary

As of April 26, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,377 (76.7%) are healthy, 462 (14.9%) need more coverage, and 259 (8.4%) are at halt risk. The network has 439 peers and 42,564 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
