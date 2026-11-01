---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-11-01
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

**Last updated:** November 1, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix patch number sync with config, resolve race where initial sync failout leaves workers idle until reboot
- make hypergraph store writes transaction-aware, aborting partial writes on failed syncs
- make lazy tree commit retry-safe, deferring dirty-state clearing until transaction commit succeeds
- make compute_shard_root read-only, preventing writes outside frame transactions on the master-stream receive path
- require RocksTxn for hypergraph store writes, erroring loudly on unrecognized transaction types
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities, extend scoring-based leave window to a full cycle
- adjust margins, thresholds for decide and join decisions
- switch snapshotting to actual rocksdb snapshots
- resolve unsynced leave issuance condition
- restore docker build optimizations for leaf crate compilation, cargo/go cache mounts
- rejoin lagging archive by syncing proposals from peers, serving full proposals via GetGlobalProposal

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking issues for flint/mpfr/gmp
- resolve standalone worker connection string derivation and worker persistence bugs
- fix invalid signatures, too many joins/leaves, and various standalone worker mode bugs
- demote p2p and archive client logs to debug
- add confirm/reject actions and debug logging for shard operations, prover messages, and frame production
- resolve domain separation bug for invalid signature and tokio thread issue
- fix leaving prover bug in worker allocator and worker storage location bug
- improve prover shard choices and halt risk selection criteria
- address multiple issues from blackswan, including worker persistence and edge cases
- harden prover path and fix shard store discrepancy
- use correct frame number source and cache requests to stabilize available shards
- adjust blossomsub params and refactor tree behaviors to skip stale data effects
- add logging for worker panics and handle orphaned allocations
- fix autonat bug crashing worker threads and too many streams issue
- resolve delegate address edge case and kad-dht stream connection issue
- add support for white spaces in genesis seed for testnets
- fix quil-engine unit tests and router validator tests
- add Rust CI with GitHub Actions and enable tests
- fix vdf link order and use optimized builds for heavy tests
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier and fix rust node initialization
- refactor quil-node main.rs by extracting sibling modules (no behavior changes)
- fix canonicalization bug for peer info and propagate errors from subsystems
- reduce logging noise on connection events and increase peer info publish interval
- add memory profiling and allocator swap to address OOM from unbounded stores
- fix message drops and worker bitmask, optimize peer info verification
- resolve expired leaves not treated as confirmed in proposal logic and worker allocator
- fix halt risk swap loop and overlapping join race conditions
- fix tui manage submission of messages and port-related issues
- add diagnostics around prover management and aggressive frame queries to avoid expired joins

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relaxed peerstore clearing interval
- component-level logger tuning
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimized TUI round 2
- fixed dbscan compiler error
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
- fixed worker TUI reward calc/logical shard count, bandwidth reduction on app worker
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
- fix formatting/precision on prover reward data and possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug mode to be enabled via environment variable
- fix pebble db constructor config parameter
- reduce high cpu overhead in initial worker behaviors and ongoing sync
- improve docker build caching for faster builds
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- use hub-and-spoke for global message broadcasts
- tweak cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging and fixed seniority marker join blocker
- resolved signature failure and added logging for merge-related signatures
- fixed one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and reloaded prover registry
- fixed stale worker proposal edge and added full sanity check on join before submission
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
- added logging to wait for prover
- fixed worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- forced shutdown after five seconds for app worker
- fixed looping when shutting down
- added named workers to trace hanging shutdowns
- used deterministic key for peer id of workers to stop flagging workers as sybil attacks
- removed pubsub stop from app consensus engine and integrated shutdown context to PerformSync to prevent stuck syncs from halting respawn
- fixed blossomsub pubsub interface not properly tracking subscription status
- fixed subscribe order to avoid nil panic
- switched from dnsaddr to dns4 and added missing quic-v1
- added logging to isolate respawn quirks
- fixed dnsaddr to dns4 for blossomsub
- applied sledgehammer to restart logic
- restored proper respawn logic, fixed frozen hypergraph post respawn, and unsubscribed from previously missing bitmask

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
