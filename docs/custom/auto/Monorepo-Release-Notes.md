---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-10
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

**Last updated:** June 10, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- Improved prover commands to show worker ID
- Relaxed peerstore clearing interval
- Component-level logger tuning
- Prover management TUI now tracks manual management and specifies joins by worker ID
- Optimized TUI rendering (round 2)
- Log shard allocation join confirm/reject and plan leave details
- Default archive peer list
- Fixed prover eviction bug
- Improved prover visibility when leaving is implicitly accepted
- Fixed prover leaving status in event distributor
- Renamed "pending" to "joining"
- Fixed merge spend marker
- Fixed sorting/ring position issues in TUI
- Fixed render width for [M] marker
- Timereel now accepts new head immediately
- Added timeout for global frame fetch
- Added LRU cache to getglobalframe handler
- Adjusted estimation behavior for ring position and membership set
- Fixed worker TUI reward calculation and logical shard count, reduced bandwidth on app worker
- Auto-sized filters
- Optimized logging for plan/decide and confirm/reject for shard joins and leaves
- Fixed dynamic filter width
- Blossomsub improvements, estimate/hard calculation changes
- Migration fixes with improved logging (including eviction resolution)
- Refactored global consensus engine into discrete components
- Adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data, possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug env var to be read
- fix newPebbleDB constructor config param
- fix high CPU overhead in initial worker behaviors/ongoing sync
- add extra data to node info, and query metrics from command line
- leave proposals for overcrowded shards
- hub-and-spoke global message broadcasts
- small tweaks to cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure
- fix one-shot sync message size, app shard TC signature size, and collector/hotstuff race condition
- fix expired joins blocking new joins due to pruning disable
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins
- reload prover registry
- fix stale worker proposal edge
- resolve non-fallthrough condition
- fix rare SIGFPE and orphan expired joins blocking worker reallocation
- add reconnect fallback if no peers found with variable reconnect time
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, and coverage event check not in shutdown logic
- amend app shard worker behavior to mirror global for prover root reconciliation
- fix shutdown quirks and reload hanging
- do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager refreshing the filter on allocation and snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- fix looping during shutdown
- add named workers to trace hanging shutdowns
- use deterministic key for peer id of workers to prevent sybil flagging
- fix pubsub lifecycle by removing pubsub stop from app consensus engine and integrate shutdown context to PerformSync to prevent stuck syncs from halting respawn
- fix blossomsub subscription tracking
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4
- add missing quic-v1
- apply sledgehammer to restart logic
- fix respawn logic, frozen hypergraph post respawn, and unsubscribe from previously missing bitmask

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
- fixed bug where the node would not properly re-announce its capabilities after a peer disconnection
- resolved race condition in prover registry pruning during sync
- improved handling of duplicate message IDs in blossomsub
- fixed channel bug causing intermittent message delivery failures
- added DKLs23 fork for enhanced cryptographic operations
- updated pebble database compaction thresholds for better performance
- corrected hypergraph traversal logic when processing remote proofs

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
