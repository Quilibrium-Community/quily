---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-04-14
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

**Last updated:** April 14, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- optimized component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- fixed prover eviction and leaving status bugs
- resolved shard allocation join/confirm/reject logic and plan leave details
- added default archive peer list
- fixed dbscan compiler error and merge issues
- improved TUI with better worker reward calculations and logical shard counts
- optimized bandwidth reduction for app workers
- implemented auto-sized filters
- fixed blossomsub behavior and estimation calculations
- resolved dynamic filter width issues
- improved migration process and logging
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display and TUI rendering
- fixed timereel behavior to accept new head immediately
- added timeout for global frame fetch and LRU cache
- corrected ring position and membership set calculations

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback handling issues
- reconciled old and new configuration paths
- fixed prover reward data formatting and precision
- improved peering reliability
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and sync
- added debug environment variable support
- fixed pebbleDB constructor config parameter
- improved docker build caching
- added extra node info data and command line metrics query
- implemented leave proposals for overcrowded shards
- added hub-and-spoke global message broadcasts
- tweaked CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed seniority marker join blocker and sync message size limit defaults
- resolved signature failures and added merge-related signature error logging
- fixed one-shot sync message size, app shard TC signature size, and collector/hotstuff race condition
- resolved expired joins blocking new joins due to pruning disable
- removed compatibility with old 2.0.0 blossomsub
- fixed abandoned prover joins and stale worker proposal edge
- added full sanity check on join submissions
- resolved rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable time when no peers found
- updated base peer count to 1
- fixed expired prover join frames, starting port ranges, and proposer getting stuck
- resolved shutdown panics and libp2p discovery picking inaccessible peers
- fixed coverage event checks during shutdown and app shard worker behavior
- improved shutdown handling and registry refresh timing
- added worker manager filter refresh on allocation
- prevented snapshots from blocking shutdown
- enforced worker shutdown after five seconds
- added named workers for shutdown tracing
- switched to deterministic keys for worker peer IDs
- fixed pubsub lifecycle management in app consensus engine
- resolved blossomsub subscription tracking issues
- changed from dnsaddr to dns4 and added quic-v1 support
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
- fixed blossomsub peer discovery race condition
- optimized hypergraph validation during sync
- improved peer scoring for blossomsub networks
- added graceful shutdown handling for pebble storage
- reduced memory usage in large batch processing
- fixed edge case in DKLs23 fork validation
- improved error recovery for corrupted channel states

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
