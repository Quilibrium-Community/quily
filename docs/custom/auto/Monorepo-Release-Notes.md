---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-04-25
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

**Last updated:** April 25, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands with worker id visibility
- relaxed peerstore clearing interval
- added manual management tracking and worker id specification in prover TUI
- optimized TUI interface and display
- fixed prover eviction bug
- improved shard allocation logging for join/leave confirmations
- added default archive peer list
- fixed prover leaving status in event distributor
- renamed pending state to joining for clarity
- fixed merge spend marker issue
- resolved TUI sorting and ring position display issues
- fixed timereel behavior to accept new head immediately
- added timeout and LRU cache for global frame fetching
- adjusted estimation behavior for accurate ring position calculation
- fixed worker TUI reward calculation and logical shard count
- implemented auto-sized filters
- optimized shard join/leave logging
- fixed dynamic filter width
- improved blossomsub behavior and estimation calculations
- added migrations to resolve eviction issues
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconciled old and new config paths
- fixed prover reward data formatting and precision
- improved peering stability
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and sync
- added debug environment variable support
- fixed pebbleDB constructor config parameter
- improved docker build caching
- added node info metrics and CLI query support
- implemented automatic shard leave proposals for overcrowding
- added hub-and-spoke global message broadcast system
- tweaked CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed sync message size limits and signature handling
- resolved prover registry issues including abandoned joins and stale workers
- improved shutdown handling for workers and coverage checks
- fixed peer discovery and connection fallback logic
- addressed blossomsub subscription panics and pubsub lifecycle
- switched from dnsaddr to dns4 for blossomsub
- added deterministic keys to prevent false sybil attack detection
- fixed hypergraph freezing after respawn
- enhanced error logging for signatures and merge operations
- resolved rare crashes (SIGFPE) and edge cases in worker allocation

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
- fixed blossomsub peer discovery regression
- improved peer scoring metrics
- optimized hypergraph sync performance
- reduced memory usage in pebble storage layer
- added validation for invalid bloom filter edge cases
- fixed rare deadlock in channel manager
- improved error handling during peer disconnects
- optimized batch processing for large state transitions

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
