---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-10-20
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

**Last updated:** October 20, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race where initial sync failout leaves workers idle forever
- fix patch number sync with config
- make hypergraph store writes transaction-safe
- make lazy tree commit retry-safe by deferring dirty-state clearing until transaction commit
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
- fix docker build static link issues for flint/mpfr/gmp and libchannel
- resolve user-reported bugs including too many joins, invalid signature in qclient, standalone worker mode issues, and worker logging
- improve worker storage location handling and prover shard selection logic
- add support for archive endpoints configuration in Rust node
- fix domain separation bug for invalid signature verification
- address worker allocator bug when leaving prover
- resolve halt risk calculation edge cases, including 67% barrier handling
- fix expired leaves not treated as confirmed in proposal logic and worker allocator
- resolve race condition with overlapping join submissions
- fix leave proposal logic using joining count in halt risk calculation
- handle orphaned allocations and allocations on zero byte shards
- address autonat bug causing worker thread crashes
- fix stream connection issue with kad-dht
- reduce P2P and connection event logging noise
- fix too many streams issue
- correct off-by-one in leave planning
- fix TUI manage submission of messages
- support white spaces in genesis seed for testnets
- use sha3 for prover join vdf verifier
- fix quil-engine unit tests and router validator tests
- add Rust CI with GitHub Actions and enable tests in CI
- improve Rust and Docker build times
- fix vdf link order
- refactor quil-node main.rs extracting subsystems into modular components (storage, keys, engines, frame pipeline, networking, runtime state, worker manager, allocator, message loop, archive sync, gRPC)
- propagate errors from subsystems
- fix canonicalization bug for peer info
- add memory profiling and logging to trace OOM, including allocator swap
- increase duration between peer info and key registry publishes
- fix bitmask of workers on message drops
- add cheaper peek-verification on peer info for faster roundtrip ignores
- aggressive query for frame to avoid expired joins
- resolve loop of halt risk swap

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and TUI, showing worker id and manual management tracking
- relaxed peerstore clearing interval
- added component-level logger tuning
- added shard allocation join confirm/reject and plan leave details logging
- fixed prover eviction bug and leaving status in event distributor
- renamed pending to joining for prover visibility
- fixed merge spend marker and ring position/sorting issues in TUI
- fixed render width for [M] marker and dynamic filter width
- fixed timereel behavior to accept new head immediately
- added timeout and lru cache for global frame fetch
- adjusted estimation behavior for ring position and membership set calculation
- fixed worker TUI reward calc/logical shard count and bandwidth reduction on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject shard joins and leaves
- improved blossomsub with estimate/hard calc changes
- added migrations to resolve eviction issue
- refactored global consensus engine into discrete components, updated tests
- adjusted rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting and precision on prover reward data, and address possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug env var to be read
- fix newPebbleDB constructor config param
- fix high CPU overhead in initial worker behaviors and ongoing sync
- faster docker builds with better caching
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- hub-and-spoke global message broadcasts
- small tweaks to cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging and fixed seniority marker join blocker
- fixed sync message size limit defaults and one-shot sync message size
- resolved signature failure and added logging for merge-related signatures
- fixed app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and reload prover registry
- fixed stale worker proposal edge
- added full sanity check on join before submitting
- resolved non-fallthrough condition that should be fallthrough
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable reconnect time when no peers found
- updated base peer count to 1
- fixed expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fixed panic on shutdown, libp2p discovery picking inaccessible peers, and coverage event check not in shutdown logic
- amended app shard worker behavior to mirror global for prover root reconciliation
- fixed shutdown scenario quirks and reload hanging
- fixed early bailout on shutdown of coverage check
- forced registry refresh on worker waiting for registration
- added more logging to wait for prover
- fixed worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- forced shutdown after five seconds for app worker
- fixed loop when shutting down
- added named workers to trace hanging shutdowns
- used deterministic key for peer id of workers to stop flagging workers as sybil attacks
- removed pubsub stop from app consensus engine and integrated shutdown context to PerformSync to prevent stuck syncs from halting respawn
- fixed blossomsub pubsub interface not properly tracking subscription status
- fixed subscribe order to avoid nil panic
- switched from dnsaddr to dns4 and added missing quic-v1
- added logging to isolate respawn quirks
- applied sledgehammer to restart logic
- restored proper respawn logic, fixed frozen hypergraph post respawn, and unsubscribed from bitmask previously missing

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
