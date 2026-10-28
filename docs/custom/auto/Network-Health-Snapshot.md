---
title: "Quilibrium Network Health Snapshot — October 28, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-10-28
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

**Date:** October 28, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-10-28)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 106 |
| Peers | 103 |
| Total Workers | 2,071 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 105 | 99.1% |
| Warning (3–5 active provers) | 1 | 0.9% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 2 |
| Ring 1 | 8–15 | 20 |
| Ring 2 | 16–23 | 76 |
| Ring 3+ | 24+ | 8 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 1,967 |
| Joining | 104 |
| Leaving | 398 |
| Rejected | 0 |

## Summary

As of October 28, 2026, the Quilibrium network has 106 total shards. Of these, 105 (99.1%) are healthy, 1 (0.9%) need more coverage, and 0 (0.0%) are at halt risk. The network has 103 peers and 2,071 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
