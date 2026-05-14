---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-14
type: release_notes
topics:
  - release notes
  - changelog
  - version
  - update
  - what changed
  - bug fix
  - new feature
  - node update
---

# Quilibrium Node Release Notes

**Last updated:** May 14, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- optimized component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- fixed prover eviction and leaving status bugs
- resolved dbscan compiler error and merge issues
- improved shard allocation join/confirm/reject with leave details
- added default archive peer list
- tweaked prover visibility during implicit acceptance
- renamed pending state to joining for clarity
- fixed spend marker and ring position sorting in TUI
- adjusted render width for [M] marker
- improved timereel behavior for immediate head acceptance
- added timeout and LRU cache for global frame fetch
- optimized reward calculations and logical shard count in worker TUI
- implemented auto-sized filters
- enhanced blossomsub behavior and estimation calculations
- fixed dynamic filter width
- improved migrations and logging
- refactored global consensus engine into discrete components
- optimized bandwidth usage on app worker

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback reconciliation between old and new config paths
- fixed formatting and precision issues in prover reward data
- fixed potential peering issue
- corrected app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and sync
- optimized docker builds with better caching
- added node info metrics and CLI query support
- implemented automatic leave proposals for overcrowded shards
- enabled hub-and-spoke global message broadcasts
- improved CLI output formatting for join frames
- fixed pebbleDB constructor config parameter
- added debug environment variable support

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed sync message size limits and signature handling
- resolved prover registry issues including abandoned joins and stale workers
- improved shutdown handling for workers and pubsub
- fixed peer discovery and connection fallback logic
- addressed various edge cases in worker allocation and registration
- enhanced error logging for debugging
- switched from dnsaddr to dns4 for blossomsub
- resolved rare crashes and freezes during shutdown
- optimized pubsub subscription management
- added deterministic keys to prevent false sybil detection

## v2.1.0.18 (version .18)
- resolve transaction missing from certain tree methods
- resolve tree deletion corruption
- resolve seniority bug
- added DKLs23 fork
- fixed channel bug
- added raw bytestream to ferret
- added challenge derivation for ed448 in FROST
- fixed race condition in global intrinsic
- other smaller bug fixes

## v2.1.0.17 (version .17)
- resolve sync race condition with prover registry pruning
- update hypergraph to directly manage raw deletions
- migration to resolve records issue from above
- resolve early snapshot termination issue
- global halts are now just halts on processing non-global ops

## v2.1.0.16 (version .16)
- build_utils – static code analysis checker for underlying slice assignment
- hypergraph snapshot manager now uses in memory snapshot instead of pebble snapshot
- hypersync can delete orphaned entries
- signature aggregation wrapper for app shards no longer expects proposer to have a proof (the proof is already in the frame)
- hook events on sync for app shards
- app shards properly sync global prover info
- coverage streaks/halt events now trigger on app shards
- peer info and key registry handlers on app shard level
- updated to pebble v2
- pebble v2 upgrade handler
- archive mode memory bug fix
- subtle underlying slice mutation bug fix

## v2.1.0.15 (version .15)
- Adds direct db sync mode for hypersync
- Removes blackhole detection entirely
- Enforces reachability check with new approach
- Resolves start/stop issue

## v2.1.0.14 (version .14)
- Resolves race condition around QC processing
- Remove noisy sync logs
- Skip unnecessary prover check for global prover info
- Fix issue with 100+ rejections/confirmations
- Resolve sync panic

## v2.1.0.13 (version .13)
- Extends ProverConfirm and ProverReject to have multiple filters per message
- Adds snapshot integration to allow hypersync to occur concurrently with writes
- Resolved infinitessimal rings divide-by-zero error

## v2.1.0.11 (version .11) *(auto-generated)*
- fixed blossomsub peer discovery edge case
- improved hypergraph validation performance
- optimized pebble storage compaction
- added graceful shutdown handling for channel manager
- resolved deadlock in peer connection state machine
- fixed memory leak in proof verification cache
- improved sync resilience during network partitions
- reduced CPU spikes during large batch processing

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
