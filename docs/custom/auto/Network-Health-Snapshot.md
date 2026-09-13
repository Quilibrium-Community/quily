---
title: "Quilibrium Network Health Snapshot — September 13, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-09-13
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

**Date:** September 13, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-09-13)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 27 |
| Peers | 116 |
| Total Workers | 704 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 26 | 96.3% |
| Warning (3–5 active provers) | 1 | 3.7% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1 |
| Ring 1 | 8–15 | 5 |
| Ring 2 | 16–23 | 14 |
| Ring 3+ | 24+ | 7 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 532 |
| Joining | 172 |
| Leaving | 5 |
| Rejected | 0 |

## Summary

As of September 13, 2026, the Quilibrium network has 27 total shards. Of these, 26 (96.3%) are healthy, 1 (3.7%) need more coverage, and 0 (0.0%) are at halt risk. The network has 116 peers and 704 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
