---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-08-26
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

**Last updated:** August 26, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where sync failout could leave workers idle forever
- fix transaction safety for hypergraph store writes, make lazy-tree commit retry-safe, make compute_shard_root read-only, and require RocksTxn for store writes
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities, extend scoring-based leave window

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking issues for flint/mpfr/gmp
- resolve standalone worker connection string derivation and logging bugs
- fix too many joins, invalid signature, and worker storage location bugs
- demote p2p and shard operation logs to debug
- add confirm/reject action and log shard split/merge to debug
- resolve domain separation bug for invalid signature
- fix tokio thread issue re: logging
- fast path to push straight to archives for info retrieval
- fix leaving prover bug in worker allocator
- adjust prover shard choices and ring number calculation
- fix TUI quirks for manual mode
- forcibly adjust halt risk shards as primary selection criteria
- address blackswan reports 1-3 and 1-6
- resolve worker persistence and missing lock update
- harden prover path and fix shard store discrepancy
- use different source for current frame number
- cache requests to avoid flashing available shards
- resolve stale 0 frame data response and adjust blossomsub params
- refactor tree behaviors to skip stale data effects
- add halt risk test and switch archive node
- handle orphaned allocations and zero byte shards
- fix autonat bug crashing worker threads
- fix too many streams issue and stream connection issue with kad-dht
- fix build script to force static link on libchannel
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- add Rust CI with GitHub Actions
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- improve rust and docker build times
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix rust node initialization and router validator test
- refactor quil-node main into sibling modules (storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, allocator_and_lifecycle, message_loop, archive_sync, grpc)
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- increase duration between peer info and key registry publishes
- add memory profiling and logging to trace OOM
- swap allocator and adjust memory settings
- add diagnostics for message drops and prover management
- aggressive query for frame

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relax peerstore clearing interval
- component-level logger tuning
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimize TUI
- log shard allocation join confirm/reject + plan leave details
- default archive peer list
- fix prover eviction bug
- small tweaks around prover visibility when leaving is implicitly accepted
- fix prover leaving status in event distributor
- rename pending to joining
- fix merge spend marker
- fix sorting/ring position issues in TUI
- fix render width for [M] marker
- timereel behavior should accept new head immediately
- add timeout for global frame fetch
- add lru cache to getglobalframe handler
- adjust estimation behavior to properly calculate ring position and membership set
- fix worker TUI reward calc/logical shard count, bandwidth reduction on app worker
- auto-sized filters
- optimize logging for plan/decide and confirm/reject for shard joins and leaves
- fix dynamic filter width
- blossomsub improvements, estimate/hard calc changes
- fix migration + improved logging
- new migration to resolve eviction issue
- refactor global consensus engine into discrete components, update tests
- adjust rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- resolve feedback
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- fix prover reward data formatting/precision, address peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug environment variable to be read
- fix newPebbleDB constructor config parameter
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak cli output for join frames

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
