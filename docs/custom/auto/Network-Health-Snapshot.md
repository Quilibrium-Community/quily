---
title: "Quilibrium Network Health Snapshot — October 11, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-10-11
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

**Date:** October 11, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-10-11)

## Overview

| Metric | Value |
|---|---|
| World Size | 80.92 GB |
| Total Shards | 90 |
| Peers | 112 |
| Total Workers | 1,814 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 88 | 97.8% |
| Warning (3–5 active provers) | 1 | 1.1% |
| Halt Risk (<3 active provers) | 0 | 0.0% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 4 |
| Ring 1 | 8–15 | 28 |
| Ring 2 | 16–23 | 33 |
| Ring 3+ | 24+ | 24 |
| Unassigned | 0 | 1 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 1,631 |
| Joining | 183 |
| Leaving | 403 |
| Rejected | 0 |

## Summary

As of October 11, 2026, the Quilibrium network has 90 total shards. Of these, 88 (97.8%) are healthy, 1 (1.1%) need more coverage, and 0 (0.0%) are at halt risk. The network has 112 peers and 1,814 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
