---
title: "Quilibrium Network Health Snapshot — April 6, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-06
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

**Date:** April 6, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-06)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 337 |
| Total Workers | 40,065 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,335 | 75.4% |
| Warning (3–5 active provers) | 496 | 16.0% |
| Halt Risk (<3 active provers) | 267 | 8.6% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Workers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1 |
| Ring 1 | 8–15 | 2,075 |
| Ring 2 | 16–23 | 883 |
| Ring 3+ | 24+ | 139 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 25,021 |
| Joining | 15,044 |
| Leaving | 1,477 |
| Rejected | 4,414 |

## Summary

As of April 6, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,335 (75.4%) are healthy, 496 (16.0%) need more coverage, and 267 (8.6%) are at halt risk. The network has 337 peers and 40,065 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
