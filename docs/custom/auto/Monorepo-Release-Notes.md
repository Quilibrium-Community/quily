---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-04-24
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

**Last updated:** April 24, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and added worker ID visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- optimized TUI rendering and interaction
- fixed prover eviction and leaving status bugs
- renamed pending state to joining for clarity
- fixed merge spend marker and ring position sorting issues
- adjusted TUI render width for markers
- improved timereel behavior to accept new heads immediately
- added timeouts and LRU cache for global frame fetching
- fixed reward calculations and logical shard count in worker TUI
- implemented auto-sized filters and fixed dynamic filter width
- optimized logging for shard join/leave operations
- improved blossomsub behavior and estimation calculations
- added migrations to resolve eviction issues
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display in TUI

## v2.1.0.21 (version .21) *(auto-generated)*
- resolve sync race condition with prover registry pruning
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix peering issue solution
- fix app shard lookups on mainnet

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
- fixed sync message size limits and signature failures
- resolved race conditions in collector/hotstuff and prover registry pruning
- removed compatibility with old 2.0.0 blossomsub
- fixed abandoned prover joins and stale worker proposals
- added sanity checks for join submissions
- fixed rare SIGFPE and orphan expired joins blocking worker allocation
- improved peer discovery with reconnect fallback and base peer count adjustment
- fixed expired prover join frames, port ranges, and stuck proposers
- resolved shutdown issues including panic, hanging reloads, and coverage checks
- improved worker management with registry refreshes and shutdown handling
- fixed blossomsub subscription tracking and nil panic on subscribe
- switched from dnsaddr to dns4 for blossomsub
- added quic-v1 support
- fixed hypergraph freeze after respawn and missing bitmask unsubscriptions
- improved worker allocation with deterministic peer IDs to prevent sybil flags

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
- fixed peer discovery race condition in blossomsub
- improved peer scoring for blossomsub message propagation
- optimized hypergraph sync performance during high network load
- added validation for DKLs23 fork parameters
- resolved deadlock in prover registry during node shutdown
- fixed memory leak in channel manager during peer disconnects
- improved error handling for invalid peer connections
- reduced CPU usage during idle periods by optimizing background tasks

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
