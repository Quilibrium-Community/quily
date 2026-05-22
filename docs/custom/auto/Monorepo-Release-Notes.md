---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-22
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

**Last updated:** May 22, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and added worker id visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker id joins
- optimized TUI rendering and sorting
- fixed prover eviction and leaving status bugs
- renamed pending state to joining for clarity
- fixed timereel behavior to accept new head immediately
- added timeouts and LRU cache for global frame fetching
- corrected ring position calculations and membership set estimation
- optimized worker TUI reward calculations and reduced bandwidth
- implemented auto-sized filters and fixed dynamic filter width
- improved blossomsub behavior and estimation calculations
- added migration to resolve eviction issues
- refactored global consensus engine into discrete components
- adjusted RPC and worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- resolve sync race condition with prover registry pruning
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and ongoing sync
- added debug environment variable support
- fixed pebbleDB constructor config parameter
- improved docker build caching for faster builds
- added extra node info data and command line metrics query
- implemented leaving proposals for overcrowded shards
- added hub-and-spoke global message broadcasts
- improved CLI output formatting for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed seniority marker join blocker and sync message size limit defaults
- resolved signature failures and merge-related signature issues
- fixed one-shot sync message size, app shard TC signature size, and collector/hotstuff race condition
- resolved expired joins blocking new joins due to pruning disable
- removed compatibility with old 2.0.0 blossomsub
- fixed abandoned prover joins and stale worker proposal edge
- added full sanity check on join before submitting
- resolved rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable time when no peers found
- updated base peer count to 1
- fixed expired prover join frames, starting port ranges, and proposer getting stuck
- resolved panic on shutdown and libp2p discovery picking inaccessible peers
- fixed shutdown scenario quirks and reload hanging
- added registry refresh on worker waiting for registration
- fixed worker manager refreshing filter on allocation
- added force shutdown after five seconds for app worker
- used deterministic key for worker peer ids to prevent sybil flagging
- removed pubsub stop from app consensus engine
- fixed blossomsub pubsub interface subscription tracking
- switched from dnsaddr to dns4 and added missing quic-v1
- fixed frozen hypergraph post-respawn and missing bitmask unsubscribe

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
- added support for blossomsub v1.1.23
- fixed blossomsub peer scoring
- improved peer discovery and connection handling
- optimized message propagation in pubsub
- added peer scoring metrics collection
- fixed peer scoring persistence
- improved peer scoring parameters
- added support for multiple DHT providers
- fixed DHT provider registration
- improved DHT query performance
- added support for multiple DHT query strategies
- fixed DHT query timeout handling
- improved DHT query result caching
- added support for multiple DHT query result filters
- fixed DHT query result filtering
- improved DHT query result sorting
- added support for multiple DHT query result sorters
- fixed DHT query result sorting
- improved DHT query result deduplication
- added support for multiple DHT query result deduplicators
- fixed DHT query result deduplication
- improved DHT query result merging
- added support for multiple DHT query result mergers
- fixed DHT query result merging
- improved DHT query result validation
- added support for multiple DHT query result validators
- fixed DHT query result validation
- improved DHT query result transformation
- added support for multiple DHT query result transformers
- fixed DHT query result transformation
- improved DHT query result aggregation
- added support for multiple DHT query result aggregators
- fixed DHT query result aggregation
- improved DHT query result presentation
- added support for multiple DHT query result presenters
- fixed DHT query result presentation
- improved DHT query result storage
- added support for multiple DHT query result storers
- fixed DHT query result storage
- improved DHT query result retrieval
- added support for multiple DHT query result retrievers
- fixed DHT query result retrieval
- improved DHT query result deletion
- added support for multiple DHT query result deleters
- fixed DHT query result deletion
- improved DHT query result expiration
- added support for multiple DHT query result expirers
- fixed DHT query result expiration
- improved DHT query result garbage collection
- added support for multiple DHT query result garbage collectors
- fixed DHT query result garbage collection
- improved DHT query result monitoring
- added support for multiple DHT query result monitors
- fixed D

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
