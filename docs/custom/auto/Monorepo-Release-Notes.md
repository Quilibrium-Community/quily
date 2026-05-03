---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-03
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

**Last updated:** May 3, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- optimized TUI interface and rendering
- fixed prover eviction and leaving status bugs
- resolved shard allocation join/confirm/reject logic and plan leave details
- added default archive peer list
- renamed pending state to joining for clarity
- fixed sorting and ring position issues in TUI
- improved timereel behavior for immediate head acceptance
- added timeout and LRU cache for global frame fetching
- adjusted estimation behavior for proper ring position and membership
- optimized worker TUI reward calculations and logical shard count
- implemented auto-sized filters and bandwidth reduction
- improved blossomsub behavior and dynamic filter width
- added migration to resolve eviction issues
- refactored global consensus engine into discrete components
- fixed various edge cases in shard join/reject logging and plan execution

## v2.1.0.21 (version .21) *(auto-generated)*
- resolve sync race condition with prover registry pruning
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix potential peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug mode via environment variable
- fix pebbledb constructor configuration parameter
- reduce CPU overhead in initial worker behaviors and sync
- optimize docker builds with better caching
- add extra node info data and command line metrics querying
- implement hub-and-spoke global message broadcasts
- improve cli output for join frames
- leave proposals for overcrowded shards

## v2.1.0.19 (version .19) *(auto-generated)*
- resolve sync race conditions with prover registry pruning and worker allocation
- fix signature failures and merge-related signature validation
- adjust sync message size limits and app shard TC signature size
- fix blossomsub compatibility issues and peer discovery quirks
- resolve prover join blockers including expired joins and seniority markers
- improve shutdown handling for workers and coverage checks
- fix registry refresh issues during worker allocation
- address pubsub lifecycle management and subscription panics
- switch from dnsaddr to dns4 for blossomsub
- enhance error logging and respawn logic
- fix hypergraph freeze after respawn and bitmask unsubscribe issues

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
- improved peer scoring metrics for blossomsub
- optimized hypergraph sync performance
- reduced pebble compaction overhead
- fixed channel message ordering bug
- improved error handling for invalid proofs
- added validation for DKLs23 fork parameters
- resolved deadlock in prover registry pruning

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
