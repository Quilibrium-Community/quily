---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-28
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

**Last updated:** June 28, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue with static linking
- resolve standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files
- fix keys file handling, reduce excess joins/leaves
- demote p2p loggers to debug
- resolve domain separation bug for invalid signature
- resolve tokio thread issue with logging
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix shard store discrepancy
- use different source for current frame number
- cache requests to prevent available shards from flashing
- resolve stale 0 frame data response, adjust blossomsub params
- refactor tree behaviors to skip stale data effects
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug crashing worker threads
- fix build for linux, force static link on libchannel
- fix stream connection issue with kad-dht
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rust node
- use sha3 for prover join vdf verifier
- fix router_validator_passes_well_formed_peer_info test
- refactor quil-node main into submodules (storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, allocator_and_lifecycle, message_loop, archive_sync, grpc)
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores, add memory profiling and allocator swap
- fix proposal bug using joining count in halt risk calculation
- handle 67% barrier for halt risk
- fix TUI manage submission of messages
- fix expired leaves not treated as confirmed leaves in proposal logic and worker allocator
- resolve loop of halt risk swap
- resolve race where overlapping joins are submitted

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- apply possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow reading debug mode via environment variable
- fix pebbleDB constructor configuration parameter
- reduce high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and enable querying metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak CLI output for node info

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
- no commit messages provided for this version.

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
