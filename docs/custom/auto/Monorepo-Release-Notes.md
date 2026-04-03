---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-04-03
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

**Last updated:** April 3, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.21 (version .21) *(auto-generated)*
- resolve sync race condition with prover registry pruning
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix peering issue solution
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug mode via environment variable
- fix pebbledb constructor configuration parameter
- reduce high cpu overhead in initial worker behaviors and sync
- improve docker build caching for faster builds
- add extra node info data and query metrics from cli
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed sync race conditions including prover registry pruning, seniority marker joins, and message size limits
- resolved signature failures and merge-related signature errors
- fixed various edge cases: one-shot sync sizing, app shard TC signatures, collector/hotstuff races, expired join blocking
- removed compatibility with old 2.0.0 blossomsub implementation
- fixed abandoned prover joins and stale worker proposals
- improved join sanity checks and fallthrough conditions
- resolved rare SIGFPE and orphaned joins blocking worker reallocation
- added peer reconnect fallback with variable timing and updated base peer count
- fixed expired joins, port ranges, stuck proposers, and seniority issues
- addressed shutdown panics, libp2p peer selection, and coverage event checks
- improved registry refresh logic and worker allocation filtering
- optimized shutdown sequences and worker lifecycle management
- implemented deterministic worker keys to prevent sybil detection
- fixed blossomsub subscription handling and pubsub lifecycle
- switched from dnsaddr to dns4 addressing
- added quic-v1 support
- restored proper respawn logic and fixed hypergraph freeze issues

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
- fixed peer discovery race condition during node startup
- improved peer scoring for blossomsub network
- optimized hypergraph sync performance
- fixed pebble db compaction issue
- resolved blossomsub message validation edge case
- added configurable peer connection limits
- improved error handling for invalid DAGs
- fixed memory leak in prover registry
- optimized channel synchronization logic

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
