---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-11-02
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

**Last updated:** November 2, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race condition where initial sync failure left workers idle until reboot
- fix patch number sync with config
- make hypergraph store writes transaction-safe
- fix transaction safety for hypergraph store writes
- fix: use tx when saving vertex data
- make LazyVectorCommitmentTree::commit retry-safe
- make compute_shard_root read-only
- require RocksTxn for hypergraph store writes
- handle leaving scenario with store wipe
- reduce score differential basis for flagging leave-to-join opportunities
- extend scoring-based leave window to be a full cycle
- adjust margins on decisions
- adjust thresholds for decides and joins
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- consensus: rejoin a lagging archive by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- resolve docker build issue with static flint/mpfr linking
- fix qclient invalid signature and standalone worker mode bugs
- resolve too many joins/leaves and worker logging issues
- demote p2p and shard logging to debug
- fix domain separation bug for invalid signature
- resolve tokio thread issue re logging
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and log noise
- tweak prover shard choices and ring number calculation
- adjust halt risk shards as primary selection criteria
- fix shard store discrepancy and stale 0 frame data response
- adjust blossomsub params
- refactor tree behaviors to skip stale data effects
- add extra logging for worker panics and handle orphaned allocations
- fix autonat bug crashing worker threads
- fix too many streams issue and kad-dht stream connection
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- refactor quil-node main into sibling modules
- extract subsystem init phases from main.rs
- propagate errors from subsystems
- fix canonicalization bug for peer info
- reduce logging noise on connection events
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores
- add memory profiling and allocator swap
- fix bitmask of workers and cheaper peak-verification for faster roundtrips
- fix expired leaves in proposal logic and worker allocator
- resolve race where overlapping joins are submitted
- fix halt risk calculation and leave planning off-by-one
- fix tui manage submission of messages

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relaxed peerstore clearing interval
- added component-level logger tuning
- prover management TUI adds manual management tracking and specifies joins by worker id
- optimized TUI round 2
- log shard allocation join confirm or reject + plan leave details
- default archive peer list
- fixed prover eviction bug
- small tweaks around prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed pending to joining
- fixed merge spend marker
- fixed weird sorting/ring position issues in TUI
- fixed render width for [M] marker
- timereel behavior should accept new head immediately
- added timeout for global frame fetch
- added lru cache to getglobalframe handler
- adjusted estimation behavior to properly calculate ring position and membership set
- fixed worker TUI reward calc/logical shard count, bandwidth reduction on app worker
- auto-sized filters
- optimized logging for plan / decide and confirm / reject for shard joins and leaves
- fixed dynamic filter width
- blossomsub improvements, estimate/hard calc changes
- fixed migration + improved logging
- new migration to resolve eviction issue
- refactored global consensus engine into discrete components, update tests
- adjusted rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- fix possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- fixed newPebbleDB constructor config parameter
- fix high CPU overhead in initial worker behaviors and ongoing sync
- QoL: add extra data to node info, and query metrics from command line
- leave proposals for overcrowded shards
- hub-and-spoke global message broadcasts
- small tweaks to CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging and fixed seniority marker join blocker
- fixed sync message size limit defaults and one-shot sync message size
- resolved app shard TC signature size and collector/hotstuff race condition
- fixed expired joins blocking new joins due to pruning disable
- removed compat with old 2.0.0 blossomsub
- resolved abandoned prover joins and reload prover registry
- fixed stale worker proposal edge
- added full sanity check on join before submitting
- resolved non-fallthrough condition that should be fallthrough
- fixed rare SIGFPE and orphan expired joins blocking worker reallocation
- added reconnect fallback with variable reconnect time when no peers found
- updated base peer count to 1
- fixed expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fixed panic on shutdown, libp2p discovery picking inaccessible peers, and coverage event check not in shutdown logic
- amended app shard worker behavior to mirror global for prover root reconciliation
- fixed shutdown scenario quirks and reload hanging
- fixed early bailout on shutdown of coverage check
- forced registry refresh on worker waiting for registration
- added more logging to wait for prover
- fixed worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- forced shutdown after five seconds for app worker
- fixed looping when shutting down
- added named workers to trace hanging shutdowns
- used deterministic key for peer id of workers to stop flagging workers as sybil attacks
- removed pubsub stop from app consensus engine and integrated shutdown context to PerformSync to prevent stuck syncs from halting respawn
- fixed blossomsub pubsub interface not properly tracking subscription status
- fixed subscribe order to avoid nil panic
- switched from dnsaddr to dns4 and added missing quic-v1
- added logging to isolate respawn quirks
- fixed dnsaddr -> dns4 for blossomsub
- applied sledgehammer to restart logic
- restored proper respawn logic, fixed frozen hypergraph post respawn, and unsubscribed from bitmask previously missing

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
