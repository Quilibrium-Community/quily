---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-08-03
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

**Last updated:** August 3, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix sync race condition where initial failout left workers idle forever (until reboot)
- fix patch number sync with config
- fix transaction safety for hypergraph store writes

## v2.1.0.22 (version .22) *(auto-generated)*
- fix: relax peerstore clearing interval
- fix: resolve bad merge
- fix: dbscan compiler error
- fix: prover eviction bug
- fix: prover leaving status in event distributor
- fix: merge spend marker
- fix: weird sorting/ring position issues in TUI
- fix: render width for [M] marker
- fix: timereel behavior should accept new head immediately
- fix: add timeout for global frame fetch
- fix: add lru cache to getglobalframe handler
- fix: adjust estimation behavior to properly calculate ring position and membership set
- fix: worker TUI reward calc/logical shard count, bandwidth reduction on app worker
- fix: dynamic filter width
- fix: blossomsub improvements, estimate/hard calc changes
- fix: migration + improved logging
- fix: new migration to resolve eviction issue
- qol: improved prover commands, show worker id
- qol: component-level logger tuning
- qol: prover management TUI adds manual management tracking and specifies joins by worker id
- qol: rename pending to joining
- qol: small tweaks around prover visibility when leaving is implicitly accepted
- qol: auto-sized filters
- optimize TUI - round 2
- optimize logging for plan / decide and confirm / reject for shard joins and leaves
- refactor global engine into discrete components, update tests
- adjust rpc/worker ring display
- log shard allocation join confirm or reject + plan leave details
- default archive peer list

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data, possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure in join-related validation
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired join blocking
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and add prover registry reload
- fix stale worker proposal edge and add sanity check on join
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE, orphan expired joins blocking worker reallocation
- add reconnect fallback with variable reconnect time
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, inaccessible peers in libp2p discovery, coverage event check, and app shard worker prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager filter on allocation, snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- fix loop during shutdown, add named workers for tracing hangs
- use deterministic key for worker peer IDs to avoid sybil flagging
- remove pubsub stop from app consensus engine, integrate shutdown context to PerformSync
- fix blossomsub pubsub subscription status tracking
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4, add missing quic-v1
- fix dnsaddr→dns4 for blossomsub
- apply sledgehammer restart logic fix, restore proper respawn logic and frozen hypergraph post respawn, fix bitmask unsubscribe

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
