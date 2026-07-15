---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-15
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

**Last updated:** July 15, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where sync workers idle forever after initial failure (until reboot)
- fix patch number sync with config
- fix transaction safety for hypergraph store writes, making commits retry-safe
- make compute_shard_root read-only to prevent accidental writes outside transactions
- require rocksdb transactions for hypergraph store writes, removing silent fallback
- handle store wipe on leaving scenario
- reduce score differential basis for leave-to-join opportunities and extend leave window to full cycle
- adjust margins on decisions, decides, and joins
- use actual rocksdb snapshots for snapshotting
- resolve unsynced leave issuance condition
- reapply docker build optimizations (cargo cache mounts, consolidated gen stages)
- rejoin lagging archive nodes by syncing proposals from peers when orphaned or partitioned

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking for flint/mpfr/gmp
- resolve standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files
- resolve domain separation bug for invalid signature
- fix tokio thread issue with logging
- fix leaving prover bug in worker allocator
- fix worker storage location bug
- fix shard store discrepancy
- fix stale 0 frame data response
- resolve autonat bug crashing worker threads
- fix address edge case with delegate address
- fix stream connection issue with kad-dht
- fix build script to force static link on libchannel
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix canonicalization bug for peer info
- fix OOM from unbounded stores with memory profiling
- fix message drops diagnostics
- fix proposal bug with joining count in halt risk calculation
- fix 67% barrier handling for halt risk
- fix off by one on leave planning
- fix tui manage submission of messages
- fix expired leaves not treated as confirmed leaves in proposal logic and worker allocator
- fix overlapping join submission race
- refactor quil-node main by extracting sibling modules (storage, keys, engines, frame pipeline, networking, runtime state, peer info publisher, worker manager, allocator and lifecycle, message loop, archive sync, gRPC)
- reduce noisy p2p and connection event logging
- demote various shard ops, prover message submission, and log coverage logs to debug

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relaxed peerstore clearing interval
- added component-level logger tuning
- prover management TUI now tracks manual management and specifies joins by worker id
- optimized TUI rendering (round 2)
- log shard allocation join confirm/reject and plan leave details
- default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed "pending" to "joining"
- fixed merge spend marker
- fixed sorting/ring position issues in TUI
- fixed render width for [M] marker
- timereel now accepts new head immediately
- added timeout for global frame fetch
- added LRU cache to getglobalframe handler
- adjusted estimation behavior to correctly calculate ring position and membership set
- fixed worker TUI reward calculation and logical shard count
- reduced bandwidth on app worker
- auto-sized filters
- optimized logging for plan/decide and confirm/reject for shard joins and leaves
- fixed dynamic filter width
- blossomsub improvements with estimate/hard calc changes
- fixed migration and improved logging
- new migration to resolve eviction issue
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data, address peering issue
- fix app shard lookups on mainnet

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
- fixed blossomsub peer scoring to prevent premature disconnection
- resolved race condition in prover registry pruning during sync
- improved channel message delivery reliability
- added DKLs23 fork for enhanced cryptographic operations
- updated pebble database compaction settings for better performance
- corrected hypergraph traversal order in proof generation

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
