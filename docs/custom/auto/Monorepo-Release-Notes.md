---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-09-20
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

**Last updated:** September 20, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race where initial sync failout leaves workers idle until reboot
- fix patch number sync with config
- make hypergraph store writes transaction-safe, including vertex data and tree blob writes
- make lazy tree commit retry-safe by deferring dirty-state clearing until transaction commit
- make compute_shard_root read-only, preventing writes outside frame transactions
- require RocksTxn for hypergraph store writes, removing silent direct-write fallback
- handle store wipe on leaving scenario
- reduce score differential basis for flagging leave-to-join opportunities, extend scoring-based leave window to a full cycle
- adjust margins on decisions, thresholds for decides and joins
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- rejoin lagging archive by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking issues for flint/mpfr/gmp
- resolve standalone worker connection string derivation and logging bugs
- fix too many joins, invalid signature in qclient, and worker storage location bugs
- demote p2p and archive client logs to debug
- add confirm/reject actions and reduce log noise for shard operations
- resolve domain separation bug for invalid signatures
- fix tokio thread issue re: logging
- fast path push to archives for info retrieval
- fix leaving prover bug in worker allocator
- adjust prover shard choices and ring number calculation
- forcibly adjust halt risk shards as primary selection criteria
- address blackswan reports 1-3 and 1-6
- resolve worker persistence and missing lock updates
- harden prover path and fix shard store discrepancy
- use different source for current frame number
- cache requests to avoid flashing available shards
- resolve stale 0 frame data response and adjust blossomsub params
- refactor tree behaviors to skip stale data effects
- never assume, always ensure prover tree
- handle orphaned allocations and zero byte shards
- fix autonat bug crashing worker threads
- fix too many streams issue and force static link on libchannel
- support white spaces in genesis seed for testnets
- fix router validator tests and quil-engine test compilation
- add Rust CI with GitHub Actions
- fix vdf link order and enable tests in CI
- improve rust and docker build times
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix rust node initialization
- refactor quil-node main into sibling modules (83.6% reduction)
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- increase duration between peer info and key registry publishes
- add memory profiling and logging to trace OOM
- swap allocator and adjust memory settings
- aggressive query for frame to avoid expired joins
- fix proposal bug using joining count in halt risk calculation
- handle 67% barrier for halt risk
- fix off by one on leave planning
- fix tui manage submission of messages
- fix expired leaves not treated as confirmed in proposal logic and worker allocator
- resolve loop of halt risk swap and race where overlapping joins are submitted

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
- fix formatting/precision on prover reward data and possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add debug logging via environment variable
- fix newPebbleDB constructor config parameter
- improve docker build caching for faster builds
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging, fixed seniority marker join blocker, and sync message size limit defaults
- resolved signature failure and added logging for merge-related signatures
- fixed one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and reloaded prover registry
- fixed stale worker proposal edge and added full sanity check on join submission
- resolved non-fallthrough condition and rare SIGFPE
- fixed orphan expired joins blocking worker reallocation
- added reconnect fallback with variable reconnect time when no peers found
- updated base peer count to 1
- fixed expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fixed panic on shutdown, libp2p discovery picking inaccessible peers, and coverage event check in shutdown logic
- amended app shard worker behavior to mirror global for prover root reconciliation
- fixed shutdown scenario quirks and reload hanging
- fixed early bailout on shutdown of coverage check
- forced registry refresh on worker waiting for registration
- fixed worker manager filter refresh on allocation and snapshots blocking close on shutdown
- forced shutdown after five seconds for app worker and fixed looping on shutdown
- added named workers to trace hanging shutdowns
- used deterministic key for worker peer IDs to stop sybil attack flagging
- removed pubsub stop from app consensus engine and integrated shutdown context into PerformSync
- fixed blossomsub pubsub interface subscription status tracking and subscribe order to avoid nil panic
- switched from dnsaddr to dns4 and added missing quic-v1
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
