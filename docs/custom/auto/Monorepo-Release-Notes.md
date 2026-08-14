---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-08-14
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

**Last updated:** August 14, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix transaction safety for hypergraph store writes so aborted transactions no longer persist partial data
- make lazy vector commitment tree commit retry-safe by deferring dirty-state clearing until the surrounding transaction is durably committed
- make compute_shard_root read-only to prevent writes outside any frame transaction
- require rocksdb transactions for hypergraph store writes, removing the silent direct-write fallback
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities and extend scoring-based leave window to a full cycle
- adjust margins on decisions and threshold for decides and joins
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optim

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issues with static linking for flint/mpfr/gmp
- resolve standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, worker logging to own files
- fix keys file handling and reduce excess joins/leaves
- resolve domain separation bug for invalid signature
- fix tokio thread issue related to logging
- add fast path to push straight to archives for info retrieval
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix prover shard choices and ring number calculation quirks
- fix TUI quirks for manual mode
- forcibly adjust halt risk shards as primary selection criteria
- address blackswan issues 1, 2, 3
- fix edge cases with Left→Leaving transition
- resolve worker persistence and missing lock update
- harden prover path and fix shard store discrepancy
- use different source for current frame number
- cache requests to prevent available shards from flashing
- resolve stale 0 frame data response
- adjust blossomsub parameters
- refactor tree behaviors to skip stale data effects
- add halt risk test
- fix race condition in prover tree
- handle orphaned allocations and allocations on zero byte shards
- fix blackswan issues 1-6
- fix autonat bug crashing worker threads
- fix build for linux
- fix too many streams issue
- address edge case with delegate address
- resolve stream connection issue with kad-dht
- fix build script to force static link on libchannel
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix rust node initialization issues
- refactor quil-node main into sibling modules (storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, allocator_and_lifecycle, message_loop, archive_sync, grpc)
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- increase duration between peer info and key registry publishes
- fix OOM from unbounded

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relaxed peerstore clearing interval
- added component-level logger tuning
- prover management TUI now tracks manual management and specifies joins by worker id
- optimized TUI performance
- fixed dbscan compiler error
- log shard allocation join confirm/reject and plan leave details
- set default archive peer list
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
- adjusted estimation behavior for ring position and membership set calculation
- fixed worker TUI reward calculation and logical shard count
- reduced bandwidth on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject for shard joins and leaves
- fixed dynamic filter width
- improved blossomsub with estimate/hard calc changes
- added migration to resolve eviction issue
- refactored global consensus engine into discrete components and updated tests
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data, possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add debug env variable support
- fix newPebbleDB constructor config parameter
- improve docker build caching for faster builds
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure with enhanced error logging
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge case
- add full sanity check on join before submission to identify bugs
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE and orphan expired joins blocking worker reallocation
- add reconnect fallback with variable reconnect time if no peers found
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, and amend app shard worker behavior for prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- add more logging to wait for prover
- fix worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- don't loop when shutting down
- fix slight reordering and add named workers to trace hanging shutdowns
- use deterministic key for peer id of workers to stop flagging workers as sybil attacks
- remove pubsub stop from app consensus engine and integrate shutdown context to PerformSync to prevent stuck syncs from halting respawn
- fix blossomsub pubsub interface not properly tracking subscription status
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4 and add missing quic-v1
- add additional logging to isolate respawn quirks
- fix dnsaddr to dns4 for blossomsub
- apply sledgehammer to restart logic
- fix restore proper respawn logic, fix frozen hypergraph post respawn, and unsubscribe from bitmask previously missing

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
