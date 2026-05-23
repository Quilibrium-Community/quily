---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-23
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

**Last updated:** May 23, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker id visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker id joins
- fixed prover eviction and leaving status bugs
- resolved dbscan compiler error and merge conflicts
- optimized shard allocation join/confirm/reject logic
- added default archive peer list
- fixed prover status display and pending/joining naming
- resolved sorting and ring position issues in TUI
- fixed timereel behavior for immediate head acceptance
- added timeout and LRU cache for global frame fetching
- adjusted reward calculation and logical shard count in TUI
- implemented auto-sized filters and bandwidth reduction
- improved blossomsub behavior and estimation calculations
- added migration to resolve eviction issues
- refactored global consensus engine into discrete components
- optimized worker ring display and TUI rendering

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback reconciliation between old and new config paths
- fixed formatting and precision issues in prover reward data
- addressed potential peering issues
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug mode via environment variable
- fix pebbledb constructor configuration parameter
- reduce cpu overhead in initial worker behaviors and sync
- improve docker build caching
- add node info metrics and command line querying
- skip proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- refine cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed seniority marker join blocker and sync message size limit defaults
- resolved signature failures and added error logging for merge-related signatures
- fixed one-shot sync message size, app shard TC signature size, and collector/hotstuff race condition
- resolved abandoned prover joins and stale worker proposal edge
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable time when no peers are found
- updated base peer peer count to 1
- fixed expired prover join frames, starting port ranges, and proposer stuck issues fixed
- resolved panic on shutdown and libp2p discovery picking inaccessible peers
- fixed shutdown scenario quirks and reload hanging
- added registry refresh on worker waiting for registration
- worker manager now refreshes filter on allocation
- fixed blossomsub pubsub interface fixes to track subscription status properly
- switched from dnsaddr to dns4 and added missing quic-v1
- fixed frozen hypergraph post-respawn fixed and proper respawn logic restored
- removed compatibility with old 2.0.0 blossomsub
- added full sanity check on join before submission to identify bugs
- added deterministic keys for worker peer IDs to prevent sybil attack flags
- fixed subscribe order to avoid nil panic
- added shutdown context to prevent stuck syncs halting respawn

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
- fixed blossomsub peer discovery regression
- improved peer scoring metrics
- optimized hypergraph sync performance
- reduced memory usage in pebble storage backend
- added validation for incoming channel messages
- resolved race condition in peer connection handling
- improved error handling for invalid frame types
- fixed deadlock in peer manager during shutdown

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
