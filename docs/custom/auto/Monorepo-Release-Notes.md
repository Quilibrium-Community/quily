---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-06-23
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

**Last updated:** June 23, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build and static linking of flint/mpfr for linux builds
- resolve too many joins, invalid signature, and standalone worker mode bugs
- fix keys file handling and reduce excessive joins/leaves
- resolve domain separation bug causing invalid signatures
- fix tokio thread issue related to logging
- fix leaving prover bug in worker allocator
- fix worker storage location bug and reduce log noise
- fix prover shard choices and ring number calculation
- fix TUI quirks for manual mode and manage submission of messages
- resolve stale 0 frame data response; adjust blossomsub parameters
- fix autonat bug crashing worker threads and stream connection issue with kad-dht
- fix delegate edge case and force static link for libchannel
- support white spaces in genesis seed for testnets
- support archive endpoints configuration in rust node
- use sha3 for prover join vdf verifier
- fix OOM from unbounded stores; add memory profiling and swap allocator
- fix proposal bug using joining count as part of halt risk calculation; handle 67% barrier for halt risk
- fix off-by-one on leave planning and expired leaves not treated as confirmed in proposal/allocator logic
- resolve race where overlapping joins are submitted and loop of halt risk swap
- fix missing items and edge cases reported by testers (issues #558, #560, #561, #562, #563, #535)
- refactor quil-node main.rs into submodules (no behavior changes)
- add Rust CI with GitHub Actions and enable tests in CI
- improve rust and docker build times
- reduce logging noise on p2p, shard ops, prover messages, and connection events

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relax peerstore clearing interval
- component-level logger tuning
- prover management TUI: manual management tracking, join by worker id
- optimize TUI (round 2)
- default archive peer list
- fix prover eviction bug
- improve prover visibility when leave is implicitly accepted
- fix prover leaving status in event distributor
- rename "pending" state to "joining"
- fix merge spend marker
- fix sorting/ring position issues in TUI
- fix render width for [M] marker
- timereel now accepts new head immediately
- add timeout for global frame fetch
- add lru cache to getglobalframe handler
- adjust estimation behavior to correctly calculate ring position and membership set
- fix worker TUI reward calculation and logical shard count, reduce bandwidth on app worker
- auto-sized filters
- fix dynamic filter width
- blossomsub improvements, estimate/hard calc changes
- adjust RPC/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- add debug environment variable to enable debug mode
- fix pebble db constructor config parameter
- fix high cpu overhead in initial worker behaviors and ongoing sync
- add extra data to node info, and query metrics from command line
- make proposals leave overcrowded shards
- implement hub-and-spoke global message broadcasts
- small tweaks to cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- Fix seniority marker join blocker and sync message size limit defaults
- Resolve signature failure and merge-related signature errors
- Fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins due to pruning disable
- Remove compatibility with old 2.0.0 blossomsub
- Resolve abandoned prover joins and reload prover registry
- Fix stale worker proposal edge case
- Add full sanity check on join before submission to identify bugs
- Resolve non-fallthrough condition that should be fallthrough
- Fix rare SIGFPE, orphan expired joins blocking worker reallocation
- Add reconnect fallback with variable reconnect time if no peers found
- Update base peer count to 1
- Fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- Fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, amend app shard worker behavior to mirror global for prover root reconciliation
- Fix shutdown scenario quirks and reload hanging
- Do not bailout early on shutdown of coverage check
- Force registry refresh on worker waiting for registration
- Add more logging to wait for prover
- Fix worker manager refreshing filter on allocation, snapshots blocking close on shutdown
- Force shutdown after five seconds for app worker
- Don't loop when shutting down
- Fix slight reordering, add named workers to trace hanging shutdowns
- Use deterministic key for peer id of workers to stop flagging workers as sybil attacks
- Remove pubsub stop from app consensus engine, integrate shutdown context to PerformSync to prevent stuck syncs from halting respawn
- Fix blossomsub pubsub interface not properly tracking subscription status
- Fix subscribe order to avoid nil panic
- Switch from dnsaddr to dns4
- Add missing quic-v1
- Fix dnsaddr -> dns4 for blossomsub
- Apply sledgehammer to restart logic
- Restore proper respawn logic, fix frozen hypergraph post respawn, unsubscribe from bitmask previously missing

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
- commit messages not provided – cannot generate release notes

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
