---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-08
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

**Last updated:** May 8, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker id visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker id joins
- optimized TUI interface and display
- fixed dbscan compiler error and prover eviction bug
- improved shard allocation logging for join/confirm/reject/leave
- added default archive peer list
- fixed prover leaving status in event distributor
- renamed pending state to joining for clarity
- resolved spend marker merge issue
- fixed TUI sorting and ring position display
- adjusted render width for markers
- improved timereel behavior for new head acceptance
- added timeout for global frame fetch
- implemented LRU cache for getglobalframe handler
- refined ring position and membership calculations
- optimized worker TUI reward calculations and shard counts
- added auto-sized filters
- improved blossomsub performance and estimation logic
- fixed migrations and added better logging
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback reconciliation between old and new config paths
- fixed prover reward data formatting and precision
- addressed potential peering issues
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fix high CPU overhead in initial worker behaviors and ongoing sync
- allow debug mode to be enabled via environment variable
- fix pebbledb constructor configuration parameter
- add extra node info data and query metrics from command line
- implement hub-and-spoke global message broadcasts
- leave proposals for overcrowded shards
- improve CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed seniority marker join blocker and sync message size limit defaults
- resolved signature failures and added error logging for merge-related signatures
- fixed one-shot sync message size, app shard TC signature size, and collector/hotstuff race condition
- resolved expired joins blocking new joins due to pruning disable
- removed compatibility with old 2.0.0 blossomsub
- fixed abandoned prover joins and stale worker proposal edge
- added full sanity check on join before submitting
- resolved rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable time when no peers are found
- updated base peer count to 1
- fixed expired prover join frames, starting port ranges, and proposer getting stuck
- resolved shutdown panics and libp2p discovery picking inaccessible peers
- fixed coverage event check during shutdown and app shard worker behavior
- resolved shutdown quirks and reload hanging issues
- added more logging for prover wait states
- fixed worker manager filter refresh on allocation and snapshot blocking
- added forced shutdown after five seconds for app worker
- prevented shutdown loops and added named workers for tracing
- used deterministic key for worker peer IDs to prevent sybil attack flags
- removed pubsub stop from app consensus engine and integrated shutdown context
- fixed blossomsub pubsub subscription tracking and nil panic on subscribe
- switched from dnsaddr to dns4 and added quic-v1 support
- fixed hypergraph freeze post-respawn and missing bitmask unsubscription

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
- added support for blossomsub peer discovery in private networks
- fixed peer discovery in private networks with blossomsub
- improved peer scoring for blossomsub
- added support for pebble storage engine
- fixed pebble storage engine cleanup on shutdown
- improved sync performance with optimized peer selection
- fixed sync stall during network disruptions
- added support for DKLs23 fork
- fixed channel bug causing occasional message drops
- resolve sync race condition with prover registry pruning
- improved hypergraph stability during network partitions

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
