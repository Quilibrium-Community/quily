---
title: "Quilibrium Network Health Snapshot — April 14, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-14
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

**Date:** April 14, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-14)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 386 |
| Total Workers | 41,301 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,355 | 76.0% |
| Warning (3–5 active provers) | 484 | 15.6% |
| Halt Risk (<3 active provers) | 259 | 8.4% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,481 |
| Ring 1 | 8–15 | 1,331 |
| Ring 2 | 16–23 | 180 |
| Ring 3+ | 24+ | 47 |
| Unassigned | 0 | 59 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 25,651 |
| Joining | 15,650 |
| Leaving | 1,693 |
| Rejected | 4,973 |

## Summary

As of April 14, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,355 (76.0%) are healthy, 484 (15.6%) need more coverage, and 259 (8.4%) are at halt risk. The network has 386 peers and 41,301 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
