---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-16
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

**Last updated:** May 16, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands with worker id visibility
- relaxed peerstore clearing interval
- enhanced prover management TUI with manual tracking and worker id joins
- optimized TUI interface and display
- fixed prover eviction bug
- improved shard allocation logging for join/leave confirmations
- added default archive peer list
- fixed prover leaving status in event distributor
- renamed pending status to joining for clarity
- fixed merge spend marker issue
- resolved TUI sorting and ring position display issues
- fixed timereel to accept new head immediately
- added timeout and LRU cache for global frame fetching
- improved ring position and membership set calculations
- fixed worker TUI reward calculations and logical shard counts
- implemented auto-sized filters
- optimized shard join/leave logging
- fixed dynamic filter width
- improved blossomsub behavior and estimation calculations
- added migration to resolve eviction issues
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback reconciliation between old and new config paths
- fixed formatting and precision issues with prover reward data
- improved peering stability
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and ongoing sync
- added debug environment variable support
- fixed pebbleDB constructor configuration parameter
- optimized docker builds with better caching
- added node info metrics and command line query support
- implemented automatic leave proposals for overcrowded shards
- added hub-and-spoke global message broadcast system
- improved CLI output formatting for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed sync race conditions and message size limits
- resolved signature failures and merge-related signature issues
- fixed one-shot sync message size and app shard TC signature size
- addressed collector/hotstuff race condition and expired join blocking issues
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and stale worker proposal edge
- added sanity checks for join submissions
- fixed rare SIGFPE and orphan expired join allocation issues
- improved peer discovery with reconnect fallback and updated base peer count
- fixed expired prover join frames and port range issues
- resolved shutdown panics and libp2p peer selection problems
- fixed worker registry refresh and snapshot blocking during shutdown
- added deterministic worker keys to prevent sybil attack flags
- corrected pubsub lifecycle management and subscription handling
- switched from dnsaddr to dns4 for blossomsub
- added quic-v1 support
- fixed hypergraph freezing after respawn and bitmask unsubscribe issues
- improved respawn logic and shutdown handling

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
- fixed channel bug
- added DKLs23 fork
- resolve sync race condition with prover registry pruning
- improved blossomsub message handling
- optimized hypergraph traversal
- fixed pebble storage leak
- reduced memory usage in proof generation

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
