---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-03-26
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

**Last updated:** March 26, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.21 (version .21) *(auto-generated)*
- resolve sync race condition with prover registry pruning
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix app shard lookups on mainnet

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
- fixed seniority marker join blocker and sync message size limit defaults
- resolved signature failures and merge-related signature issues
- fixed one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and stale worker proposal edge
- added full sanity check on join before submitting
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable time when no peers found
- updated base peer count to 1
- fixed expired prover join frames, port ranges, stuck proposer, and seniority on joins
- resolved panic on shutdown and libp2p discovery picking inaccessible peers
- fixed shutdown quirks, reload hanging, and coverage event checks
- forced registry refresh on worker waiting for registration
- fixed worker manager filter refresh and snapshots blocking shutdown
- added forced shutdown after five seconds for app worker
- prevented shutdown loops and added named workers for tracing
- used deterministic key for worker peer ids to prevent sybil flagging
- removed pubsub stop from app consensus engine and integrated shutdown context for sync
- fixed blossomsub pubsub subscription tracking and nil panic on subscribe
- switched from dnsaddr to dns4 and added quic-v1
- fixed frozen hypergraph post-respawn and missing bitmask unsubscribe
- restored proper respawn logic

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
- improved peer scoring for blossomsub
- added support for peer exchange in blossomsub
- optimized blossomsub message handling performance
- fixed peer connection stability in blossomsub
- improved peer routing table maintenance
- added blossomsub connection metrics
- fixed peer disconnection handling
- optimized blossomsub message propagation
- improved peer discovery reliability
- fixed peer scoring edge cases
- added blossomsub connection timeouts
- optimized peer routing table updates
- fixed peer connection race conditions
- improved blossomsub message validation
- added peer connection health checks
- fixed peer scoring calculation bugs
- optimized blossomsub message caching
- improved peer discovery performance
- fixed peer connection handshake issues

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
