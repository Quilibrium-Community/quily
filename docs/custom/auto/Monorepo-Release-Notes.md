---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-04-30
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

**Last updated:** April 30, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker id visibility
- relaxed peerstore clearing interval
- enhanced prover management TUI with manual tracking and worker id specification
- fixed prover eviction and leaving status bugs
- resolved dbscan compiler error and merge issues
- optimized shard allocation join/reject logging and leave details
- added default archive peer list
- fixed TUI rendering for markers, sorting, and ring positions
- improved timereel behavior for immediate head acceptance
- added timeout and LRU cache for global frame fetching
- adjusted estimation behavior for proper ring calculations
- optimized worker TUI reward calculations and bandwidth
- implemented auto-sized filters and dynamic filter width fixes
- enhanced blossomsub and consensus estimation logic
- fixed migrations and improved related logging
- refactored global consensus engine into discrete components
- updated RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconciled old and new config paths
- fixed formatting and precision on prover reward data
- resolved peering issue
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed pebbledb constructor config parameter
- reduced CPU overhead in initial worker behaviors and sync
- improved docker build caching for faster builds
- added extra node info data and CLI metrics querying
- implemented automatic leave proposals for overcrowded shards
- added hub-and-spoke global message broadcasts
- tweaked CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- resolve sync race condition with prover registry pruning
- fix seniority marker join blocker and sync message size limit defaults
- improve error logging for merge-related signatures
- fix one-shot sync message size, app shard TC signature size, and collector/hotstuff race condition
- prevent expired joins from blocking new workers
- remove compatibility with old 2.0.0 blossomsub
- fix abandoned prover joins and stale worker proposal edge
- add full sanity check before join submission
- resolve rare SIGFPE and orphan expired joins blocking worker allocation
- improve peer discovery with reconnect fallback and updated base peer count
- fix expired prover join frames, port ranges, and proposer getting stuck
- resolve shutdown issues: panic, hanging reloads, and coverage event checks
- tweak worker manager to refresh registry on allocation
- force shutdown after five seconds for app workers
- use deterministic keys for worker peer IDs to prevent sybil flagging
- fix blossomsub pubsub lifecycle management and subscription order
- switch from dnsaddr to dns4 for blossomsub
- add quic-v1 support
- fix hypergraph freeze after respawn and unsubscribe from missing bitmasks

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
- fixed blossomsub peer scoring
- added support for multiple DHTs
- improved peer discovery and connection handling
- optimized message propagation in pubsub
- fixed memory leaks in peer management
- added metrics for network performance monitoring
- improved handling of peer disconnections
- optimized resource usage during sync
- fixed edge cases in peer scoring logic
- improved stability during high network load

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
