---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-31
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

**Last updated:** July 31, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue
- static link flint/mpfr
- fix standalone worker connection string
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, and worker logging to own files
- fix keys file handling and reduce excess joins/leaves
- resolve domain separation bug causing invalid signature
- resolve tokio thread issue with logging
- add fast path to push straight to archives for info retrieval
- fix leaving prover bug in worker allocator
- resolve worker storage location bug
- tweak prover shard choices
- fix ring number calculation quirk
- fix TUI quirks for manual mode
- tweak worker ring logic for available shards
- forcibly adjust halt risk shards as primary selection criteria
- address blackswan issues 1–3
- fix missed Left→Leaving state transition
- resolve worker persistence
- fix missing lock update
- harden prover path
- fix shard store discrepancy
- use different source for current frame number
- cache requests to stabilize available shards display
- fix implicit behaviors not captured
- resolve stale 0 frame data response and adjust blossomsub parameters
- refactor tree behaviors to skip stale data effects
- switch archive node
- ensure prover tree always exists
- handle orphaned allocations and allocations on zero byte shards
- fix blackswan issues 1–6
- add missing worker_ids field
- fix autonat bug crashing worker threads
- fix Linux build
- fix too many streams issue
- fix delegate address edge case and kad-dht stream connection issue
- force static link on libchannel
- support whitespace in genesis seed for testnets
- fix propose skip on coverage halts
- fix VDF link order
- improve Rust and Docker build times
- support archive endpoints configuration in rs node
- use SHA3 for prover join VDF verifier
- fix node initialization
- address issues #558, #560, #561
- fix canonicalization bug for peer info
- propagate errors from subsystems
- fix issue #535
- address issues #562, #563
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores
- include missing mem_stats
- swap allocator and adjust memory profiling
- fix bitmask of workers and optimize peer info verification
- aggressively query for frame to avoid expired joins
- fix join failures (rc diagnosed)
- adjust leave proposal for halt risk
- fix proposal bug using joining count in halt risk calculation
- handle 67% barrier for halt risk
- fix off-by-one in leave planning
- fix port-related issues
- fix TUI message submission
- fix expired leaves not treated as confirmed leaves in proposal logic and worker allocator
- resolve halt risk swap loop
- resolve race condition with overlapping joins

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- apply possible solution to peering issue
- fix app shard lookups on mainnet

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
- fixed a bug where the node would not properly handle the new DKLs23 fork
- resolved a race condition in the prover registry pruning process
- corrected a channel synchronization issue

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
