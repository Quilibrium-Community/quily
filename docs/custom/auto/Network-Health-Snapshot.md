---
title: "Quilibrium Network Health Snapshot — August 28, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-08-28
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

**Date:** August 28, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-08-28)

## Overview

| Metric | Value |
|---|---|
| World Size | 0 B |
| Total Shards | 48 |
| Peers | 88 |
| Total Workers | 1,183 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 44 | 91.7% |
| Warning (3–5 active provers) | 0 | 0.0% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 0 |
| Ring 1 | 8–15 | 4 |
| Ring 2 | 16–23 | 6 |
| Ring 3+ | 24+ | 34 |
| Unassigned | 0 | 4 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 1,130 |
| Joining | 53 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of August 28, 2026, the Quilibrium network has 48 total shards. Of these, 44 (91.7%) are healthy, 0 (0.0%) need more coverage, and 0 (0.0%) are at halt risk. The network has 88 peers and 1,183 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
