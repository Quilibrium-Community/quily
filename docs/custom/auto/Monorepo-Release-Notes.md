---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-17
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

**Last updated:** May 17, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- fixed prover eviction bug
- resolved shard allocation join/confirm/reject logic and plan leave details
- optimized TUI rendering and fixed display issues
- added timeout for global frame fetch
- adjusted estimation behavior for ring position and membership calculations
- improved worker TUI reward calculations and logical shard count
- implemented auto-sized filters
- optimized blossomsub behavior and fixed dynamic filter width
- resolved migration issues and improved logging
- refactored global consensus engine into discrete components
- fixed bandwidth reduction on app worker
- updated default archive peer list

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback reconciliation between old and new config paths
- fixed formatting and precision issues in prover reward data
- fixed app shard lookups on mainnet
- addressed potential peering issues

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug mode via environment variable
- fix pebbledb constructor configuration
- reduce CPU overhead in initial worker behaviors and sync
- improve docker build caching
- add node info metrics and command line queries
- skip proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- refine cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed sync race conditions and message size limits
- resolved signature failures and merge-related signature issues
- fixed one-shot sync message size, app shard TC signature size, and collector/hotstuff race condition
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and stale worker proposal edge
- added sanity checks for join submissions
- fixed rare SIGFPE and orphan expired joins blocking worker allocation
- added reconnect fallback with variable timing when no peers are found
- updated base peer count to 1
- fixed expired prover joins, port ranges, stuck proposers, and seniority issues
- resolved shutdown panics and libp2p peer selection problems
- fixed worker registry refresh issues and shutdown quirks
- improved worker allocation filtering and snapshot handling
- enforced deterministic worker keys to prevent sybil flags
- fixed pubsub lifecycle management and sync respawn issues
- corrected blossomsub subscription tracking and nil panics
- switched from dnsaddr to dns4 for blossomsub
- added quic-v1 support
- fixed hypergraph freeze after respawn and bitmask unsubscribe issues

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
- added support for blossomsub peer discovery
- fixed peer discovery race condition in pubsub
- improved peer scoring and connection stability
- optimized message propagation in pubsub network
- reduced memory usage in pubsub message cache
- fixed deadlock in peer connection handling
- improved error handling for peer dialing failures
- added metrics for pubsub message validation
- optimized peer handshake protocol
- fixed edge cases in peer routing table updates

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
