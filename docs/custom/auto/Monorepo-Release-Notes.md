---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-09-03
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

**Last updated:** September 3, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where initial sync failout leaves workers idle until reboot
- fix transaction safety for hypergraph store writes, making lazy-tree commit retry-safe and compute_shard_root read-only
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities, extend scoring-based leave window to a full cycle
- adjust margins on decisions and thresholds for decides and joins
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- enable a lagging archive to rejoin consensus by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue
- force static linking for flint/mpfr and libchannel builds
- fix standalone worker connection string derivation and worker logging to own files
- resolve domain separation bug causing invalid signatures
- fix leaving prover bug in worker allocator
- resolve worker storage location bug
- handle orphaned allocations and allocations on zero byte shards
- fix shard store discrepancy and stale 0 frame data response
- fix expired leaves not treated as confirmed in proposal logic and worker allocator
- resolve race condition with overlapping join submissions
- fix propose skip on coverage halts
- fix halt risk calculation, 67% barrier, and leave planning issues
- resolve worker persistence issue
- add missing worker_ids field
- fix autonat bug crashing worker threads
- fix too many streams and kad-dht stream connection issues
- adjust blossomsub parameters
- use sha3 for prover join vdf verifier
- support archive endpoints config in rust node
- support white spaces in genesis seed for testnets
- fix TUI quirks and manual mode message submission
- cache requests so available shards don't flash
- fix peer info canonicalization and key-to-address inconsistencies
- propagate errors from subsystems
- fix memory OOM by adjusting stores and allocator
- improve rust and docker build times

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- apply possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug environment variable to be read
- fix configuration parameter for new pebble db constructor
- fix high cpu overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak cli output for join frames

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
