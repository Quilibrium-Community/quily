---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-18
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

**Last updated:** June 18, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking for flint/mpfr/gmp
- resolve standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, worker logging, and keys file handling
- demote p2p, archive client, coverage halt, shard ops, and prover logs to debug
- resolve domain separation bug for invalid signature
- fix tokio thread issue with logging
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix shard store discrepancy and stale 0 frame data response
- adjust blossomsub parameters
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug crashing worker threads
- fix too many streams issue and kad-dht stream connection issue
- fix build script to force static link on libchannel
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix router validator test and canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events and OOM from unbounded stores
- add memory profiling, allocator swap, and diagnostics for message drops
- fix proposal bug using joining count in halt risk calculation
- handle 67% barrier for halt risk
- fix TUI manage submission of messages
- fix expired leaves not treated as confirmed in proposal logic and worker allocator
- resolve race where overlapping joins are submitted
- refactor quil-node main into submodules (storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, allocator_and_lifecycle, message_loop, archive_sync, grpc)

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relax peerstore clearing interval
- add manual prover management tracking in TUI and specify joins by worker id
- log shard allocation join confirm or reject and plan leave details
- set default archive peer list
- fix prover eviction bug, leaving status, and visibility when leave is implicitly accepted
- rename pending to joining
- fix merge spend marker
- fix TUI sorting, ring position, render width for [M] marker, and worker reward calculation
- fix timereel behavior to accept new head immediately
- add timeout and LRU cache for global frame fetch
- adjust estimation behavior to properly calculate ring position and membership set
- auto-sized filters and fix dynamic filter width
- optimize logging for plan/decide and confirm/reject of shard joins and leaves
- blossomsub improvements and estimate/hard calc changes
- fix migrations for eviction issue and improve logging
- adjust rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data, possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add debug env variable support
- fix `newPebbleDB` constructor config parameter
- improve docker build speed with better caching
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure and add error logging for merge-related signatures
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge
- add full sanity check on join before submitting to identify bug
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
- fix loop when shutting down and add named workers to trace hanging shutdowns
- use deterministic key for peer id of workers to stop flagging workers as sybil attacks
- remove pubsub stop from app consensus engine and integrate shutdown context to PerformSync
- fix blossomsub pubsub interface not properly tracking subscription status
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4 and add missing quic-v1
- fix dnsaddr -> dns4 for blossomsub
- apply sledgehammer to restart logic
- fix restore proper respawn logic, frozen hypergraph post respawn, and unsubscribe from bitmask previously missing

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
- fixed channel bug
- added DKLs23 fork
- resolve sync race condition with prover registry pruning

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
