---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-09
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

**Last updated:** May 9, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- optimized component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- fixed prover eviction and leaving status bugs
- resolved shard allocation join/confirm/reject logic and plan leave details
- added default archive peer list
- fixed dbscan compiler error and merge issues
- adjusted TUI for better prover visibility and implicit leave acceptance
- renamed pending state to joining for clarity
- fixed sorting and ring position issues in TUI
- improved render width for markers and timereel behavior
- added timeouts for global frame fetch and LRU cache
- optimized reward calculations and logical shard count in worker TUI
- implemented auto-sized filters and bandwidth reduction
- improved blossomsub behavior and estimation calculations
- fixed migrations and added enhanced logging
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- resolve sync race condition with prover registry pruning
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix peering issue solution
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
- prevented expired joins from blocking new joins due to pruning disable
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and stale worker proposal edges
- added full sanity check on join before submitting
- resolved rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable time when no peers are found
- updated base peer count to 1
- fixed expired prover join frames, starting port ranges, and proposer getting stuck
- resolved seniority marker issues on joins
- fixed panic on shutdown and libp2p discovery picking inaccessible peers
- amended app shard worker behavior to mirror global for prover root reconciliation
- resolved shutdown scenario quirks and reload hanging
- prevented early bailout on shutdown of coverage check
- forced registry refresh on worker waiting for registration
- fixed worker manager refreshing filter on allocation
- prevented snapshots from blocking close on shutdown
- added forced shutdown after five seconds for app worker
- fixed shutdown looping and reordered shutdown logic
- used deterministic key for worker peer IDs to prevent sybil flagging
- removed pubsub stop from app consensus engine and integrated shutdown context to prevent stuck syncs
- fixed blossomsub pubsub subscription tracking and nil panic on subscribe
- switched from dnsaddr to dns4 for blossomsub
- added missing quic-v1 support
- restored proper respawn logic and fixed frozen hypergraph post-respawn
- unsubscribed from previously missing bitmasks

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
- fixed blossomsub peer discovery and connection issues
- improved peer scoring and connection management
- optimized peerstore persistence and reduced disk writes
- added support for direct peer connections through libp2p
- reduced memory usage in peer management
- fixed edge cases in peer connection lifecycle
- improved resilience against network partitions
- optimized message propagation in pubsub
- reduced bandwidth usage in peer synchronization
- fixed race conditions in peer metadata handling
- improved handling of peer disconnections and reconnections
- optimized resource cleanup during peer shutdown
- reduced cpu usage during peer synchronization
- fixed edge cases in peer routing table maintenance
- improved handling of large peer networks
- optimized peer discovery in low-connectivity scenarios
- reduced latency in peer-to-peer message delivery
- fixed edge cases in peer authentication
- improved handling of peer identity conflicts
- optimized peer connection handshake process

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
