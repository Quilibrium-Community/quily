---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-11-09
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

**Last updated:** November 9, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race where initial sync failout leaves workers idle until reboot
- fix patch number sync with config
- make hypergraph store writes transaction-safe, including vertex data and tree blob writes
- make LazyVectorCommitmentTree::commit retry-safe by deferring dirty-state clearing until transaction commit
- make compute_shard_root read-only to prevent writes outside frame transactions
- require RocksTxn for hypergraph store writes, removing silent direct-write fallback
- handle store wipe on leave scenario
- reduce score differential basis for flagging leave-to-join opportunities and extend scoring-based leave window to a full cycle
- adjust margins and thresholds for decide/join decisions
- use actual rocksdb snapshots for snapshotting
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- allow lagging archive nodes to rejoin consensus by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking issues for flint/mpfr/gmp
- resolve standalone worker connection string derivation and logging bugs
- fix too many joins, invalid signature, and worker storage location bugs
- demote p2p and archive client logs to debug
- add confirm/reject action and demote shard operation logs to debug
- resolve domain separation bug for invalid signature
- fix tokio thread issue related to logging
- fast path for archive info retrieval
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
- fix too many streams issue and kad-dht stream connection issue
- fix build script to force static link on libchannel
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- add Rust CI with GitHub Actions
- fix vdf link order and enable tests in CI
- improve rust and docker build times
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix rust node initialization issues
- refactor quil-node main into sibling modules
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores with memory profiling and allocator swap
- add diagnostics for message drops and prover management
- fix bitmask of workers and cheaper peek-verification on peer info
- aggressive query for frame to avoid expired joins
- fix leave proposal adjustment for halt risk
- resolve proposal bug using joining count in halt risk calculation
- handle 67% barrier for halt risk
- fix off by one on leave planning
- fix

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and show worker id
- relaxed peerstore clearing interval
- added component-level logger tuning
- added prover management TUI with manual management tracking and worker id joins
- optimized TUI performance
- fixed dbscan compiler error
- added shard allocation join confirm/reject and plan leave details logging
- set default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed pending to joining
- fixed merge spend marker
- fixed sorting and ring position issues in TUI
- fixed render width for [M] marker
- fixed timereel behavior to accept new head immediately
- added timeout for global frame fetch
- added lru cache to getglobalframe handler
- fixed estimation behavior for ring position and membership set
- fixed worker TUI reward calc and logical shard count, reduced bandwidth on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject for shard joins and leaves
- fixed dynamic filter width
- improved blossomsub and estimate/hard calc changes
- added migration and improved logging
- added migration to resolve eviction issue
- refactored global consensus engine into discrete components and updated tests
- adjusted rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting and precision on prover reward data, and address possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- read debug settings from environment variable
- fix pebble db constructor config parameter
- reduce high cpu overhead in initial worker behaviors and ongoing sync
- speed up docker builds with better caching
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- use hub-and-spoke for global message broadcasts
- tweak cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure and merge-related signature logging
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge and add full sanity check on join
- resolve non-fallthrough condition and rare SIGFPE, fix orphan expired joins blocking worker reallocation
- add reconnect fallback with variable timing if no peers found, update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, inaccessible peer discovery, coverage event check in shutdown, and app shard worker prover root reconciliation
- fix shutdown quirks, reload hanging, and early coverage check bailout
- force registry refresh on worker waiting for registration
- fix worker manager filter on allocation, snapshots blocking close on shutdown, and force shutdown after five seconds for app worker
- fix loop on shutdown, add named workers to trace hanging shutdowns
- use deterministic key for worker peer IDs to stop sybil attack flagging
- remove pubsub stop from app consensus engine, integrate shutdown context to PerformSync to prevent stuck syncs halting respawn
- fix blossomsub subscription status tracking, subscribe order nil panic
- switch from dnsaddr to dns4, add missing quic-v1
- apply sledgehammer to restart logic, restore proper respawn, fix frozen hypergraph post respawn, unsubscribe from missing bitmask

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
