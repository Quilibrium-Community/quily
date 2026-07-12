---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-12
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

**Last updated:** July 12, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where initial sync failure permanently idles workers
- fix patch number sync with config
- fix transaction safety for hypergraph store writes by threading transactions through lazy-tree commit and sync-apply paths
- make `LazyVectorCommitmentTree::commit` retry-safe by deferring dirty-state clearing until transaction commit succeeds
- make `compute_shard_root` read-only to prevent accidental writes during root computation
- require `RocksTxn` for hypergraph store writes, removing silent direct-write fallback that masked bugs
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities; extend scoring-based leave window to a full cycle; adjust margins and thresholds for decisions and joins
- adjust snapshotting to use actual RocksDB snapshots
- resolve unsynced leave issuance condition
- reapply Docker build optimizations (consolidated gen stages, restored cargo/go cache mounts)
- allow lagging archive nodes to rejoin consensus by syncing missing proposals from peers via `GetGlobalProposal` RPC

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix: formatting/precision on prover reward data, possible solution to peering issue
- fix: app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow reading debug mode from environment variable
- fix newPebbleDB constructor config parameter
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info, and allow querying metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak CLI output for join frames

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

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
