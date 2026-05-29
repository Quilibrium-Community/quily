---
title: "Quilibrium Network Health Snapshot — May 29, 2026"
source: Quilibrium Explorer API (automated daily)
date: 2026-05-29
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

**Date:** May 29, 2026
**Data source:** Quilibrium Explorer API (live data as of 2026-05-29)

## Overview

| Metric | Value |
|---|---|
| World Size | 154.16 GB |
| Total Shards | 3,132 |
| Peers | 304 |
| Total Workers | 45,124 |

## Shard Health

| Status | Count | Percentage |
|---|---|---|
| Healthy (6+ active provers) | 2,410 | 76.9% |
| Warning (3–5 active provers) | 667 | 21.3% |
| Halt Risk (<3 active provers) | 55 | 1.8% |

A shard is considered "healthy" when it has 6 or more active provers. Shards with fewer than 3 provers are at risk of halting. The network becomes fully activated when all shards move out of the "halt risk" category.

## Ring Distribution

| Ring | Provers per Shard | Shards |
|---|---|---|
| Ring 0 | 1–7 | 1,325 |
| Ring 1 | 8–15 | 1,557 |
| Ring 2 | 16–23 | 169 |
| Ring 3+ | 24+ | 46 |
| Unassigned | 0 | 35 |

## Worker Activity

| Status | Count |
|---|---|
| Active | 27,205 |
| Joining | 17,919 |
| Leaving | 2,129 |
| Rejected | 19,346 |

## Summary

As of May 29, 2026, the Quilibrium network has 3,132 total shards. Of these, 2,410 (76.9%) are healthy, 667 (21.3%) need more coverage, and 55 (1.8%) are at halt risk. The network has 304 peers and 45,124 total workers.

This snapshot is updated daily from the Quilibrium Explorer API.
