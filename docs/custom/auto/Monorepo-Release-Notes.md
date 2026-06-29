---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-29
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

**Last updated:** June 29, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition preventing sync workers from recovering after initial failure
- make hypergraph store writes transaction-aware to prevent partial persistence
- make `LazyVectorCommitmentTree::commit` retry-safe by deferring dirty-state clearing
- make `compute_shard_root` read-only to prevent unintentional writes during root computation
- require concrete `RocksTxn` for hypergraph store writes, removing silent fallback
- handle node leaving scenario with store wipe
- reduce score differential threshold for flagging leave-to-join opportunities
- extend scoring-based leave window to full cycle
- adjust margins and thresholds for decide and join decisions
- use actual rocksdb snapshots for snapshotting
- resolve unsynced leave issuance condition
- reapply docker build optimizations to `Dockerfile.source`
- implement sync of proposals from peers so lagging archive nodes can rejoin consensus

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue with static linking
- resolve standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files
- fix keys file handling, reduce excess joins/leaves
- demote p2p loggers to debug
- resolve domain separation bug for invalid signature
- resolve tokio thread issue with logging
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix shard store discrepancy
- fix stale 0 frame data response, adjust blossomsub params
- fix autonat bug crashing worker threads
- fix build for linux, force static link on libchannel
- fix too many streams issue
- address edge case with delegate address, resolve stream connection issue with kad-dht
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rust node
- use sha3 for prover join vdf verifier
- fix rust node initialization
- refactor quil-node main into submodules (storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, allocator_and_lifecycle, message_loop, archive_sync, grpc)
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores, add memory profiling and allocator swap
- fix proposal bug using joining count as part of halt risk calculation
- handle 67% barrier for halt risk
- fix TUI manage submission of messages
- fix expired leaves not treated as confirmed leaves in proposal logic and worker allocator
- resolve loop of halt risk swap
- resolve race where overlapping joins are submitted

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relaxed peerstore clearing interval
- component-level logger tuning
- prover management TUI adds manual management tracking and joins by worker id
- optimized TUI performance
- fixed dbscan compiler error
- log shard allocation join confirm/reject and plan leave details
- fixed prover eviction bug
- small tweaks for prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed "pending" to "joining"
- fixed merge spend marker
- fixed sorting and ring position issues in TUI
- fixed render width for [M] marker
- timereel now accepts new head immediately
- added timeout and LRU cache for global frame fetch
- adjusted estimation behavior to calculate ring position and membership set correctly
- fixed worker TUI reward calculation and logical shard count
- reduced bandwidth usage on app worker
- auto-sized filters
- optimized logging for shard join/leave plan, decide, confirm, and reject
- fixed dynamic filter width
- blossomsub improvements and estimate/hard calc changes
- new migration to resolve eviction issue
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- address peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- added debug environment variable
- fixed newPebbleDB constructor config parameter
- fixed high CPU overhead in initial worker behaviors and ongoing sync
- added extra data to node info and query metrics from command line
- made proposals leave overcrowded shards
- implemented hub-and-spoke global message broadcasts
- tweaked cli output for join frames

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
