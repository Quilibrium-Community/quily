---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-15
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

**Last updated:** May 15, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and added worker ID display
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- optimized TUI rendering and interaction
- fixed dbscan compiler error
- added logging for shard allocation join/leave confirmations
- set default archive peer list
- fixed prover eviction bug
- improved prover visibility during implicit leave acceptance
- corrected prover leaving status in event distributor
- renamed "pending" status to "joining"
- fixed merge spend marker issue
- resolved sorting/ring position issues in TUI
- adjusted render width for [M] marker
- fixed timereel to accept new head immediately
- added timeout and LRU cache for global frame fetch
- improved ring position and membership set calculations
- fixed worker TUI reward calculations and logical shard count
- implemented auto-sized filters
- optimized shard join/leave logging
- fixed dynamic filter width
- improved blossomsub behavior and estimation calculations
- added migration to resolve eviction issue
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback and reconciled old/new config paths
- fixed formatting and precision on prover reward data
- fixed potential peering issue
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and ongoing sync
- added debug environment variable support
- fixed pebbleDB constructor config parameter
- optimized docker builds with better caching
- added extra node info data and command line metrics query
- implemented automatic leave proposals for overcrowded shards
- added hub-and-spoke global message broadcast system
- improved CLI output formatting for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed sync message size limits and signature handling
- resolved prover registry pruning issues and abandoned joins
- fixed worker allocation race conditions and expired join blocking
- improved shutdown handling for workers and coverage checks
- added deterministic keys for worker peer IDs to prevent sybil flags
- fixed blossomsub pubsub lifecycle and subscription panics
- switched from dnsaddr to dns4 for blossomsub connectivity
- enhanced error logging for merge operations and sync failures
- resolved rare crashes (SIGFPE) and worker proposal edge cases
- tweaked peer discovery and reconnect logic with fallbacks
- fixed hypergraph freeze after respawn and missing bitmask unsubscribes

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
- fixed blossomsub peer discovery and connection issues
- improved peer scoring and connection stability
- optimized peerstore persistence and reduced disk writes
- added support for new DKLs23 fork
- resolved sync race condition with prover registry pruning
- fixed channel bug causing message processing delays
- improved hypergraph synchronization performance
- reduced memory usage in pebble storage operations
- enhanced network resilience during chain reorganizations

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
