---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-25
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

**Last updated:** July 25, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where initial sync failure left workers permanently idle
- fix patch number sync with config
- fix transaction safety for hypergraph store writes
- make lazy tree commit retry-safe by deferring dirty-state clearing until transaction commit
- make compute_shard_root read-only to prevent writes outside frame transactions
- require RocksTxn for hypergraph store writes, removing silent direct-write fallback
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities
- extend scoring-based leave window to a full cycle
- adjust margins on decisions and thresholds for decides and joins
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- add consensus catch-up for lagging archives by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking issues
- fix standalone worker connection string derivation
- fix too many joins/leaves, invalid signature in qclient, standalone worker mode bugs, worker logging to separate files
- fix domain separation bug causing invalid signatures
- fix tokio thread issue with logging
- fix leaving prover bug in worker allocator
- fix worker storage location bug and reduce log noise
- fix prover shard choice edge cases
- fix TUI quirks for manual mode
- adjust worker ring logic for available shards
- prioritize halt risk shards as primary selection criterion
- address bugs 1,2,3 from blackswan
- fix stale 0 frame data response and adjust blossomsub parameters
- refactor tree behavior to skip stale data effects
- handle orphaned allocations and allocations on zero byte shards
- fix bugs 1-6 reported by blackswan
- fix autonat bug crashing worker threads
- fix build for linux, force static link on libchannel
- fix stream connection issue with kad-dht
- fix delegate address edge case
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order for building
- enable tests in CI
- support archive endpoints configuration in Rust node
- use sha3 for prover join vdf verifier
- fix Rust node initialization
- fix router validator test
- refactor quil-node main into submodules (

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
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- address potential peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug env var to be read
- fix newPebbleDB constructor config param
- fix high CPU overhead in initial worker behaviors/ongoing sync
- add extra data to node info, and query metrics from command line
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
