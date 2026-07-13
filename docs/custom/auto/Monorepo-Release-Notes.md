---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-13
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

**Last updated:** July 13, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking issues (flint/mpfr, gmp, libchannel)
- resolve too many joins, invalid signature, and standalone worker mode bugs
- fix workers not logging to their own files and keys file handling
- resolve domain separation bug causing invalid signatures
- fix tokio thread issue related to logging
- fix leaving prover bug in worker allocator

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relaxed peerstore clearing interval
- added component-level logger tuning
- prover management TUI now tracks manual management and specifies joins by worker id
- optimized TUI rendering
- fixed dbscan compiler error
- log shard allocation join confirm/reject and plan leave details
- added default archive peer list
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
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- address possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug environment variable to be read
- fix newPebbleDB constructor config parameter
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure in merge-related signatures
- fix one-shot sync message size, app shard TC signature size, and collector/hotstuff race condition
- prevent expired joins from blocking new joins due to pruning disabled
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge case
- add full sanity check on join before submission to identify bugs
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE and orphan expired joins blocking worker reallocation
- add reconnect fallback if no peers found, with variable reconnect time
- update default base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, and coverage event check not in shutdown logic
- amend app shard worker behavior to mirror global for prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager filter refresh on allocation and snapshots blocking close on shutdown
- force app worker shutdown after five seconds
- fix infinite loop when shutting down
- use deterministic key for worker peer IDs to prevent sybil flagging
- remove pubsub stop from app consensus engine (should not manage pubsub lifecycle)
- integrate shutdown context into `PerformSync` to prevent stuck syncs from halting respawn
- fix blossomsub pubsub interface subscription status tracking
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4 for peer discovery and add missing quic-v1
- restore proper respawn logic and fix frozen hypergraph post respawn
- unsubscribe from previously missing bitmask during respawn

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
