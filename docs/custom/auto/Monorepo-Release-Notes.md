---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-13
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

**Last updated:** June 13, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relax peerstore clearing interval
- prover management TUI adds manual management tracking and joins by worker id
- optimize TUI display and rendering
- fix dbscan compiler error
- set default archive peer list
- fix prover eviction bug
- improve prover visibility when leaving is implicitly accepted
- fix prover leaving status in event distributor
- rename pending status to joining
- fix merge spend marker
- fix sorting and ring position display in TUI
- fix render width for [M] marker
- timereel now accepts new head immediately
- add timeout for global frame fetch
- add lru cache to getglobalframe handler
- adjust estimation behavior for correct ring position and membership set
- fix worker TUI reward calculations and logical shard count, reduce bandwidth on app worker
- auto-sized filters in TUI
- fix dynamic filter width
- improve blossomsub and estimate/hard calculation changes
- multiple migration fixes to resolve eviction issues

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data, possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- add debug mode via environment variable
- fix pebble database constructor configuration parameter
- resolve high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and enable querying metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak CLI output for join frames

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
- fix blossomsub peer scoring to not penalize on duplicate messages
- fix blossomsub peer scoring to not penalize on duplicate messages (second attempt)
- fix blossomsub peer scoring to not penalize on duplicate messages (third attempt)

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
