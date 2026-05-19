---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-19
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

**Last updated:** May 19, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- fixed prover eviction and leaving status bugs
- optimized TUI rendering for shard allocation and worker rewards
- resolved dbscan compiler error and merge conflicts
- added default archive peer list
- renamed "pending" to "joining" for clarity
- fixed sorting and ring position issues in TUI
- adjusted timereel to accept new head immediately
- added timeout for global frame fetch and LRU cache
- improved shard join/leave confirmation logging
- auto-sized filters and fixed dynamic filter width
- blossomsub improvements and estimation adjustments
- resolved migration issues with eviction fixes
- refactored global consensus engine into discrete components
- reduced bandwidth usage on app worker

## v2.1.0.21 (version .21) *(auto-generated)*
- reconciled old and new config paths
- fixed formatting and precision on prover reward data
- resolved potential peering issue
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and ongoing sync
- added debug environment variable support
- fixed pebbleDB constructor config parameter
- improved docker build caching
- added node info metrics and command line query support
- implemented automatic leave proposals for overcrowded shards
- added hub-and-spoke global message broadcast system
- improved CLI output formatting for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- resolve sync race conditions with prover registry pruning and worker allocation
- fix signature failures and merge-related signature validation
- adjust sync message size limits and app shard TC signature handling
- remove blossomsub compatibility with old 2.0.0 version
- fix abandoned/stale prover joins and worker proposal edges
- add sanity checks for joins to identify bugs
- resolve rare SIGFPE and orphan expired joins blocking workers
- improve peer discovery with reconnect fallback and base peer count
- fix expired prover join frames, port ranges, and proposer stuck issues
- resolve shutdown panics, libp2p discovery quirks, and coverage event checks
- improve worker registry refresh and filter allocation
- tweak shutdown timing and add worker tracing
- use deterministic keys to prevent sybil attack false positives
- fix blossomsub pubsub lifecycle management and subscription order
- switch from dnsaddr to dns4 for blossomsub
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
- fixed blossomsub peer scoring parameters
- improved peer discovery and connection stability
- optimized hypergraph sync performance
- added validation for peer address book entries
- reduced memory usage in pebble storage layer
- fixed deadlock in peer manager during shutdown
- improved error handling for invalid peer connections
- optimized certificate verification performance

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
