---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-17
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

**Last updated:** June 17, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and management TUI, show and specify tasks by worker id
- relax peerstore clearing interval
- tune component-level logging
- auto-size filters and fix dynamic filter width
- add default archive peer list
- fix prover eviction bug
- fix prover leaving status in event distributor
- fix merge spend marker
- fix sorting/ring position issues in TUI
- fix render width for [M] marker
- fix timereel to accept new head immediately
- add timeout for global frame fetch with LRU cache
- adjust estimation behavior for correct ring position and membership set
- fix worker TUI reward calculation and logical shard count
- reduce bandwidth on app worker
- optimize logging for shard join/leave plan, decide, confirm, reject
- improve blossomsub and estimate/hard calc changes
- fix migration for eviction issue and add improved logging
- refactor global consensus engine into discrete components, update tests

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- fix potential peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug logging via `DEBUG` environment variable
- fix `newPebbleDB` constructor configuration parameter
- resolve high CPU overhead during initial worker behaviors and ongoing sync
- improve docker build speed with better caching
- add extra data to node info and enable querying metrics from the command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge
- add full sanity check on join before submission
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE and orphan expired joins blocking worker reallocation
- add reconnect fallback with variable reconnect time if no peers found
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, and amend app shard worker behavior for prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- fix bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- fix loop when shutting down
- add named workers to trace hanging shutdowns
- use deterministic key for peer id of workers to prevent sybil flagging
- remove pubsub stop from app consensus engine and integrate shutdown context to PerformSync
- fix blossomsub pubsub interface subscription status tracking
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4
- add missing quic-v1
- fix dnsaddr to dns4 for blossomsub
- apply sledgehammer to restart logic
- fix restore proper respawn logic, fix frozen hypergraph post respawn, and unsubscribe from previously missing bitmask

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
- fix race condition in peer score management
- repair goose transport init for consolidation websocket addresses
- improve peer update handling when prune exists
- handle zombie peers in revalidation
- fix blossomsub peer removal on disconnected
- add peerscore retries on backoff broke condition
- prune track channels on context cancel
- fix pebble on windows

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
