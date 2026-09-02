---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-09-02
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

**Last updated:** September 2, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix patch number sync with config, resolve race condition where initial sync failure could permanently idle workers
- fix transaction safety for hypergraph store writes, ensuring partial syncs don't persist data
- make lazy tree commit retry-safe by deferring dirty-state clear until transaction is durably committed
- make compute_shard_root read-only, preventing unintended writes outside any frame transaction
- require RocksTxn for hypergraph store writes, eliminating silent direct-write fallback
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities, extend scoring-based leave window to a full cycle
- adjust margins on decisions and threshold for decides and joins
- adjust snapshotting to use actual RocksDB snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- allow a lagging archive to rejoin consensus by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static link flint/mpfr
- resolve e2e testnet edge cases and reported issues
- fix standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, worker logging, and various other bugs
- improve keys file handling and reduce excess joins/leaves
- resolve domain separation bug for invalid signature
- fix tokio thread issue with logging
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix shard store discrepancy and use correct source for current frame number
- resolve stale 0 frame data response and adjust blossomsub params
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug crashing worker threads
- fix too many streams issue and force static link on libchannel
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix rust node initialization
- refactor quil-node main into submodules (master_node, worker_node, dht_node, etc.)
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging noise on connection events
- fix OOM from unbounded stores with memory profiling and allocator swap
- fix proposal bug using joining count as part of halt risk calculation
- handle 67% barrier for halt risk
- fix expired leaves not treated as confirmed in proposal logic and worker allocator
- resolve race condition with overlapping join submissions
- fix tui manage submission of messages

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- address peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug environment variable to be read
- fix newPebbleDB constructor config parameter
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts

## v2.1.0.19 (version .19) *(auto-generated)*
- Fix seniority marker join blocker and sync message size limit defaults
- Resolve signature failure in merge-related signatures
- Fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- Remove compatibility with old 2.0.0 blossomsub
- Resolve abandoned prover joins and add prover registry reload
- Fix stale worker proposal edge and add full sanity check on join submissions
- Resolve non-fallthrough condition that should be fallthrough
- Fix rare SIGFPE and orphan expired joins blocking worker reallocation
- Add reconnect fallback with variable reconnect time and update base peer count to 1
- Fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- Fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, amend app shard worker behavior to mirror global for prover root reconciliation
- Fix shutdown scenario quirks, reload hanging, and bailout early on coverage check shutdown
- Force registry refresh on worker waiting for registration
- Fix worker manager filter refresh on allocation and snapshots blocking close on shutdown
- Force shutdown after five seconds for app worker, prevent loop on shutdown, add named workers to trace hanging shutdowns
- Use deterministic key for worker peer id to stop sybil attack flagging
- Remove pubsub stop from app consensus engine, integrate shutdown context to PerformSync to prevent stuck syncs from halting respawn
- Fix blossomsub pubsub interface subscription status tracking and subscribe order to avoid nil panic
- Switch from dnsaddr to dns4 for blossomsub and add missing quic-v1
- Fix respawn logic, frozen hypergraph post respawn, and unsubscribe from previously missing bitmask

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
