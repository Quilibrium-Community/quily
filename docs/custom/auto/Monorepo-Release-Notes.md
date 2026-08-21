---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-08-21
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

**Last updated:** August 21, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix patch number sync with config
- fix race condition where initial sync failure left workers idle until reboot
- fix transaction safety for hypergraph store writes – aborted transactions no longer persist partial data
- make lazy tree commit retry-safe – dirty state is cleared only after transaction commits, allowing safe retry on failure
- make `compute_shard_root` read-only – no longer writes to disk outside a transaction
- require `RocksTxn` for hypergraph store writes, removing silent direct-write fallback that masked bugs
- handle leaving scenario with store wipe
- reduce score differential threshold for flagging leave-to-join opportunities
- extend scoring-based leave window to a full cycle
- adjust margins on join/decision thresholds
- adjust snapshotting to use actual RocksDB snapshots
- resolve unsynced leave issuance condition
- reapply Docker build optimizations (consolidated gen stages, cargo/go cache mounts)
- consensus: rejoin a lagging archive by syncing proposals from peers – missing parent proposals are fetched on demand, enabling a partitioned node to catch up and resume voting

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue
- resolve domain separation bug for invalid signature
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files, and various additional bugs
- fix leaving prover bug in worker allocator
- resolve worker storage location bug
- fix shard store discrepancy
- fix stale 0 frame data response, adjust blossomsub params
- fix autonat bug crashing worker threads
- fix too many streams issue
- fix build script to force static link on libchannel
- fix propose skip on coverage halts
- fix vdf link order
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix canonicalization bug for peer info
- propagate errors from subsystems
- fix OOM from unbounded stores
- add memory profiling and logging to trace oom
- fix proposal bug using joining count as part of halt risk calculation
- handle 67% barrier for halt risk
- fix tui manage submission of messages
- fix bug where expired leaves were not treated as confirmed leaves in proposal logic and worker allocator
- resolve race where overlapping joins are submitted
- refactor quil-node main into submodules (storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, allocator_and_lifecycle, message_loop, archive_sync, grpc)
- support white spaces in genesis seed for testnets
- reduce logging noise on noisy connection events
- increase duration between peer info and key registry publishes

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- fix peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug env var to be read
- fix newPebbleDB constructor config parameter
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- small tweaks to cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- resolve sync message size limit defaults and one-shot sync size
- fix app shard TC signature size and collector/hotstuff race condition
- fix expired joins blocking new joins due to pruning disable
- fix abandoned prover joins and reload prover registry
- fix stale worker

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
