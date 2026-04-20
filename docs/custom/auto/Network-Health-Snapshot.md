---
title: "Quilibrium Network Health Snapshot — April 20, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-04-20
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

**Date:** April 20, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-04-20)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,098 |
| Peers | 407 |
| Total Workers | 41,677 |

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
| Ring 0 | 1–7 | 1,534 |
| Ring 1 | 8–15 | 1,342 |
| Ring 2 | 16–23 | 175 |
| Ring 3+ | 24+ | 47 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 25,750 |
| Joining | 15,927 |
| Leaving | 1,693 |
| Rejected | 4,986 |

## Summary

As of April 20, 2026, the Quilibrium network has 3,098 total shards. Of these, 2,355 (76.0%) are healthy, 484 (15.6%) need more coverage, and 259 (8.4%) are at halt risk. The network has 407 peers and 41,677 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
