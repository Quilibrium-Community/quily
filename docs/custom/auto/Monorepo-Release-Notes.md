---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-10-22
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

**Last updated:** October 22, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fixed race condition where initial sync failout left workers idle indefinitely
- improved test coverage and fixed test compilation issues
- re-enabled ed448-rust and pacemaker_advances_on_qc tests
- fixed transaction safety for hypergraph store writes
- made lazy tree commits retry-safe by deferring dirty-state clearing until durable commit
- made compute_shard_root read-only to prevent writes outside frame transactions
- refactored hypergraph store writes to require RocksTxn, replacing silent direct-write fallback with loud error on unrecognized transactions
- handled leaving scenario with store wipe
- reduced score differential basis for flagging leave-to-join opportunities and extended scoring-based leave window
- adjusted margins and thresholds for decides and joins
- switched snapshotting to use actual rocksdb snapshots
- resolved unsynced leave issuance condition
- reapplied docker build optimizations to Dockerfile.source
- added consensus catch-up: rejoin lagging archives by syncing proposals from peers
- implemented GlobalService.GetGlobalProposal to serve full proposals from clock store
- added proposer vote persistence at proposal ingest and proto conversions
- added Consumer::on_missing_parent trigger and SyncTriggerHook for recovery path
- added catch-up task to pull and submit proposals from peers when orphaned

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking for flint/mpfr/gmp
- resolve standalone worker connection string, key handling, and logging issues
- fix too many joins/leaves, invalid signature, and domain separation bugs
- demote various p2p and archive logs to debug
- add actions to confirm and reject shards, and debug logging for shard ops
- improve prover tree handling, worker allocator, and shard selection logic
- fix halt risk calculation and handling of 67% barrier
- resolve race conditions with overlapping joins and expired leaves
- fix worker persistence, shard store discrepancies, and stale frame data responses
- adjust blossomsub parameters and fix autonat crash
- fix router validator tests and quil-engine unit tests
- support whitespace in genesis seed for testnets
- add CI for rust builds and enable tests
- optimize build times and fix cargo.lock
- support archive endpoints config in rust node
- use sha3 for prover join vdf verifier
- refactor quil-node main into modular subsystems (storage, keys, engines, networking, etc.)
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- add memory profiling and swap allocator to trace OOM issues
- increase duration between peer info and key registry publishes
- fix tui manage submission of messages
- resolve loop of halt risk swap
- add diagnostics for prover management and message drops

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and show worker id in prover management TUI
- relaxed peerstore clearing interval
- added component-level logger tuning
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimized TUI rendering and performance
- log shard allocation join confirm/reject and plan leave details
- added default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed pending status to joining
- fixed merge spend marker
- fixed sorting and ring position issues in TUI
- fixed render width for [M] marker
- timereel behavior now accepts new head immediately
- added timeout for global frame fetch
- added lru cache to getglobalframe handler
- adjusted estimation behavior for ring position and membership set calculation
- fixed worker TUI reward calc and logical shard count, reduced bandwidth on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject for shard joins and leaves
- fixed dynamic filter width
- improved blossomsub, estimate/hard calc changes
- added migration to resolve eviction issue
- refactored global consensus engine into discrete components, updated tests
- adjusted rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data and possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- read debug settings from environment variable
- fix pebble database constructor config parameter
- reduce high CPU overhead in initial worker behaviors and ongoing sync
- improve docker build caching for faster builds
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- add hub-and-spoke global message broadcasts
- tweak cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging and fixed seniority marker join blocker
- fixed sync message size limit defaults and one-shot sync message size
- resolved signature failure and added logging for merge-related signatures
- fixed app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- removed compat with old 2.0.0 blossomsub
- resolved abandoned prover joins and reload prover registry
- fixed stale worker proposal edge
- added full sanity check on join before submitting
- resolved non-fallthrough condition that should be fallthrough
- fixed rare SIGFPE and orphan expired joins blocking workers from reallocating
- added reconnect fallback if no peers are found with variable reconnect time
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
