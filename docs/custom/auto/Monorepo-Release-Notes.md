---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-08-30
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

**Last updated:** August 30, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issues
- resolve domain separation bug for invalid signatures
- fix too many joins, invalid signature in qclient, and standalone worker mode bugs
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and reduce log noise
- fix worker persistence and missing lock update
- fix shard store discrepancy
- resolve stale 0 frame data response and adjust blossomsub parameters
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug crashing worker threads
- fix build for linux and force static link on libchannel
- address edge case with delegate address and resolve stream connection issue with kad-dht
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rust node
- use sha3 for prover join vdf verifier
- fix rust node initialization issues
- refactor quil-node main into submodules for better maintainability
- fix canonicalization bug for peer info
- propagate errors from subsystems (#558, #560, #561)
- reduce logging noise on connection events and prover management
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores with memory profiling and allocator swap
- fix message drops and bitmask of workers
- improve peek-verification on peer info for faster roundtrip ignores
- fix proposal bug using joining count as part of halt risk calculation
- fix expired leaves not treated as confirmed leaves in proposal logic and worker allocator
- resolve loop of halt risk swap and race where overlapping joins are submitted
- fix TUI manage submission of messages
- fix leave proposal adjustment for halt risk
- fix off by one on leave planning

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relaxed peerstore clearing interval
- component-level logger tuning
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimize TUI performance
- log shard allocation join confirm/reject + plan leave details
- default archive peer list
- fix prover eviction bug
- small tweaks around prover visibility when leaving is implicitly accepted
- fix prover leaving status in event distributor
- rename pending to joining
- fix merge spend marker
- fix sorting/ring position issues in TUI
- fix render width for [M] marker
- timereel behavior should accept new head immediately
- add timeout for global frame fetch
- add lru cache to getglobalframe handler
- adjust estimation behavior to properly calculate ring position and membership set
- fix worker TUI reward calc/logical shard count, bandwidth reduction on app worker
- auto-sized filters
- optimize logging for plan/decide and confirm/reject for shard joins and leaves
- fix dynamic filter width
- blossomsub improvements, estimate/hard calc changes
- fix migration + improved logging
- new migration to resolve eviction issue
- refactor global consensus engine into discrete components, update tests
- adjust rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data and address a possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow setting debug mode via environment variable
- fix pebble DB constructor configuration parameter
- resolve high CPU overhead during initial worker behaviors and ongoing sync
- add extra data to node info and support querying metrics from command line
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts for improved efficiency
- tweak CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure and add error logging for merge-related signatures
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, expired joins blocking new joins due to pruning disable
- remove compat with old 2.0.0 blossomsub
- resolve abandoned prover joins and reload prover registry
- fix stale worker proposal edge and add full sanity check on join before submitting
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE, orphan expired joins blocking workers from reallocating
- add reconnect fallback with variable reconnect time and update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic
- fix shutdown scenario quirks, reload hanging, do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager refreshing filter on allocation, snapshots blocking close on shutdown
- force shutdown after five seconds for app worker, don't loop when shutting down
- add named workers to trace hanging shutdowns
- use deterministic key for peer id of workers to stop flagging workers as sybil attacks
- remove pubsub stop from app consensus engine, integrate shutdown context to PerformSync
- fix blossomsub pubsub interface not properly tracking subscription status
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4 and add missing quic-v1
- fix blossomsub dnsaddr -> dns4
- apply sledgehammer to restart logic
- fix respawn logic, frozen hypergraph post respawn, unsubscribe from bitmask previously missing

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
