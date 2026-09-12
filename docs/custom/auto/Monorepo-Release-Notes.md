---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-09-12
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

**Last updated:** September 12, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race where initial sync failout leaves workers idle until reboot
- fix patch number sync with config
- make hypergraph store writes transaction-aware, preventing partial syncs from persisting
- make LazyVectorCommitmentTree::commit retry-safe by deferring dirty-state clearing until transaction commit
- make compute_shard_root read-only, preventing writes outside frame transactions
- require RocksTxn for hypergraph store writes, removing silent direct-write fallback
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities, extend scoring-based leave window to a full cycle
- adjust margins on decisions, thresholds for decides and joins
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- rejoin lagging archive by syncing proposals from peers, enabling consensus recovery after network partitions

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue
- static link flint/mpfr, revert, and rework linker for static flint builds
- force gmp to static
- standalone worker: derive connection string correctly
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files, and various additional bugs
- keys file handling, pare back excess joins/leaves
- demote p2p loggers to debug
- v2.1.0.23 enhancements
- log archive client connection, coverage halt risk, shard ops, shard qc submission, prover message submission, shard frame produce, shard spit and merge to debug
- add action to confirm and reject
- resolve domain separation bug for invalid signature
- resolve tokio thread issue re: logging
- fast path: push straight to archives to retrieve info
- fix leaving prover bug in worker allocator
- resolve worker storage location bug + log noise
- smaller tweaks to prover shard choices
- minor quirk around ring number calculation
- TUI quirks for manual mode
- more tweaks to worker ring logic for available shards
- forcibly adjust the halt risk shards as primary selection criteria
- address 1,2,3 from blackswan
- missed Left->Leaving
- resolve edge cases
- address bug reports
- resolve worker persistence
- missing lock update
- noisy logs for identifying worker/TUI issues
- hardening the prover path
- fix shard store discrepancy
- use different source for current frame number
- cache requests so the available shards don't keep flashing
- more places where implicit behaviors aren't captured
- resolve stale 0 frame data response, adjust blossomsub params now that we're not fighting go
- massive series of improvements
- refactor tree behaviors to skip stale data effects
- halt risk test
- switch archive node
- small tweaks to diagnose race condition
- never assume, always ensure prover tree
- add extra logging for worker panics
- handle orphaned allocations and allocations on zero byte shards
- fix 1-6 reported by blackswan
- add missing worker_ids field
- smaller fixes + autonat bug crashing worker threads
- fix build for linux
- build tweaks, fix too many streams issue
- address edge case with delegate address,

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relaxed peerstore clearing interval
- added component-level logger tuning
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimized TUI - round 2
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
- read debug settings from environment variable
- fix pebble db constructor config parameter
- reduce high cpu overhead in initial worker behaviors and ongoing sync
- speed up docker builds with better caching
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- use hub-and-spoke global message broadcasts
- tweak cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging and fixed seniority marker join blocker
- fixed sync message size limit defaults and one-shot sync message size
- resolved app shard TC signature size and collector/hotstuff race condition
- fixed expired joins blocking new joins due to pruning disable
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and reloaded prover registry
- fixed stale worker proposal edge and added full sanity check on join
- resolved non-fallthrough condition that should be fallthrough
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable reconnect time when no peers found
- updated base peer count to 1
- fixed expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fixed panic on shutdown, libp2p discovery picking inaccessible peers, and coverage event check
- amended app shard worker behavior to mirror global for prover root reconciliation
- fixed shutdown scenario quirks and reload hanging
- fixed early bailout on shutdown of coverage check
- forced registry refresh on worker waiting for registration
- fixed worker manager filter refresh on allocation and snapshots blocking close on shutdown
- forced shutdown after five seconds for app worker and fixed loop on shutdown
- added named workers to trace hanging shutdowns
- used deterministic key for peer id of workers to stop sybil attack flagging
- removed pubsub stop from app consensus engine and integrated shutdown context to PerformSync
- fixed blossomsub pubsub interface subscription status tracking
- fixed subscribe order to avoid nil panic
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
