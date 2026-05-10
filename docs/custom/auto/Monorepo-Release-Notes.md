---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-05-10
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

**Last updated:** May 10, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and worker ID visibility
- relaxed peerstore clearing interval
- tuned component-level logging
- enhanced prover management TUI with manual tracking and worker ID joins
- optimized TUI interface
- fixed prover eviction bug
- improved shard allocation logging for join/leave operations
- added default archive peer list
- fixed prover leaving status in event distributor
- renamed "pending" status to "joining" in UI
- fixed merge spend marker issue
- resolved TUI sorting and ring position display issues
- fixed render width for [M] marker
- improved timereel behavior to accept new head immediately
- added timeouts and LRU cache for global frame fetching
- adjusted ring position and membership set calculations
- fixed worker TUI reward calculations and logical shard counts
- implemented auto-sized filters
- optimized shard join/leave logging
- fixed dynamic filter width
- made blossomsub improvements and calculation adjustments
- fixed migrations and added better logging
- refactored global consensus engine into discrete components
- adjusted RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- resolved feedback reconciliation between old and new config paths
- fixed prover reward data formatting and precision
- improved peering issue resolution
- fixed app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed high CPU overhead in initial worker behaviors and sync
- added extra node info data and command line metrics query
- implemented leave proposals for overcrowded shards
- added hub-and-spoke global message broadcasts
- improved CLI output for join frames
- fixed pebbleDB constructor config parameter
- optimized docker builds with better caching

## v2.1.0.19 (version .19) *(auto-generated)*
- fixed seniority marker join blocker and sync message size limit defaults
- resolved signature failures and merge-related signature issues
- fixed one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and stale worker proposal edge
- added full sanity check on join submissions
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable time when no peers are found
- updated base peer count to 1
- fixed expired prover join frames, port ranges, stuck proposers, and seniority on joins
- resolved shutdown panics, libp2p discovery picking inaccessible peers, and coverage event checks
- fixed shutdown quirks, reload hangs, and early bailout on coverage check shutdown
- added forced registry refresh for waiting workers and more wait logging
- fixed worker manager filter refresh and snapshot blocking on shutdown
- added forced worker shutdown after five seconds and prevented shutdown loops
- used deterministic keys for worker peer IDs to prevent sybil attack flags
- removed pubsub stop from app consensus engine and integrated shutdown context for syncs
- fixed blossomsub subscription tracking and nil panic on subscribe order
- switched from dnsaddr to dns4 and added quic-v1 support
- fixed hypergraph freeze post-respawn and missing bitmask unsubscriptions
- restored proper respawn logic and applied fixes to restart quirks

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
- optimized peer scoring decay function
- improved peer scoring threshold handling
- added peer scoring blacklist for misbehaving peers
- reduced peer scoring memory usage
- fixed peer scoring persistence issues
- improved peer scoring test coverage

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
