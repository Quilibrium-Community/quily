---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-08-07
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

**Last updated:** August 7, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix patch number sync with config
- fix race where initial failout of sync permanently marks workers as idle
- fix transaction safety for hypergraph store writes
- fix vertex data roundtrip test and add new one
- make lazy tree commit retry-safe by deferring dirty-state clearing until transaction is durably committed
- make `compute_shard_root` read-only to prevent writes outside frame transactions
- refactor hypergraph store writes to require RocksTxn, removing silent direct-write fallback
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities
- extend scoring-based leave window to a full cycle
- adjust margins and thresholds for decide and join decisions
- adjust snapshotting to use actual RocksDB snapshots
- resolve unsynced leave issuance condition
- reapply Docker build optimizations to Dockerfile.source (single gen-rust stage, cargo/go cache mounts)
- rejoin a lagging archive by syncing proposals from peers via `GetGlobalProposal` RPC

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- apply possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.19 (version .19) *(auto-generated)*
- Fix sync message size limit defaults and resolve seniority marker join blocker
- Remove compatibility with old 2.0.0 blossomsub
- Resolve abandoned prover joins and reload prover registry
- Fix stale worker proposal edge case
- Add full sanity check on join before submission to identify bugs
- Resolve non-fallthrough condition that should be fallthrough
- Fix rare SIGFPE, orphan expired joins blocking worker reallocation
- Add reconnect fallback with variable reconnect time when no peers found
- Update base peer count to 1
- Fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- Fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic
- Fix shutdown scenario quirks and reload hanging
- Fix bailout early on shutdown of coverage check
- Force registry refresh on worker waiting for registration
- Fix worker manager filter refresh on allocation, snapshots blocking close on shutdown
- Force shutdown after five seconds for app worker
- Fix infinite loop when shutting down
- Add named workers to trace hanging shutdowns
- Use deterministic key for peer ID of workers to prevent sybil attack flagging
- Remove pubsub stop from app consensus engine; integrate shutdown context to PerformSync
- Fix blossomsub pubsub interface subscription status tracking
- Fix subscribe order to avoid nil panic
- Switch from dnsaddr to dns4 for peer discovery
- Add missing quic-v1 transport
- Apply sledgehammer restart logic to fix respawn quirks
- Fix respawn logic and frozen hypergraph post respawn; unsubscribe from bitmask

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
