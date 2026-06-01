---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-01
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

**Last updated:** June 1, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands with worker id visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker id joins
- optimized TUI rendering and interaction
- fixed dbscan compiler error
- added shard allocation join/leave confirmation logging
- set default archive peer list
- fixed prover eviction bug
- improved prover visibility during implicit leave acceptance
- corrected prover leaving status in event distributor
- renamed pending state to joining for clarity
- fixed merge spend marker issue
- resolved TUI sorting and ring position display issues
- adjusted render width for [M] marker
- improved timereel behavior for immediate head acceptance
- added timeout and LRU cache for global frame fetching
- fixed ring position and membership set calculations
- corrected worker TUI reward calculations and logical shard counts
- implemented auto-sized filters
- optimized shard join/leave logging
- fixed dynamic filter width
- improved blossomsub behavior and estimation calculations
- added migration to resolve eviction issues
- refactored global consensus engine into discrete components
- updated RPC and worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback reconciliation between old and new config paths
- fixed prover reward data formatting and precision
- addressed potential peering issues
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and sync
- added debug mode via environment variable
- fixed pebbleDB constructor configuration
- optimized docker builds with better caching
- added extra node info data and CLI metrics queries
- implemented hub-and-spoke global message broadcasts
- adjusted CLI output for join frames
- improved handling of overcrowded shards by leaving proposals

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging and fixed seniority marker join blocker
- resolved signature failures and added merge-related signature logging
- fixed sync message size limits, app shard TC signature size, and collector/hotstuff race condition
- removed blossomsub compatibility with old 2.0.0 version
- resolved abandoned prover joins and stale worker proposal edge
- added full sanity check before join submissions
- fixed rare SIGFPE and orphan expired joins blocking worker allocation
- improved peer discovery with reconnect fallback and updated base peer count
- fixed expired prover join frames, port ranges, and proposer stuck issues
- resolved shutdown panics, libp2p discovery quirks, and coverage event checks
- improved worker registry refresh behavior and shutdown handling
- added deterministic keys for worker peer IDs to prevent sybil flagging
- fixed blossomsub pubsub lifecycle management and subscription order
- switched from dnsaddr to dns4 for blossomsub
- fixed hypergraph freeze after respawn and bitmask unsubscribe issues

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
- fixed deadlock in peer manager during peer pruning
- improved peer scoring for blossomsub
- optimized hypergraph sync performance
- reduced memory usage in channel manager
- fixed race condition in peer discovery
- improved error handling for invalid proofs
- added validation for incoming channel messages
- fixed peer connection stability issues
- optimized resource cleanup during node shutdown
- improved handling of malformed network messages

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
