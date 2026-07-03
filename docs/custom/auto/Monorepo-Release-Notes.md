---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-03
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

**Last updated:** July 3, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race where initial sync failout leaves workers permanently idle
- fix patch number sync with config
- fix transaction safety for hypergraph store writes (atomic sync-apply, retry-safe lazy tree commit, read-only compute_shard_root, enforced RocksTxn for all writes)
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities and extend scoring-based leave window to a full cycle
- adjust thresholds for decisions and joins
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations in Dockerfile.source
- support rejoining a lagging archive peer by syncing proposals from peers (new `GetGlobalProposal` RPC, missing parent hook, catch-up task)

## v2.1.0.23 (version .23) *(auto-generated)*
- fix standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files, and various additional bugs
- improve keys file handling and reduce excess joins/leaves
- resolve domain separation bug for invalid signatures
- fix tokio thread issue related to logging
- add fast path to push straight to archives for retrieving info
- fix leaving prover bug in worker allocator
- fix worker storage location bug and reduce log noise
- improve TUI quirks for manual mode
- adjust prover shard choices to use halt risk as primary selection criterion
- address multiple bug reports from blackswan (issues 1-6)
- fix missed `Left` → `Leaving` state transition
- resolve worker persistence and missing lock update
- harden prover path and fix shard store discrepancy
- cache shard requests to prevent flashing available shards
- resolve stale zero-frame data response and adjust blossomsub parameters
- refactor tree behaviors to skip stale data effects
- handle orphaned allocations and allocations on zero-byte shards
- add missing `worker_ids` field
- fix autonat bug that crashed worker threads
- fix too many streams issue and build script to force static link on libchannel
- address edge case with delegate address and resolve stream connection issue with kad-dht
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- support archive endpoints configuration in Rust node
- use SHA3 for prover join VDF verifier
- fix initialization issues in Rust node
- add memory profiling and logging to trace OOM, and switch allocator
- fix canonicalization bug for peer info
- propagate errors from subsystems properly
- reduce logging noise on noisy connection events
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores with memory adjustments
- add diagnostic insights for message drops
- fix bitmask of workers and cheaper peek-verification on peer info for faster roundtrip ignores
- implement aggressive query for frame to avoid expired joins
- adjust leave proposal for halt risk and resolve proposal bug using joining count
- handle 67% barrier for halt risk
- fix off-by-one on leave planning
- roll up small port-related issues
- fix TUI manage submission of messages
- fix bug where expired leaves were not treated as confirmed leaves in

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data, possible solution to peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fix high CPU overhead in initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- small tweaks to cli output for join frames
- fix newPebbleDB constructor config parameter
- allow debug env var to be read

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins
- reload prover registry
- fix stale worker proposal edge
- add sanity check on join before submitting
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE and orphan expired joins blocking workers from reallocating
- add reconnect fallback if no peers found
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, amend app shard worker behavior to mirror global for prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager refreshes filter on allocation and snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- don't loop when shutting down
- use deterministic key for peer id of workers to stop flagging workers as sybil attacks
- fix pubsub lifecycle management – remove pubsub stop from app consensus engine, integrate shutdown context to `PerformSync` to prevent stuck syncs from halting respawn
- fix blossomsub pubsub interface subscription tracking
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4
- add missing quic-v1
- fix dnsaddr to dns4 for blossomsub
- apply sledgehammer to restart logic
- restore proper respawn logic, fix frozen hypergraph post respawn, unsubscribe from bitmask previously missing

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
