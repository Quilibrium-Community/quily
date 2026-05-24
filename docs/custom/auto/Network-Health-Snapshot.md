---
title: "Quilibrium Network Health Snapshot — May 24, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-24
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

**Date:** May 24, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-24)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 217 |
| Total Workers | 44,429 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,401 | 76.7% |
| Warning (3–5 active provers) | 501 | 16.0% |
| Halt Risk (<3 active provers) | 230 | 7.3% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,338 |
| Ring 1 | 8–15 | 1,545 |
| Ring 2 | 16–23 | 169 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 34 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 26,707 |
| Joining | 17,722 |
| Leaving | 2,123 |
| Rejected | 19,157 |

## Summary

As of May 24, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,401 (76.7%) are healthy, 501 (16.0%) need more coverage, and 230 (7.3%) are at halt risk. The network has 217 peers and 44,429 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
