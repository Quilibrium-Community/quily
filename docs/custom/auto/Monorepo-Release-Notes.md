---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-15
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

**Last updated:** June 15, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue with static linking
- resolve standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files
- fix keys file handling, reduce excess joins/leaves
- resolve domain separation bug for invalid signature
- fix tokio thread issue with logging
- fix leaving prover bug in worker allocator
- resolve worker storage location bug
- fix shard store discrepancy
- resolve stale 0 frame data response, adjust blossomsub params
- fix autonat bug crashing worker threads
- fix too many streams issue
- address edge case with delegate address, resolve stream connection issue with kad-dht
- fix build script to force static link on libchannel
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order
- support archive endpoints config in rs node
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
- tuned component-level logging
- added manual management tracking and worker id joins to prover management TUI
- optimized TUI performance
- fixed dbscan compiler error
- logged shard allocation join confirm/reject and plan leave details
- set default archive peer list
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
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- allow debug env var to be read
- fix newPebbleDB constructor config parameter
- small tweaks to cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- Fix seniority marker join blocker and sync message size limit defaults
- Resolve signature failure
- Fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- Remove compatibility with old 2.0.0 blossomsub
- Resolve abandoned prover joins and reload prover registry; fix stale worker proposal edge
- Add full sanity check on join before submitting
- Fix non-fallthrough condition that should be fallthrough
- Fix rare SIGFPE and orphan expired joins blocking workers from reallocating
- Add reconnect fallback with variable reconnect time when no peers found
- Update base peer count to 1
- Fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- Fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check omission in shutdown logic, and amend app shard worker behavior to mirror global for prover root reconciliation
- Fix shutdown scenario quirks, reload hanging, and early bailout on coverage check shutdown
- Force registry refresh on worker waiting for registration
- Fix worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- Force shutdown after five seconds for app worker; fix looping and add named workers to trace hanging shutdowns
- Use deterministic key for peer id of workers to prevent flagging as sybil attacks
- Fix pubsub stop from app consensus engine (should not manage pubsub lifecycle); integrate shutdown context to PerformSync to prevent stuck syncs from halting respawn
- Fix blossomsub pubsub interface not properly tracking subscription status
- Fix subscribe order to avoid nil panic
- Switch from dnsaddr to dns4 for address resolution; add missing quic-v1 transport
- Restore proper respawn logic, fix frozen hypergraph post respawn, and unsubscribe from previously missing bitmask

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
- fixed blossomsub peer scoring to not penalize for duplicate messages
- resolved race condition in peer scoring during blossomsub reconnection
- added configurable max message size for blossomsub
- fixed hypergraph sync issue causing stalled replication
- improved pebble database compaction scheduling to reduce I/O spikes
- patched memory leak in proof-of-work verification cache
- updated default bootstrap peers list

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
