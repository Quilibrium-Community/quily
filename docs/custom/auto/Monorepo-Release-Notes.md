---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-16
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

**Last updated:** July 16, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where sync workers could become permanently idle after initial failout
- make hypergraph store writes transaction-safe, preventing partial persistence on aborted transactions
- make lazy tree commit retry-safe by deferring dirty-state clearing until transaction commit succeeds
- make compute_shard_root read-only to prevent unintended writes during root comparison
- require RocksTxn for hypergraph store writes, removing silent fallback that masked bugs
- handle node leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities and extend scoring-based leave window
- adjust margins and thresholds for decision and join logic
- use actual RocksDB snapshots for snapshotting
- resolve unsynced leave issuance condition
- reapply Docker build optimizations (consolidate gen stages, restore cache mounts)
- enable lagging archive nodes to rejoin consensus by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue with static linking for flint/mpfr/gmp
- resolve standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, worker logging, and various additional bugs
- improve keys file handling and reduce excess joins/leaves
- demote p2p, archive client, coverage halt, shard ops, prover message, and shard frame logs to debug
- add action to confirm and reject shard operations
- resolve domain separation bug for invalid signature
- fix tokio thread issue related to logging
- fast path: push straight to archives to retrieve info
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix prover shard choices, ring number calculation, and TUI quirks for manual mode
- forcibly adjust halt risk shards as primary selection criteria
- address issues 1,2,3 from blackswan
- fix Left→Leaving transition and resolve edge cases
- resolve worker persistence and missing lock update
- harden prover path and fix shard store discrepancy
- use different source for current frame number
- cache requests to prevent available shards from flashing
- resolve stale 0 frame data response and adjust blossomsub parameters
- refactor tree behaviors to skip stale data effects
- add halt risk test and switch archive node
- never assume, always ensure prover tree
- add extra logging for worker panics
- handle orphaned allocations and allocations on zero byte shards
- fix issues 1-6 reported by blackswan
- add missing worker_ids field
- fix autonat bug crashing worker threads
- fix build for linux, fix too many streams issue
- address edge case with delegate address, resolve stream connection issue with kad-dht
- fix build script to force static link on libchannel
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix rust node initialization issues
- refactor quil-node main into submodules (storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, alloc

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
- fix possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- added debug mode support via `DEBUG` environment variable
- fixed pebble database constructor configuration parameter
- fixed high CPU overhead during initial worker behaviors and ongoing sync
- added extra data to node info and queryable metrics from CLI
- updated proposal handling to leave proposals for overcrowded shards
- added hub-and-spoke global message broadcasts
- improved CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge
- add full sanity check on join before submitting
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE and orphan expired joins blocking workers from reallocating
- add reconnect fallback if no peers are found with variable reconnect time
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, and amend app shard worker behavior for prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- fix bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- fix loop when shutting down
- fix reordering and add named workers to trace hanging shutdowns
- use deterministic key for peer id of workers to stop flagging workers as sybil attacks
- remove pubsub stop from app consensus engine and integrate shutdown context to PerformSync
- fix blossomsub pubsub interface not properly tracking subscription status
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4
- add missing quic-v1
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

## v2.1.0.11 (version .11) *(auto-generated)*
- no commit messages available for version 2.1.0.11

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
