---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-23
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

**Last updated:** July 23, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix transaction safety for hypergraph store writes by making save_vertex_underlying and tree commit transaction-aware, ensuring aborted transactions don't persist partial data
- make `LazyVectorCommitmentTree::commit` retry-safe by deferring dirty-state clearing until the surrounding transaction is durably committed
- make `compute_shard_root` read-only (no longer writes to store via NoopTxn), preventing leaked writes on the hot master-stream receive path
- require `RocksTxn` for hypergraph store writes, removing the silent direct-write fallback that masked bugs
- handle node leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities and extend scoring-based leave window to a full cycle
- adjust margins on decisions and thresholds for decides and joins
- adjust snapshotting to use actual RocksDB snapshots
- resolve unsynced leave issuance condition
- reapply Docker build optimizations (consolidate gen stages, restore cargo/go cache mounts) to `Dockerfile.source`
- add consensus rejoin for lagging archives: serve full proposals via `GetGlobalProposal`, persist proposer vote, and add a catch-up task that pulls missing proposals from peers when a node orphans a proposal for a missing parent
- fix race where initial failout of sync dooms workers to idle forever (until reboot)
- fix patch number sync with config
- fix transaction safety for hypergraph store writes (additional fix)

## v2.1.0.23 (version .23) *(auto-generated)*
- fix standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files, and various additional bugs
- fix keys file handling and reduce excess joins/leaves
- resolve domain separation bug for invalid signature
- resolve tokio thread issue related to logging
- add fast path to push straight to archives for info retrieval
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix TUI quirks for manual mode
- forcibly adjust halt risk shards as primary selection criteria
- resolve worker persistence issue
- fix shard store discrepancy
- use different source for current frame number
- cache requests to prevent available shards from flashing
- resolve stale 0 frame data response and adjust blossomsub parameters
- refactor tree behaviors to skip stale data effects
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug crashing worker threads
- fix too many streams issue
- address edge case with delegate address and resolve stream connection issue with kad-dht
- fix build script to force static link on libchannel
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- improve Rust and Docker build times
- support archive endpoints config in Rust node
- use sha3 for prover join VDF verifier
- fix Rust node initialization issues
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores with memory profiling and allocator swap
- fix bitmask of workers and cheaper peek-verification on peer info
- aggressive query for frame to avoid expired joins
- fix leave proposal adjustment for halt risk
- resolve proposal bug using joining count as part of halt risk calculation
- handle 67% barrier for halt risk
- fix off-by-one on leave planning
- fix TUI manage submission of messages
- fix bug where expired leaves were not treated as confirmed leaves in proposal logic and worker allocator
- resolve loop of halt risk swap
- resolve race where overlapping joins are submitted

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- address possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- added debug environment variable to enable debug logging
- fixed PebbleDB constructor configuration parameter
- resolved high CPU overhead in initial worker behaviors and ongoing sync
- improved Docker build caching for faster builds
- added extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implemented hub-and-spoke global message broadcasts
- tweaked CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure in merge-related signatures
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- remove compatibility with old 2.0.0 blossomsub
- fix abandoned prover joins and reload prover registry
- fix stale worker proposal edge case
- add full sanity check on join before submission
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE and orphan expired joins blocking worker reallocation
- add reconnect fallback with variable reconnect time when no peers found
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, and amend app shard worker behavior for prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- fix loop during shutdown and add named workers to trace hanging shutdowns
- use deterministic key for peer id of workers to prevent sybil flagging
- remove pubsub stop from app consensus engine and integrate shutdown context to PerformSync to prevent stuck syncs from halting respawn
- fix blossomsub pubsub interface subscription status tracking and subscribe order to avoid nil panic
- switch from dnsaddr to dns4 and add missing quic-v1
- fix dnsaddr → dns4 for blossomsub
- restore proper respawn logic, fix frozen hypergraph post respawn, and unsubscribe from previously missing bitmask

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
