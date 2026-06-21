---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-21
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

**Last updated:** June 21, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build by static linking flint/mpfr and gmp
- resolve standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, and worker logging to own files
- fix keys file handling and reduce excess joins/leaves
- demote p2p, archive client, coverage halt, shard ops, prover message, and shard frame logs to debug
- resolve domain separation bug for invalid signature
- fix tokio thread issue with logging
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix shard store discrepancy and use correct source for current frame number
- cache requests to prevent available shards from flashing
- resolve stale 0 frame data response and adjust blossomsub parameters
- refactor tree behaviors to skip stale data effects
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug crashing worker threads
- fix too many streams issue and force static link on libchannel
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rust node
- use sha3 for prover join vdf verifier
- fix rust node initialization and router validator test
- refactor quil-node main into submodules (storage, keys, engines, frame_pipeline, networking, runtime_state, peer_info_publisher, worker_manager, allocator_and_lifecycle, message_loop, archive_sync, grpc)
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores with memory profiling and allocator swap
- fix message drops and bitmask of workers
- add aggressive query for frame to avoid expired joins
- fix leave proposal adjustment for halt risk
- resolve proposal bug using joining count in halt risk calculation
- handle 67% barrier for halt risk
- fix off-by-one on leave planning
- fix TUI manage submission of messages
- fix expired leaves not treated as confirmed leaves in proposal logic and worker allocator
- resolve loop of halt risk swap and race where overlapping joins are submitted

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- fix possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug env var to be read
- fix newPebbleDB constructor config param
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- small tweaks to cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- resolve sync race condition with prover registry pruning and fix sync message size limit defaults
- fix seniority marker join blocker and expired joins blocking new joins due to pruning disable
- resolve signature failure in merge-related signatures
- fix collector/hotstuff race condition and orphan expired joins blocking worker reallocation
- fix abandoned prover joins and reload prover registry on allocation wait
- fix stale worker proposal edge and reset frozen hypergraph after respawn
- fix rare SIGFPE and non-fallthrough condition
- add reconnect fallback with variable timeout when no peers found; increase base peer count to 1
- fix expired prover join frames, starting port ranges, proposer stalling, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, and coverage event check not in shutdown logic
- amend app shard worker behavior to mirror global for prover root reconciliation
- fix shutdown scenario quirks, reload hanging, and premature bailout from coverage check
- force registry refresh on worker waiting for registration; snapshots no longer block close on shutdown
- use deterministic key for worker peer IDs to avoid sybil flagging
- remove pubsub stop from app consensus engine (should not manage lifecycle) and integrate shutdown context into `PerformSync` to prevent stuck syncs
- fix blossomsub pubsub interface subscription status tracking and subscribe order to avoid nil panic
- switch from `dnsaddr` to `dns4` for peer discovery (blossomsub); add missing `quic-v1`
- remove compatibility with old 2.0.0 blossomsub

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
- no commit messages provided

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
