---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-27
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

**Last updated:** May 27, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- optimized TUI rendering and round processing
- fixed database scanner compiler error
- improved shard allocation join/reject logic with leave details
- set default archive peer list
- fixed prover eviction bug
- adjusted prover visibility during implicit leave acceptance
- renamed "pending" status to "joining" in prover management
- fixed spend marker merge issue
- resolved TUI sorting and ring position display issues
- adjusted render width for membership markers
- improved timereel behavior for immediate head acceptance
- added timeout for global frame fetch operations
- implemented LRU cache for global frame handler
- refined ring position and membership set calculations
- optimized worker TUI reward calculations and logical shard counts
- implemented auto-sized filters
- enhanced logging for shard join/leave plans and decisions
- fixed dynamic filter width calculations
- improved blossomsub performance and estimation logic
- added migration to resolve eviction issues
- refactored global consensus engine into discrete components

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback and reconciled old/new config paths
- fixed formatting and precision on prover reward data
- fixed app shard lookups on mainnet
- addressed potential peering issue

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and ongoing sync
- added debug environment variable support
- fixed pebbleDB constructor config parameter
- improved docker build caching for faster builds
- added extra node info data and command line metrics query
- implemented automatic leave proposals for overcrowded shards
- added hub-and-spoke global message broadcasts
- improved CLI output formatting for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed sync race conditions with prover registry pruning and seniority marker joins
- adjusted sync message size limits and app shard TC signature sizes
- resolved collector/hotstuff race condition and expired join blocking issues
- removed compatibility with old 2.0.0 blossomsub
- fixed abandoned prover joins and stale worker proposals
- added sanity checks for join submissions
- resolved rare SIGFPE and orphan expired join allocation issues
- improved peer reconnection with variable timing and updated base peer count
- fixed expired prover joins, port ranges, and proposer stuck scenarios
- addressed shutdown panics and libp2p peer selection issues
- fixed coverage event checks during shutdown and worker behavior
- resolved registry refresh hangs and shutdown quirks
- added worker allocation filtering and snapshot shutdown fixes
- implemented forced shutdown timing for app workers
- added named workers for shutdown tracing
- switched to deterministic worker keys to prevent sybil flags
- fixed pubsub lifecycle management in app consensus
- resolved blossomsub subscription tracking and nil panic issues
- changed from dnsaddr to dns4 addressing
- added quic-v1 support
- fixed hypergraph freezing after respawn
- improved respawn logic and bitmask unsubscription

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
- reduced memory usage in pebble storage backend
- fixed rare deadlock in peer manager
- improved channel message handling reliability
- added validation for incoming peer metadata
- optimized network bandwidth usage during sync

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
