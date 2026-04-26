---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-04-26
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

**Last updated:** April 26, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- fixed prover eviction and leaving status bugs
- resolved dbscan compiler error and merge issues
- optimized shard allocation join/confirm/reject logic
- added default archive peer list
- fixed spend marker and weird TUI sorting/ring position issues
- adjusted render width for [M] marker
- improved timereel behavior to accept new head immediately
- added timeout for global frame fetch and LRU cache
- refined worker TUI reward calculations and logical shard count
- implemented auto-sized filters and bandwidth reduction
- fixed dynamic filter width and blossomsub improvements
- resolved migration issues with improved logging
- refactored global consensus engine into discrete components

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback reconciliation between old and new config paths
- fixed formatting and precision issues in prover reward data
- improved peering reliability
- fixed application shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug mode via environment variable
- fix pebbledb constructor configuration
- reduce CPU overhead in initial worker behaviors and sync
- improve docker build caching
- add node info metrics and command line queries
- skip proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed sync message size limits and signature handling
- resolved race conditions in prover registry and worker allocation
- improved error handling for signatures and merge operations
- removed compatibility with old blossomsub 2.0.0
- fixed abandoned prover joins and stale worker proposals
- added sanity checks for join operations
- resolved rare crashes (SIGFPE) and orphaned joins
- updated peer discovery with reconnect fallback and adjusted peer count
- fixed expired joins, port ranges, and proposer getting stuck
- improved shutdown handling for workers and coverage checks
- added registry refresh for worker registration
- tweaked worker shutdown timing and logging
- switched from dnsaddr to dns4 for blossomsub
- fixed pubsub subscription issues and nil panics
- improved respawn logic for hypergraph and worker restarts

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
- fixed peer discovery and connection stability issues
- improved blossomsub message handling efficiency
- optimized hypergraph sync performance
- resolved deadlock in peer manager during high load
- added validation for incoming channel messages
- reduced memory usage in pebble storage backend
- fixed edge case in proof verification logic
- improved error handling for network timeouts

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
