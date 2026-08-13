---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-08-13
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

**Last updated:** August 13, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where sync workers could become permanently idle after initial failout
- fix patch number synchronization with config
- fix transaction safety for hypergraph store writes by making write operations transaction-aware
- fix lazy tree commit retry safety by deferring dirty-state clearing until after transaction commit
- make compute_shard_root read-only to prevent accidental writes during root computation
- refactor hypergraph store to require RocksTxn for all write operations, removing silent direct-write fallback
- handle scenario where node leaves the network with store wipe
- reduce score differential threshold for flagging leave-to-join opportunities
- extend scoring-based leave window to a full cycle
- adjust decision and join thresholds
- use actual rocksdb snapshots for snapshotting
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- enable rejoin of lagging archive nodes by syncing proposals from peers

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relaxed peerstore clearing interval
- added component-level logger tuning
- prover management TUI now tracks manual management and specifies joins by worker id
- optimized TUI performance
- fixed dbscan compiler error
- log shard allocation join confirm/reject and plan leave details
- added default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed "pending" to "joining"
- fixed merge spend marker
- fixed sorting/ring position issues in TUI
- fixed render width for [M] marker
- timereel now accepts new head immediately
- added timeout for global frame fetch
- added lru cache to getglobalframe handler
- adjusted estimation behavior for ring position and membership set calculation
- fixed worker TUI reward calculation and logical shard count
- reduced bandwidth on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject for shard joins and leaves
- fixed dynamic filter width
- improved blossomsub with estimate/hard calc changes
- added migration to resolve eviction issue
- refactored global consensus engine into discrete components
- adjusted rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data, possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging and fixed seniority marker join blocker
- fixed sync message size limit defaults and one-shot sync message size
- resolved signature failures and added logging for merge-related signatures
- fixed app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and reload prover registry
- fixed stale worker proposal edge and added full sanity check on join
- resolved non-fallthrough condition that should be fallthrough
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable reconnect time and updated base peer count to 1
- fixed expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fixed panic on shutdown, libp2p discovery picking inaccessible peers, and coverage event check in shutdown logic
- amended app shard worker behavior to mirror global for prover root reconciliation
- fixed shutdown scenario quirks and reload hanging
- fixed early bailout on shutdown of coverage check
- forced registry refresh on worker waiting for registration
- fixed worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- forced shutdown after five seconds for app worker and fixed looping on shutdown
- added named workers to trace hanging shutdowns
- used deterministic key for peer id of workers to stop flagging workers as sybil attacks
- removed pubsub stop from app consensus engine and integrated shutdown context to PerformSync
- fixed blossomsub pubsub interface subscription status tracking and subscribe order to avoid nil panic
- switched from dnsaddr to dns4 and added missing quic-v1
- applied sledgehammer to restart logic
- restored proper respawn logic, fixed frozen hypergraph post respawn, and unsubscribed from bitmask previously missing

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
