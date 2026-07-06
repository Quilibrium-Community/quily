---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-06
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

**Last updated:** July 6, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where initial sync failure leaves workers permanently idle
- fix transaction safety for hypergraph store writes
- make lazy tree commit retry-safe by deferring dirty-state clearing until transaction is durably committed
- make compute_shard_root read-only to prevent writes outside frame transactions
- require RocksTxn for hypergraph store writes, removing silent direct-write fallback
- handle node leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities
- extend scoring-based leave window to a full cycle
- adjust margins on decisions and thresholds for decides and joins
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- add consensus rejoin for lagging archives by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue
- static link flint/mpfr
- revert build.rs to pre-.23
- rework linker nonsense for static flint builds
- force gmp to static
- e2e testnet success on strange edge cases
- resolve reported issues
- fix missing items
- standalone worker: derive connection string correctly
- fix: too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files, various additional bugs
- keys file handling, pare back excess joins/leaves
- demote p2p loggers to debug
- log archive client connection to debug
- log coverage halt risk to debug
- log shard ops to debug
- log shard qc submission to debug
- log prover message submission to debug
- log shard frame produce to debug
- add action to confirm and reject, log shard spit and merge to debug
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

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relaxed peerstore clearing interval
- added component-level logger tuning
- prover management TUI now tracks manual management and specifies joins by worker id
- optimized TUI performance
- fixed dbscan compiler error
- log shard allocation join confirm/reject and plan leave details
- set default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed "pending" to "joining"
- fixed merge spend marker
- fixed sorting/ring position issues in TUI
- fixed render width for [M] marker
- timereel now accepts new head immediately
- added timeout for global frame fetch
- added lru cache to getglobalframe handler
- adjusted estimation behavior for ring position and membership set calculation
- fixed worker TUI reward calculation and logical shard count
- reduced bandwidth on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject for shard joins and leaves
- fixed dynamic filter width
- improved blossomsub with estimate/hard calc changes
- added migration to resolve eviction issue
- refactored global consensus engine into discrete components and updated tests
- adjusted rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data and possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- fix one-shot sync message size and app shard TC signature size
- resolve collector/hotstuff race condition and expired joins blocking new joins
- remove compatibility with old 2.0.0 blossomsub
- fix abandoned prover joins and stale worker proposal edge
- add sanity check on join before submission
- resolve non-fallthrough condition and rare SIGFPE
- fix orphan expired joins blocking worker reallocation
- add reconnect fallback with variable reconnect time
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix multiple shutdown issues: panic, libp2p discovery, coverage check not in shutdown logic, reload hanging, and infinite loop
- force registry refresh on worker waiting for registration
- use deterministic key for worker peer IDs to stop flagging workers as sybil attacks
- fix blossomsub subscription status tracking and subscribe order to avoid nil panic
- switch from dnsaddr to dns4 for blossomsub and add missing quic-v1
- restore proper respawn logic, fix frozen hypergraph post respawn, and unsubscribe from bitmask previously missing

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

## v2.1.0.11 (version .11) *(auto-generated)*
- fixed channel bug
- added DKLs23 fork
- resolve sync race condition with prover registry pruning

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
