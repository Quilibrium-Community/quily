---
title: "Quilibrium Network Health Snapshot — November 20, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-11-20
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

**Date:** November 20, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-11-20)

## Overview

| Metric | Value |
|---|---|
| World Size | 81.09 GB |
| Total Shards | 163 |
| Peers | 152 |
| Total Workers | 4,225 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 163 | 100.0% |
| Warning (3–5 active provers) | 0 | 0.0% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 0 |
| Ring 1 | 8–15 | 2 |
| Ring 2 | 16–23 | 65 |
| Ring 3+ | 24+ | 96 |
| Unassigned | 0 | 0 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 4,025 |
| Joining | 200 |
| Leaving | 45 |
| Rejected | 0 |

## Summary

As of November 20, 2026, the Quilibrium network has 163 total shards. Of these, 163 (100.0%) are healthy, 0 (0.0%) need more coverage, and 0 (0.0%) are at halt risk. The network has 152 peers and 4,225 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
