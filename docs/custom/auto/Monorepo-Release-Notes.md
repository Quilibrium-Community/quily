---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-08-22
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

**Last updated:** August 22, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix transaction safety for hypergraph store writes by threading transactions through lazy tree commit and sync-apply paths
- make `LazyVectorCommitmentTree::commit` retry-safe by deferring dirty-state clearing until transaction is durably committed
- make `compute_shard_root` read-only by extracting read-only `compute_root` method, preventing writes outside frame transactions
- refactor hypergraph store to require `RocksTxn` for writes, removing silent direct-write fallback that masked bugs
- add catch-up mechanism for lagging archive nodes by syncing proposals from peers via `GetGlobalProposal`
- implement `GlobalService.GetGlobalProposal` to serve full proposals with state, QC, TC, and proposer vote
- persist proposer vote at proposal ingest so it can be served back via the store trait
- add `on_missing_parent` hook triggered at orphan-cache site for recovery path wiring
- fix patch number sync with config and race condition where initial sync failure left workers idle forever
- reduce score differential basis for flagging leave-to-join opportunities, extend scoring-based leave window to full cycle
- adjust threshold margins for decide and join decisions
- adjust snapshotting to use actual rocksdb snapshots instead of previous approach
- resolve unsynced leave issuance condition
- reapply docker build optimizations to `Dockerfile.source` (consolidated cargo stages, restored cache mounts)

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking for flint/mpfr/gmp
- resolve standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, worker logging, and various additional bugs
- improve keys file handling and reduce excess joins/leaves
- demote p2p, archive client, coverage halt, shard ops, prover message, and shard frame logs to debug
- resolve domain separation bug for invalid signature
- fix tokio thread issue related to logging
- fast path: push straight to archives to retrieve info
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix prover shard choices, ring number calculation, and TUI quirks for manual mode
- forcibly adjust halt risk shards as primary selection criteria
- address issues 1, 2, 3 from blackswan
- fix Left→Leaving transition and resolve edge cases
- fix worker persistence and missing lock update
- harden prover path and fix shard store discrepancy
- use different source for current frame number
- cache requests to prevent available shards from flashing
- resolve stale 0 frame data response and adjust blossomsub params
- refactor tree behaviors to skip stale data effects
- add halt risk test and switch archive node
- never assume, always ensure prover tree
- add extra logging for worker panics
- handle orphaned allocations and allocations on zero byte shards
- fix issues 1-6 reported by blackswan
- add missing worker_ids field
- fix autonat bug crashing worker threads
- fix build for linux and force static link on libchannel
- fix delegate address edge case and kad-dht stream connection issue
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rust node
- use sha3 for prover join vdf verifier
- fix rust node initialization and router validator test
- refactor quil-node main into submodules (storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, allocator_and_lifecycle, message_loop, archive_sync, grpc)
- fix canonicalization

## v2.1.0.21 (version .21) *(auto-generated)*
- fix formatting/precision on prover reward data
- fix possible peering issue
- fix app shard lookups on mainnet
- reconcile old and new config paths

## v2.1.0.20 (version .20) *(auto-generated)*
- read in debug mode via `DEBUG` environment variable
- fix pebble db constructor config parameter
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- hub-and-spoke global message broadcasts
- minor cli output tweaks for join frames

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
