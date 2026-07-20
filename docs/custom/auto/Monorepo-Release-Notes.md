---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-20
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

**Last updated:** July 20, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where initial sync failure leaves workers idle forever (requires reboot)
- fix transaction safety for hypergraph store writes
- fix compute_shard_root leaking writes to disk (now read-only)
- make LazyVectorCommitmentTree::commit retry-safe (dirty state clearing deferred until transaction commits)
- require RocksTxn for hypergraph store writes, removing dangerous direct-write fallback
- handle node-wipe on leaving scenario
- reduce score threshold for flagging leave-to-join opportunities, extend leave window to full cycle
- adjust margins and thresholds for decision-making
- switch snapshotting to use actual RocksDB snapshots
- resolve unsynced leave issuance condition
- consensus: lagging archive can now rejoin by syncing proposals from peers (port of Go node’s catch-up path)
- reapply Docker build optimizations (consolidate gen stages, restore cargo/go cache mounts)

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands with worker id display
- relaxed peerstore clearing interval
- component-level logger tuning
- prover management TUI now tracks manual management and specifies joins by worker id
- optimized TUI rendering
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed "pending" state to "joining"
- fixed merge spend marker bug
- fixed sorting and ring position issues in TUI
- fixed render width for [M] marker
- timereel now accepts new head immediately
- added timeout and LRU cache for global frame fetch
- adjusted estimation behavior for ring position and membership set
- fixed worker TUI reward calculation and logical shard count
- reduced bandwidth on app worker
- auto-sized filters for prover commands
- optimized logging for plan/decide and confirm/reject for shard joins and leaves
- fixed dynamic filter width
- blossomsub improvements with estimate/hard calc changes
- migration fix for eviction issue
- refactored global consensus engine into discrete components

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- read debug env variable from `$QUIL_DEBUG`
- fix `newPebbleDB` constructor config parameter
- reduce high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from cli
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak cli output for join frames

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
- fixed bug where the node would not properly handle the case where the prover was not yet ready
- resolved race condition in prover registry pruning
- added DKLs23 fork for improved cryptographic operations
- fixed channel bug causing intermittent message loss
- improved blossomsub protocol stability
- optimized hypergraph traversal for large networks
- updated pebble database configuration for better performance

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
