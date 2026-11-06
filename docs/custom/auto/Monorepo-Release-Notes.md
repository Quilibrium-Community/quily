---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-11-06
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

**Last updated:** November 6, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race where initial sync failout leaves workers idle until reboot
- fix patch number sync with config
- make hypergraph store writes transaction-safe
- make LazyVectorCommitmentTree::commit retry-safe by deferring dirty-state clearing until transaction commit
- make compute_shard_root read-only
- require RocksTxn for hypergraph store writes
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities
- extend scoring-based leave window to a full cycle
- adjust margins on decisions
- adjust threshold for decides and joins
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- rejoin lagging archive by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- static link flint/mpfr and force gmp to static for linux builds
- fix docker build issues
- fix standalone worker connection string derivation
- fix too many joins/leaves, invalid signatures in qclient, standalone worker mode bugs, worker log file handling, and various related bugs
- demote p2p and archive client connection logs to debug
- resolve domain separation bug for invalid signatures
- fix tokio thread issue with logging
- fast path for pushing straight to archives to retrieve info
- resolve leaving prover bug in worker allocator
- resolve worker storage location bug, reduce log noise
- adjust prover shard choices and ring number calculation
- fix TUI quirks for manual mode
- forcibly adjust halt risk shards as primary selection criteria
- address reported issues from blackswan and bug reports
- resolve worker persistence and missing lock update
- harden prover path, fix shard store discrepancy
- use different source for current frame number, cache requests for stable shard display
- resolve stale zero-frame data response, adjust blossomsub params
- refactor tree behaviors to skip stale data effects
- add halt risk test
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug crashing worker threads, resolve stream connection issues with kad-dht
- fix too many streams issue
- address edge case with delegate address
- fix build script to force static link on libchannel
- fix quil-engine unit tests and compilation
- fix router validator tests and router_validator_passes_well_formed_peer_info test
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order, enable tests in CI
- improve rust and docker build times
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- rust node initialization fixes
- refactor quil-node main into sibling modules with no behavior changes
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- increase duration between peer info and key registry publishes
- address OOM from unbounded stores, add memory profiling and allocator swap
- reduce memory usage with adjustments and profiling
- fix bitmask of workers, cheaper peek-verification on peer info
- aggressive query for frame to avoid expired joins
- leave

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relaxed peerstore clearing interval
- component-level logger tuning
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimized TUI round 2
- log shard allocation join confirm or reject + plan leave details
- default archive peer list
- fixed prover eviction bug
- small tweaks around prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed pending to joining
- fixed merge spend marker
- fixed weird sorting/ring position issues in TUI
- fixed render width for [M] marker
- timereel behavior should accept new head immediately
- added timeout for global frame fetch
- added lru cache to getglobalframe handler
- adjusted estimation behavior to properly calculate ring position and membership set
- worker TUI reward calc/logical shard count, bandwidth reduction on app worker
- auto-sized filters
- optimized logging for plan / decide and confirm / reject for shard joins and leaves
- fixed dynamic filter width
- blossomsub improvements, estimate/hard calc changes
- fixed migration + improved logging
- new migration to resolve eviction issue
- refactored global consensus engine into discrete components, update tests
- adjusted rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix possible peering issue
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
- enhanced error logging and sync message size limit defaults
- resolve signature failure and merge-related signature logging
- fix sync message size, app shard TC signature size, collector/hotstuff race condition
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge and non-fallthrough condition
- add full sanity check on join before submission
- resolve rare SIGFPE and orphan expired joins blocking worker reallocation
- add reconnect fallback with variable reconnect time and update base peer count
- fix expired prover join frames, port ranges, proposer stalls, and seniority on joins
- fix panic on shutdown, inaccessible peer discovery, and app shard worker behavior
- fix shutdown quirks, reload hanging, and coverage check early bailout
- force registry refresh on workers awaiting registration
- fix worker manager filter refresh and snapshot blocking on shutdown
- force shutdown after five seconds for app worker and prevent loops on shutdown
- add named workers to trace hanging shutdowns
- use deterministic peer ids for workers to avoid sybil flags
- remove pubsub stop from app consensus engine and integrate shutdown context into PerformSync
- fix blossomsub subscription status tracking and subscribe order to avoid nil panic
- switch from dnsaddr to dns4 and add missing quic-v1
- sort-of fix: apply sledgehammer to restart logic
- restore proper respawn logic, fix frozen hypergraph post respawn, and unsubscribe from missing bitmask

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
