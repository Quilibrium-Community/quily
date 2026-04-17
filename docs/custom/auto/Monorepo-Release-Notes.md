---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-04-17
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

**Last updated:** April 17, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- fixed prover eviction bug and leaving status in event distributor
- resolved shard allocation join/confirm/reject logic and plan leave details
- optimized TUI rendering for worker rewards, logical shard count, and bandwidth
- added auto-sized filters and fixed dynamic filter width
- improved blossomsub behavior and estimation calculations
- fixed global frame fetch timeouts and added LRU cache
- resolved migration issues and improved logging
- adjusted ring position calculations and membership set behavior
- refactored global consensus engine into discrete components

## v2.1.0.21 (version .21) *(auto-generated)*
- resolve feedback reconciliation between old and new config paths
- fixed formatting and precision issues with prover reward data
- improved peering stability
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and sync
- added debug mode configuration via environment variable
- corrected pebbledb constructor config parameter
- optimized docker builds with improved caching
- added node info metrics and command line query support
- implemented leave proposals for overcrowded shards
- added hub-and-spoke global message broadcast system
- improved cli output formatting for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed seniority marker join blocker and sync message size limit defaults
- resolved signature failures and improved merge-related signature error logging
- fixed one-shot sync message size, app shard TC signature size, and collector/hotstuff race condition
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and stale worker proposal edge
- added full sanity check on join submissions
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable timing when no peers are found
- updated base peer count to 1
- fixed expired prover join frames, port ranges, stuck proposers, and seniority on joins
- resolved shutdown panics and improved libp2p peer selection
- fixed coverage event checks during shutdown and app shard worker behavior
- improved registry refresh logic and worker allocation filtering
- added deterministic keys for worker peer IDs to prevent sybil attack flags
- removed pubsub stop from app consensus engine and integrated shutdown context
- fixed blossomsub subscription tracking and nil panic on subscribe
- switched from dnsaddr to dns4 for blossomsub
- fixed hypergraph freeze after respawn and missing bitmask unsubscriptions
- improved worker shutdown logic and added tracing for hanging shutdowns

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
- fixed blossomsub peer scoring parameters
- improved peer discovery and connection handling
- optimized hypergraph sync performance
- reduced memory usage in pebble storage
- fixed deadlock in peer manager during shutdown
- improved error handling for invalid ceramic streams
- added validation for peer info messages
- optimized bloom filter usage in sync protocol

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
