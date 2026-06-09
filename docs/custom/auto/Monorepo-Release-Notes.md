---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-09
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

**Last updated:** June 9, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- address possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug mode via environment variable
- fix pebble db constructor config parameter
- fix high cpu overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker
- fix sync message size limit defaults
- resolve signature failure
- fix one-shot sync message size
- fix app shard TC signature size
- fix collector/hotstuff race condition
- fix expired joins blocking new joins due to pruning disable
- remove compat with old 2.0.0 blossomsub
- resolve abandoned prover joins
- reload prover registry
- fix stale worker proposal edge
- resolve non-fallthrough condition that should be fallthrough
- resolve rare SIGFPE
- fix orphan expired joins blocking workers from reallocating
- add reconnect fallback if no peers are found with variable reconnect time
- update base peer count to 1
- fix expired prover join frames
- fix starting port ranges
- fix proposer getting stuck
- fix seniority on joins
- fix panic on shutdown
- fix libp2p discovery picking inaccessible peers
- fix coverage event check not in shutdown logic
- amend app shard worker behavior to mirror global for prover root reconciliation
- fix shutdown scenario quirks
- fix reload hanging
- do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager refreshes the filter on allocation
- fix snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- don't loop when shutting down
- fix slight reordering
- use deterministic key for peer id of workers to stop flagging workers as sybil attacks
- remove pubsub stop from app consensus engine
- integrate shutdown context to PerformSync to prevent stuck syncs from halting respawn
- fix blossomsub pubsub interface does not properly track subscription status
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4
- add missing quic-v1
- apply sledgehammer to restart logic
- restore proper respawn logic
- fix frozen hypergraph post respawn
- unsubscribe from bitmask previously missing

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
