---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-05
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

**Last updated:** June 5, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands with worker id visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker id joins
- optimized TUI interface and display
- fixed prover eviction and leaving status bugs
- renamed pending prover state to joining
- resolved merge conflicts and dbscan compiler error
- added shard allocation join/leave confirmation logging
- set default archive peer list
- fixed timereel behavior to accept new head immediately
- added global frame fetch timeout and LRU cache
- corrected ring position and membership set calculations
- fixed worker TUI reward calculations and logical shard counts
- implemented auto-sized filters and dynamic filter width fixes
- optimized shard join/leave logging
- improved blossomsub behavior and estimation calculations
- added migrations to resolve eviction issues
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback reconciliation between old and new config paths
- fixed formatting and precision issues in prover reward data
- addressed potential peering issues
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug mode via environment variable
- fix pebbledb constructor configuration parameter
- reduce cpu overhead in initial worker behaviors and sync
- optimize docker builds with better caching
- add extra node info data and command line metrics query
- implement leave proposals for overcrowded shards
- enable hub-and-spoke global message broadcasts
- improve cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- resolve sync race conditions with prover registry pruning and worker allocation
- fix signature failures and merge-related signature verification
- adjust sync message size limits and app shard TC signature sizes
- remove blossomsub compatibility with old 2.0.0 version
- fix abandoned prover joins and stale worker proposals
- add sanity checks for joins to identify bugs
- resolve rare SIGFPE and orphan expired joins blocking workers
- improve peer discovery with reconnect fallback and updated base peer count
- fix expired prover join frames, port ranges, and stuck proposers
- resolve shutdown issues including panic, hanging, and coverage checks
- improve worker registry refresh and allocation logic
- tweak shutdown timing and add worker tracing
- use deterministic keys to prevent false sybil attack flags
- fix blossomsub subscription handling and nil panics
- switch from dnsaddr to dns4 for blossomsub
- add quic-v1 support
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
- added support for blossomsub peer discovery
- fixed peer discovery race condition in pubsub
- improved peer connection stability during sync
- optimized message handling performance
- reduced memory usage in peer management
- fixed edge case in channel synchronization
- updated dependency versions for security patches

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
