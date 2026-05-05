---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-05
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

**Last updated:** May 5, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- optimized TUI interface and display
- fixed prover eviction and leaving status bugs
- resolved database scan compiler errors
- improved shard allocation logging for join/confirm/reject/leave
- added default archive peer list
- tweaked prover visibility during implicit leave acceptance
- renamed "pending" status to "joining" in TUI
- fixed spend marker merge issue
- resolved TUI sorting and ring position display issues
- adjusted render width for markers
- improved timereel behavior for immediate head acceptance
- added timeout for global frame fetch operations
- implemented LRU cache for getglobalframe handler
- refined ring position and membership set calculations
- optimized worker TUI reward calculations and shard counts
- implemented auto-sized filters
- enhanced logging for shard join/leave processes
- fixed dynamic filter width issues
- improved blossomsub performance and estimation calculations
- updated migrations to resolve eviction issues
- refactored global consensus engine into discrete components
- adjusted RPC and worker ring displays

## v2.1.0.21 (version .21) *(auto-generated)*
- resolve sync race condition with prover registry pruning
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix peering issue solution
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and sync
- added debug mode via environment variable
- fixed pebbleDB constructor configuration
- optimized docker builds with better caching
- added extra node info data and CLI metrics queries
- implemented hub-and-spoke global message broadcasts
- improved CLI output for join frames
- added leave proposals for overcrowded shards

## v2.1.0.19 (version .19) *(auto-generated)*
- resolve sync race conditions with prover registry pruning and worker allocation
- fix signature failures and merge-related signature validation
- adjust sync message size limits and app shard TC signature handling
- remove compatibility with old blossomsub 2.0.0
- fix abandoned prover joins and stale worker proposals
- improve error logging for join sanity checks
- resolve rare SIGFPE and orphaned expired joins blocking workers
- add peer reconnect fallback with variable timing
- update base peer count to 1
- fix expired prover joins, port ranges, and proposer stuck states
- resolve shutdown panics, libp2p discovery quirks, and coverage event checks
- improve worker registry refresh behavior during allocation
- tweak shutdown timing and force registry refreshes
- use deterministic keys for worker peer IDs to prevent sybil flags
- fix blossomsub pubsub lifecycle management and subscription order
- switch from dnsaddr to dns4 for blossomsub
- fix hypergraph freezing after respawn and bitmask unsubscribe issues

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
- fixed blossomsub peer discovery race condition
- improved hypergraph sync performance
- optimized pebble storage compaction
- added validation for DKLs23 proofs
- reduced memory usage during batch processing
- fixed channel message ordering bug
- improved peer scoring for blossomsub
- resolved deadlock in prover registry cleanup

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
