---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-02
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

**Last updated:** July 2, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where initial sync failout leaves workers idle forever until reboot
- fix transaction safety for hypergraph store writes: use rocksdb transactions for atomic commits, abort support, and retry-safe commitment
- make compute_shard_root read-only to prevent writes outside a transaction
- handle node leaving scenario with store wipe
- reduce flagging of leave-to-join opportunities and extend leave window to a full cycle
- adjust thresholds for decide and join decisions
- adjust snapshotting to use actual rocksdb snapshots
- resolve condition where leave issuance was not synced with consensus
- reapply docker build optimizations to dockerfile.source (consolidate build stages, restore cache mounts)
- enable a lagging archive node to rejoin consensus by syncing missing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- fix domain separation bug causing invalid signatures
- fix too many joins/leaves and invalid signature in qclient and standalone worker mode
- fix standalone worker connection string derivation
- fix worker storage location bug and log noise
- fix leaving prover bug in worker allocator
- fix propose skip on coverage halts
- fix stale 0 frame data response
- fix race condition with overlapping joins and expired leaves not treated as confirmed
- fix halt risk swap loop and proposal bug using joining count
- fix canonicalization bug for peer info
- handle orphaned allocations and allocations on zero byte shards
- handle 67% barrier for halt risk
- fix TUI manage submission of messages
- fix autonat bug crashing worker threads
- reduce logging noise for connection events
- support white spaces in genesis seed for testnets
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- add memory profiling and allocator swap to trace OOM
- cache requests to prevent available shards from flashing
- fast path: push straight to archives to retrieve info
- adjust blossomsub parameters for better performance
- increase duration between peer info and key registry publishes
- force static link on libchannel for Linux builds

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relax peerstore clearing interval
- component-level logger tuning
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimize TUI
- log shard allocation join confirm/reject and plan leave details
- default archive peer list
- fix prover eviction bug
- small tweaks around prover visibility when leaving is implicitly accepted
- fix prover leaving status in event distributor
- rename pending to joining
- fix merge spend marker
- fix weird sorting/ring position issues in TUI
- fix render width for [M] marker
- fix timereel behavior to accept new head immediately
- add timeout for global frame fetch
- add lru cache to getglobalframe handler
- fix estimation behavior to properly calculate ring position and membership set
- fix worker TUI reward calc/logical shard count, bandwidth reduction on app worker
- auto-sized filters
- optimize logging for plan/decide and confirm/reject for shard joins and leaves
- fix dynamic filter width
- fix blossomsub improvements, estimate/hard calc changes
- new migration to resolve eviction issue
- adjust rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- address peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- allow debug env var to be read
- fix newPebbleDB constructor config param
- fix high CPU overhead in initial worker behaviors/ongoing sync
- add extra data to node info, and query metrics from command line
- leave proposals for overcrowded shards
- hub-and-spoke global message broadcasts
- small tweaks to cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker and sync message size limit defaults
- resolve signature failure
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins
- remove compatibility with old 2.0.0 blossomsub
- fix abandoned prover joins
- reload prover registry
- fix stale worker proposal edge case
- add full sanity check on join before submission
- resolve non-fallthrough condition that should be fallthrough
- fix rare SIGFPE and orphan expired joins blocking worker reallocation
- add reconnect fallback with variable reconnect time when no peers found
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, and amend app shard worker behavior for prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- fix early bailout on coverage check shutdown
- force registry refresh on worker waiting for registration
- fix worker manager filter refresh on allocation and snapshots blocking shutdown close
- force shutdown after five seconds for app worker
- fix loop during shutdown and reordering, add named workers to trace hanging shutdowns
- use deterministic key for worker peer IDs to prevent sybil identification
- remove pubsub stop from app consensus engine, integrate shutdown context into PerformSync to prevent stuck syncs from halting respawn
- fix blossomsub subscription tracking
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4
- add missing quic-v1 transport
- fix dnsaddr to dns4 for blossomsub
- improve restart logic to prevent looping
- restore proper respawn logic, fix frozen hypergraph post respawn, and fix unsubscribe from previously missing bitmask

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
- fix blossomsub peer scoring to not penalize for duplicate messages
- resolve race condition in peer store during connection pruning
- improve gossip message validation for better network stability
- reduce memory usage in message caching for large networks

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
