---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-12
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

**Last updated:** May 12, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- optimized component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- fixed prover eviction and leaving status bugs
- resolved dbscan compiler error and merge issues
- improved shard allocation join/confirm/reject logic with leave details
- added default archive peer list
- tweaked prover visibility for implicitly accepted leaves
- renamed "pending" to "joining" status
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
- optimized bandwidth usage for app worker

## v2.1.0.21 (version .21) *(auto-generated)*
- reconciled old and new config paths
- fixed formatting and precision on prover reward data
- improved peering reliability
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and ongoing sync
- added debug environment variable support
- fixed pebbleDB constructor config parameter
- improved docker build caching for faster builds
- added extra node info data and command line metrics query
- implemented automatic leave proposals for overcrowded shards
- added hub-and-spoke global message broadcasts
- tweaked CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed sync race conditions with prover registry pruning and seniority marker joins
- resolved signature failures and improved merge-related signature error logging
- adjusted sync message size limits and fixed app shard TC signature size
- fixed collector/hotstuff race condition and expired joins blocking new allocations
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and stale worker proposal edges
- added sanity checks for joins and fixed non-fallthrough conditions
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- improved peer discovery with reconnect fallback and updated base peer count
- fixed expired prover joins, port ranges, stuck proposers, and seniority on joins
- resolved shutdown panics and improved libp2p peer selection
- fixed coverage event checks during shutdown and app shard worker behavior
- improved registry refresh logic and worker allocation filtering
- added shutdown timeouts and named workers for debugging
- switched to deterministic worker keys to prevent sybil attack flags
- fixed pubsub lifecycle management and sync stuck prevention
- resolved blossomsub subscription tracking and nil panic on subscribe
- switched from dnsaddr to dns4 and added quic-v1 support
- fixed hypergraph freeze after respawn and missing bitmask unsubscriptions

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
- improved peer scoring and connection stability
- optimized message propagation in pubsub network
- reduced memory usage in peer management
- fixed deadlock in peer connection handling
- improved error handling for invalid messages
- added metrics for pubsub message validation
- optimized peer handshake protocol
- fixed edge cases in peer eviction logic

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
