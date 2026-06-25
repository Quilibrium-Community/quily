---
title: "Quilibrium Network Health Snapshot — June 25, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-06-25
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

**Date:** June 25, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-06-25)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 290 |
| Total Workers | 13,288 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 746 | 23.8% |
| Warning (3–5 active provers) | 1,808 | 57.7% |
| Halt Risk (<3 active provers) | 530 | 16.9% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 2,900 |
| Ring 1 | 8–15 | 184 |
| Ring 2 | 16–23 | 0 |
| Ring 3+ | 24+ | 0 |
| Unassigned | 0 | 48 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 13,288 |
| Joining | 0 |
| Leaving | 0 |
| Rejected | 0 |

## Summary

As of June 25, 2026, the Quilibrium network has 3,132 total shards. Of these, 746 (23.8%) are healthy, 1,808 (57.7%) need more coverage, and 530 (16.9%) are at halt risk. The network has 290 peers and 13,288 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
