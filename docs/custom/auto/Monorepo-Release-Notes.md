---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-10-08
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

**Last updated:** October 8, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race where initial sync failout leaves workers idle until reboot
- fix patch number sync with config
- make hypergraph store writes transaction-safe, including vertex data and tree blob writes
- make lazy tree commit retry-safe by deferring dirty-state clearing until transaction commit
- make compute_shard_root read-only to avoid leaking writes outside frame transactions
- require RocksTxn for hypergraph store writes, removing silent direct-write fallback
- handle store wipe during leave scenario
- reduce score differential basis for flagging leave-to-join opportunities and extend scoring-based leave window to a full cycle
- adjust margins on decisions and thresholds for decides and joins
- use actual rocksdb snapshots for snapshotting
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- rejoin lagging archive by syncing proposals from peers in global consensus

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue
- static link flint/mpfr, force gmp to static, rework linker for static flint builds
- e2e testnet success on strange edge cases
- standalone worker: derive connection string correctly
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files, and various additional bugs
- keys file handling, pare back excess joins/leaves
- demote p2p loggers to debug
- log archive client connection, coverage halt risk, shard ops, qc submission, prover message submission, shard frame produce, shard spit and merge to debug
- add action to confirm and reject
- resolve domain separation bug for invalid signature
- resolve tokio thread issue re: logging
- fast path: push straight to archives to retrieve info
- fix leaving prover bug in worker allocator
- resolve worker storage location bug + log noise
- smaller tweaks to prover shard choices
- fix worker ring logic for available shards
- forcibly adjust halt risk shards as primary selection criteria
- resolve worker persistence
- harden the prover path
- fix shard store discrepancy
- use different source for current frame number
- cache requests so available shards don't keep flashing
- resolve stale 0 frame data response, adjust blossomsub params
- refactor tree behaviors to skip stale data effects
- never assume, always ensure prover tree
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug crashing worker threads
- fix too many streams issue
- address edge case with delegate address, resolve stream connection issue with kad-dht
- fix build script to force static link on libchannel
- support white spaces in genesis seed for testnets
- add Rust CI with GitHub Actions
- fix vdf link order and enable tests in CI
- update Cargo.lock to fix CI
- improve rust and docker build times
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- rust node initialization fixes
- refactor quil-node main into sibling modules (no behavior changes)
- fix router validator tests
- fix quil-engine unit tests
- fix router_validator_passes_well_formed_peer_info test
- fix vdf link order and enable tests in CI

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relaxed peerstore clearing interval
- added component-level logger tuning
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimized TUI rendering
- log shard allocation join confirm or reject + plan leave details
- default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed pending to joining
- fixed merge spend marker
- fixed sorting/ring position issues in TUI
- fixed render width for [M] marker
- timereel behavior accepts new head immediately
- added timeout for global frame fetch
- added lru cache to getglobalframe handler
- adjusted estimation behavior to properly calculate ring position and membership set
- fixed worker TUI reward calc/logical shard count, bandwidth reduction on app worker
- added auto-sized filters
- optimized logging for plan / decide and confirm / reject for shard joins and leaves
- fixed dynamic filter width
- improved blossomsub, estimate/hard calc changes
- added migration + improved logging
- added new migration to resolve eviction issue
- refactored global consensus engine into discrete components, update tests
- adjusted rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data and address possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- read debug settings from environment variable
- fix newPebbleDB constructor config parameter
- reduce high CPU overhead in initial worker behaviors and ongoing sync
- speed up docker builds with improved caching
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging and fixed seniority marker join blocker
- fixed sync message size limit defaults and one-shot sync message size
- resolved signature failures and added merge-related signature error logging
- fixed app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and reload prover registry
- fixed stale worker proposal edge and added full sanity check on join submission
- resolved non-fallthrough condition that should be fallthrough
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable reconnect time when no peers found
- updated base peer count to 1
- fixed expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fixed panic on shutdown, libp2p discovery picking inaccessible peers, and coverage event check in shutdown logic
- amended app shard worker behavior to mirror global for prover root reconciliation
- fixed shutdown scenario quirks and reload hanging
- fixed early bailout on shutdown of coverage check
- forced registry refresh on worker waiting for registration
- fixed worker manager filter refresh on allocation and snapshots blocking close on shutdown
- forced shutdown after five seconds for app worker and fixed loop on shutdown
- added named workers to trace hanging shutdowns
- used deterministic key for worker peer ids to stop sybil attack flagging
- removed pubsub stop from app consensus engine and integrated shutdown context to PerformSync
- fixed blossomsub pubsub interface subscription status tracking and subscribe order nil panic
- switched from dnsaddr to dns4 and added missing quic-v1
- applied sledgehammer to restart logic and restored proper respawn logic
- fixed frozen hypergraph post respawn and unsubscribe from previously missing bitmask

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
