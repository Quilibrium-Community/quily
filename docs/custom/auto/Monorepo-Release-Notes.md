---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-30
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

**Last updated:** June 30, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race where initial sync failure leaves workers stuck idle until reboot
- fix patch number sync with config
- fix transaction safety for hypergraph store writes (atomic sync-apply path, retry-safe commit, read-only root computation)
- require concrete rocksdb transaction for store writes, removing silent direct-write fallback
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities, extend scoring-based leave window to a full cycle
- adjust thresholds for decide and join decisions
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to dockerfile.source (consolidated gen stages, cargo/go cache mounts)
- consensus: rejoin a lagging archive by syncing missing proposals from peers (implements getglobalproposal rpc, triggers catch-up on orphan detection)

## v2.1.0.23 (version .23) *(auto-generated)*
- fix build for linux, static link flint/mpfr/gmp, and force static link on libchannel
- fix too many joins, invalid signature in qclient, standalone worker mode, and worker logging to own files
- fix domain separation bug for invalid signature
- resolve tokio thread issue re: logging
- fix leaving prover bug in worker allocator
- resolve worker storage location bug
- fix shard store discrepancy
- resolve stale 0 frame data response
- fix autonat bug crashing worker threads
- fix too many streams issue with kad-dht
- fix propose skip on coverage halts
- fix vdf link order
- fix router_validator_passes_well_formed_peer_info test
- fix quil-engine test compilation and unit tests
- support white spaces in genesis seed for testnets
- support archive endpoints config in rust node
- use sha3 for prover join vdf verifier
- OOM fixes from unbounded stores
- add memory profiling, logging, and swap allocator for OOM tracing
- fix canonicalization bug for peer info
- propagate errors from subsystems
- fix proposal bug using joining count in halt risk calculation
- fix expired leaves not treated as confirmed leaves in proposal logic and worker allocator
- fix race where overlapping joins are submitted
- fix tui manage submission of messages
- refactor quil-node main into master_node modules: storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, allocator_and_lifecycle, message_loop, archive_sync, grpc
- reduce noise in p2p, connection event, and shard operation logging
- increase duration between peer info and key registry publishes

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relaxed peerstore clearing interval
- tuned component-level logging
- added manual management tracking and worker id joins to prover management TUI
- optimized TUI performance
- fixed dbscan compiler error
- logged shard allocation join confirm/reject and plan leave details
- added default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed "pending" to "joining"
- fixed merge spend marker
- fixed sorting and ring position issues in TUI
- fixed render width for [M] marker
- fixed timereel behavior to accept new head immediately
- added timeout for global frame fetch
- added LRU cache to getglobalframe handler
- adjusted estimation behavior for ring position and membership set calculation
- fixed worker TUI reward calculation and logical shard count
- reduced bandwidth on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject for shard joins and leaves
- fixed dynamic filter width
- improved blossomsub with estimate/hard calc changes
- added migration to resolve eviction issue
- refactored global consensus engine into discrete components
- adjusted RPC and worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data, possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fix high CPU overhead in initial worker behaviors and ongoing sync
- fix newPebbleDB constructor config parameter
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure and add error logging for merge-related signatures
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge case
- add full sanity check on join before submission
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE and orphan expired joins blocking worker reallocation
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
- use deterministic key for peer id of workers to prevent sybil attack flagging
- remove pubsub stop from app consensus engine and integrate shutdown context to PerformSync
- fix blossomsub pubsub interface subscription status tracking
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4 and add missing quic-v1
- fix dnsaddr to dns4 for blossomsub
- apply sledgehammer restart logic fix
- restore proper respawn logic, fix frozen hypergraph post respawn, and unsubscribe from previously missing bitmask

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
