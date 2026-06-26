---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-26
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

**Last updated:** June 26, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.23 (version .23) *(auto-generated)*
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, and workers now log to own files
- improve keys file handling and reduce excessive joins/leaves
- resolve domain separation bug for invalid signatures
- add fast path to retrieve info directly from archives
- fix leaving prover bug in worker allocator
- fix worker storage location bug
- fix ring number calculation quirk
- fix TUI quirks in manual mode
- adjust worker ring logic and make halt risk shards primary selection criteria
- address multiple bug reports from blackswan
- fix worker persistence
- fix shard store discrepancy
- fix stale zero-frame data response and adjust blossomsub parameters
- refactor tree behaviors to skip stale data effects
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug that crashed worker threads
- fix too many streams issue
- fix delegate address edge case and kad-dht stream connection issue
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix VDF link order
- support archive endpoint configuration in rust node
- use SHA3 for prover join VDF verifier
- fix rust node initialization
- propagate errors from subsystems
- fix out-of-memory from unbounded stores
- improve memory usage and swap allocator
- fix worker bitmask and optimize peer info verification
- fix bug where expired leaves were not treated as confirmed in proposal logic
- fix halt risk swap loop
- fix race condition with overlapping joins
- fix port-related issues and TUI message submission
- increase publish interval for peer info and key registry
- fix canonicalization bug for peer info
- address issues #558, #560, #561, #562, #563, and #535

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relaxed peerstore clearing interval
- tuned component-level logging
- added manual management tracking to prover management TUI, specifying joins by worker id
- optimized TUI performance
- fixed dbscan compiler error
- added logging for shard allocation join confirm/reject and plan leave details
- set default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed "pending" to "joining" in prover status
- fixed merge spend marker
- fixed sorting/ring position rendering issues in TUI
- fixed [M] marker render width
- fixed timereel behavior to accept new head immediately
- added timeout and LRU cache for global frame fetch
- adjusted estimation behavior for correct ring position and membership set calculation
- fixed worker TUI reward calculation, logical shard count, and bandwidth reduction on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject on shard joins and leaves
- fixed dynamic filter width
- improved blossomsub and estimate/hard calc behavior
- fixed migration issues, including a new migration to resolve eviction problems
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- Reconcile old and new config paths
- Fix formatting/precision on prover reward data
- Address peering issue
- Fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug environment variable to be read
- fix newPebbleDB constructor config parameter
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- small tweaks to cli output for join frames

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
