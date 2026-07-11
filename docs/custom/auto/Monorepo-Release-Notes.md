---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-11
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

**Last updated:** July 11, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where initial sync failure left workers permanently idle
- add transaction atomicity for hypergraph store writes, including sync-apply path
- make `LazyVectorCommitmentTree::commit` retry-safe by deferring dirty-state clearing until transaction commit
- make `compute_shard_root` read-only to prevent unintended writes outside transactions
- require RocksDB transactions for hypergraph store writes, removing silent fallback path
- handle store wipe during leaving scenario
- reduce score differential threshold for leave-to-join opportunities, extend scoring leave window to full cycle
- adjust margins on decisions and thresholds for decides and joins
- switch snapshotting to use actual RocksDB snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- enable lagging archive to rejoin consensus by syncing proposals from peers via `SyncTrigger`

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue
- fix standalone worker connection string derivation
- fix too many joins, invalid signature, standalone worker mode bugs, workers not logging to own files, and other bugs
- fix keys file handling, reduce excess joins/leaves
- resolve domain separation bug for invalid signature
- resolve tokio thread issue related to logging
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix router validator tests
- fix quil-engine unit tests
- fix build for Linux
- fix build script to force static link on libchannel
- fix autonat bug crashing worker threads
- fix too many streams issue
- fix edge case with delegate address
- fix stream connection issue with kad-dht
- fix propose skip on coverage halts
- fix vdf link order
- fix noisy log
- fix router_validator_passes_well_formed_peer_info test
- fix canonicalization bug for peer info
- address #558, #560, #561 reported by testers
- address #562, #563 and reduce logging noise
- fix OOM from unbounded stores, add memory profiling and allocator swap
- fix proposal bug using joining count as part of halt risk calculation
- fix TUI manage submission of messages
- fix bug where expired leaves were not treated as confirmed leaves in proposal logic and worker allocator
- resolve loop of halt risk swap
- resolve race where overlapping joins are submitted
- support white spaces in genesis seed for testnets
- support archive endpoint config in Rust node
- use sha3 for prover join VDF verifier
- add Rust CI with GitHub Actions
- improve rust and docker build times
- propagate errors from subsystems
- increase duration between peer info and key registry publishes
- adjust blossomsub parameters
- refactor quil-node main.rs into submodules (12 master_node modules, 4 entry point modules, utilities)

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands to show worker id
- relaxed peerstore clearing interval
- component-level logger tuning
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimized TUI rendering
- log shard allocation join confirm/reject and plan leave details
- default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed "pending" to "joining"
- fixed merge spend marker
- fixed sorting/ring position issues in TUI
- fixed render width for [M] marker
- timereel behavior now accepts new head immediately
- added timeout for global frame fetch
- added lru cache to getglobalframe handler
- adjusted estimation behavior to properly calculate ring position and membership set
- fixed worker TUI reward calculation and logical shard count, reduced bandwidth on app worker
- auto-sized filters
- optimized logging for plan/decide and confirm/reject for shard joins and leaves
- fixed dynamic filter width
- blossomsub improvements, estimate/hard calc changes
- fixed migration and improved logging
- new migration to resolve eviction issue
- refactored global consensus engine into discrete components, updated tests
- adjusted rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- address possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug logging via `DEBUG` environment variable
- fix pebble database constructor configuration parameter
- fix high CPU overhead during initial worker behaviors and ongoing sync
- add extra data to node info and query metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- improve CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge case
- add full sanity check on join before submission
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE and orphan expired joins blocking worker reallocation
- add reconnect fallback with variable reconnect time
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, and amend app shard worker behavior for prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- fix loop during shutdown
- add named workers to trace hanging shutdowns
- use deterministic key for peer id of workers to prevent sybil flagging
- remove pubsub stop from app consensus engine and integrate shutdown context to PerformSync
- fix blossomsub pubsub interface subscription status tracking
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4
- add missing quic-v1
- fix dnsaddr to dns4 for blossomsub
- apply sledgehammer to restart logic
- fix restore proper respawn logic, frozen hypergraph post respawn, and unsubscribe from bitmask

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
- fixed a bug where the node would not properly handle the new "prover" message type
- resolved a race condition in the prover registry pruning logic
- added a new "prover" message type for improved network communication
- fixed a channel bug that could cause message delivery failures
- improved handling of prover-related messages in the gossip protocol

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
