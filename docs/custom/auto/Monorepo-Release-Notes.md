---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-09-23
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

**Last updated:** September 23, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fixed race where initial failout of sync dooms workers to idle forever (until reboot)
- fixed patch number sync with config
- added more test coverage
- fixed transaction safety for hypergraph store writes
- made lazy tree commit retry-safe by deferring dirty-state clearing until transaction commit succeeds
- made compute_shard_root read-only, preventing writes outside frame transactions
- refactored hypergraph store writes to require RocksTxn, removing silent direct-write fallback
- handled leaving scenario with store wipe
- reduced score differential basis for flagging leave-to-join opportunities, extended scoring-based leave window to full cycle
- adjusted margins on decisions, thresholds for decides and joins
- adjusted snapshotting to use actual rocksdb snapshots
- resolved unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- consensus: rejoin a lagging archive by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking issues for flint/mpfr/gmp
- resolve standalone worker connection string derivation and logging to own files
- fix too many joins, invalid signature, and worker allocator bugs
- demote p2p and archive client logs to debug
- add confirm/reject action and demote shard operation logs to debug
- resolve domain separation bug for invalid signature
- fix tokio thread issue related to logging
- fast path push to archives for info retrieval
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and log noise
- adjust prover shard choices and ring number calculation
- fix TUI quirks for manual mode
- forcibly adjust halt risk shards as primary selection criteria
- address blackswan-reported issues 1-3 and 1-6
- resolve worker persistence and missing lock update
- harden prover path and fix shard store discrepancy
- use different source for current frame number
- cache requests to avoid available shards flashing
- resolve stale 0 frame data response and adjust blossomsub params
- refactor tree behaviors to skip stale data effects
- add halt risk test and switch archive node
- never assume, always ensure prover tree
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug crashing worker threads
- fix too many streams issue and delegate address edge case
- resolve stream connection issue with kad-dht
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- improve rust and docker build times
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix rust node initialization issues
- refactor quil-node main into sibling modules
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on noisy connection events
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores and add memory profiling
- add memory adjustments and allocator swap
- add diagnostics for message drops
- fix bitmask of workers and cheaper peek-verification on peer info
- aggressive query for frame to avoid expired joins
- fix leave proposal adjustment for halt risk
- resolve proposal bug using joining

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
- fix high CPU overhead in initial worker behaviors and ongoing sync
- allow debug logging via environment variable
- fix pebble database constructor configuration parameter
- faster docker builds with better caching
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak cli output for join frames

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
- fixed worker manager filter refresh on allocation and snapshots blocking close on shutdown
- forced shutdown after five seconds for app worker
- fixed loop on shutdown and added named workers to trace hanging shutdowns
- used deterministic key for peer id of workers to stop flagging workers as sybil attacks
- removed pubsub stop from app consensus engine and integrated shutdown context to PerformSync to prevent stuck syncs from halting respawn
- fixed blossomsub pubsub interface subscription status tracking
- fixed subscribe order to avoid nil panic
- switched from dnsaddr to dns4 and added missing quic-v1
- added logging to isolate respawn quirks
- applied sledgehammer to restart logic
- restored proper respawn logic, fixed frozen hypergraph post respawn, and unsubscribed from bitmask

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
