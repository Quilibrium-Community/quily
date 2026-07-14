---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-14
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

**Last updated:** July 14, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where initial sync failout permanently idles workers until reboot
- fix transaction safety for hypergraph store writes, ensuring atomic sync application and preventing partial persistence
- make `LazyVectorCommitmentTree::commit` retry-safe by deferring dirty-state clearing until transaction commit succeeds
- make `compute_shard_root` read-only to prevent accidental writes to disk during root computation
- require `RocksTxn` for hypergraph store writes, removing silent direct-write fallback
- handle store wipe scenarios during node leave
- reduce score differential threshold for flagging leave-to-join opportunities, extend scoring-based leave window to a full cycle
- adjust decision margins and thresholds for decide and join operations
- adjust snapshotting to use actual RocksDB snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to `Dockerfile.source`

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static link configuration for flint/mpfr/gmp
- resolve too many joins, invalid signature in qclient, standalone worker mode bugs, and worker logging issues
- fix domain separation bug for invalid signature
- fix tokio thread issue with logging
- fix leaving prover bug in worker allocator
- fix worker storage location bug and reduce log noise
- address edge case with delegate address, resolve stream connection issue with kad-dht
- fix shard store discrepancy and stale 0 frame data response
- fix autonat bug crashing worker threads
- fix router validator tests and quil-engine unit tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- improve rust and docker build times
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix router validator test compilation
- refactor quil-node main into modular submodules (storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, allocator_and_lifecycle, message_loop, archive_sync, grpc)
- fix canonicalization bug for peer info
- propagate errors from subsystems
- resolve OOM from unbounded stores with memory profiling and allocator swap
- fix proposal bug using joining count as part of halt risk calculation
- fix expired leaves not treated as confirmed leaves in proposal logic and worker allocator
- resolve race condition where overlapping joins are submitted
- fix TUI management submission of messages
- increase duration between peer info and key registry publishes
- reduce logging noise on connection events

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relaxed peerstore clearing interval
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimized TUI display
- log shard allocation join confirm/reject plus plan leave details
- set default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed "pending" status to "joining"
- fixed merge spend marker
- fixed sorting and ring position issues in TUI
- fixed render width for [M] marker
- fixed timereel to accept new head immediately
- added timeout for global frame fetch
- added LRU cache to getglobalframe handler
- adjusted estimation behavior to properly calculate ring position and membership set
- fixed worker TUI reward calculation and logical shard count, reduced bandwidth on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject on shard joins and leaves
- fixed dynamic filter width
- improved blossomsub handling and estimate/hard calc changes
- applied migration fixes for eviction issue and improved logging
- refactored global consensus engine into discrete components and updated tests
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- fix possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug env var to be read
- fix newPebbleDB constructor config param
- fix high CPU overhead in initial worker behaviors/ongoing sync
- add extra data to node info, and query metrics from command line
- leave proposals for overcrowded shards
- hub-and-spoke global message broadcasts
- small tweaks to cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure with additional error logging for merge-related signatures
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge case
- add full sanity check on join before submission to identify bugs
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE and orphan expired joins blocking workers from reallocating
- add reconnect fallback with variable reconnect time if no peers found
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, and amend app shard worker behavior for prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- don't loop when shutting down
- fix slight reordering and add named workers to trace hanging shutdowns
- use deterministic key for peer id of workers to stop flagging workers as sybil attacks
- remove pubsub stop from app consensus engine and integrate shutdown context to PerformSync to prevent stuck syncs from halting respawn
- fix blossomsub pubsub interface not properly tracking subscription status
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4 and add missing quic-v1
- fix dnsaddr -> dns4 for blossomsub
- apply sledgehammer to restart logic
- fix restore proper respawn logic, fix frozen hypergraph post respawn, and unsubscribe from previously missing bitmask

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
