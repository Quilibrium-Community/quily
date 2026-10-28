---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-10-28
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

**Last updated:** October 28, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fixed race where initial sync failout left workers idle until reboot
- transaction-safe hypergraph store writes: vertex data savings now join the same batch as tree nodes and shard commit; partial syncs no longer persist
- fixed LazyVectorCommitmentTree::commit retry-safety so failed or aborted transactions leave the tree dirty for safe retry
- made compute_shard_root read-only, eliminating disk writes outside frame transactions on the master-stream receive path
- refactored hypergraph store writes to require RocksTxn, erroring loudly on unrecognized transactions instead of writing outside the transaction
- fixed patch number sync with config and added test coverage
- handle node leaving scenario with store wipe
- adjusted scoring thresholds and margins for leave/join decisions; reduce score differential basis for flagging leave-to-join opportunities
- extended scoring-based leave window to a full cycle
- switch snapshotting to actual RocksDB snapshots
- resolved unsynced leave issuance condition
- restore docker build optimizations in Dockerfile.source (single gen-rust stage, cargo/go cache mounts)
- rejoin lagging archives by syncing proposals from peers: serve full proposals via GetGlobalProposal, persist proposer votes, and add a catch-up task that pulls missed proposals into consensus

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking issues for flint/mpfr/gmp
- resolve standalone worker connection string derivation, logging, and worker storage bugs
- fix invalid signature domain separation bug and too many joins/leaves
- reduce p2p and shard operation log noise
- add confirm/reject action for shard operations
- fix prover leaving bug in worker allocator and improve shard selection logic
- address reported issues from blackswan and tester feedback
- resolve worker persistence, shard store discrepancies, and stale frame data responses
- harden prover path and adjust blossomsub parameters
- fix autonat bug causing worker thread crashes and stream connection issues
- enforce static link on libchannel in build script
- add support for white spaces in genesis seeds for testnets
- fix quil-engine unit tests and router validator tests
- add Rust CI with GitHub Actions and enable tests
- fix VDF link order and use optimized build for heavy tests
- improve rust and docker build times
- support archive endpoint configuration in rs node
- use sha3 for prover join VDF verifier
- fix rust node initialization and router validator test
- refactor quil-node main into sibling modules (no behavior changes)
- address #558, #560, #561 and fix peer info canonicalization bug
- propagate errors from subsystems
- reduce logging noise on connection events and prover management
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores with memory profiling and allocator swap
- optimize bitmask of workers and cheaper peek-verification on peer info
- aggressive query for frame to avoid expired joins
- fix proposal bug using joining count in halt risk calculation
- handle 67% barrier for halt risk and off-by-one on leave planning
- fix TUI manage message submission
- fix expired leaves not treated as confirmed in proposal logic and worker allocator
- resolve loop of halt risk swaps and overlapping join race conditions

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and show worker id
- relaxed peerstore clearing interval
- added component-level logger tuning
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
- fixed worker TUI reward calc/logical shard count, bandwidth reduction on app worker
- added auto-sized filters
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
- address possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and ongoing sync
- leave proposals for overcrowded shards
- added hub-and-spoke global message broadcasts
- allowed debug env var reading and added debug mode via environment variable
- fixed newPebbleDB constructor config parameter
- added extra data to node info and query metrics from command line
- improved docker build caching for faster builds
- tweaked CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging and fixed seniority marker join blocker
- fixed sync message size limit defaults and one-shot sync message size
- resolved app shard TC signature size and collector/hotstuff race condition
- fixed expired joins blocking new joins due to pruning disable
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and reload prover registry
- fixed stale worker proposal edge and added full sanity check on join
- resolved non-fallthrough condition that should be fallthrough
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable reconnect time if no peers found
- updated base peer count to 1
- fixed expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fixed panic on shutdown, libp2p discovery picking inaccessible peers, and coverage event check in shutdown logic
- amended app shard worker behavior to mirror global for prover root reconciliation
- fixed shutdown scenario quirks and reload hanging
- fixed early bailout on shutdown of coverage check
- forced registry refresh on worker waiting for registration
- added more logging to wait for prover
- fixed worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- forced shutdown after five seconds for app worker and fixed loop on shutdown
- added named workers to trace hanging shutdowns
- used deterministic key for peer id of workers to stop flagging workers as sybil attacks
- removed pubsub stop from app consensus engine and integrated shutdown context to PerformSync
- fixed blossomsub pubsub interface subscription status tracking
- fixed subscribe order to avoid nil panic
- switched from dnsaddr to dns4 and added missing quic-v1
- added additional logging to isolate respawn quirks
- applied sledgehammer to restart logic
- fixed restore proper respawn logic, frozen hypergraph post respawn, and unsubscribe from bitmask previously missing

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
