---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-07-07
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

**Last updated:** July 7, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- fix race where initial sync failure leaves workers idle until reboot
- fix patch number sync with config
- fix transaction safety for hypergraph store writes
- make lazy tree commit retry-safe by deferring dirty state clearing
- make compute_shard_root read-only to prevent unintended writes
- require RocksTxn for hypergraph store writes, removing silent fallback
- handle store wipe on leaving scenario
- reduce score differential basis for flagging leave-to-join opportunities
- extend scoring-based leave window to a full cycle
- adjust margins on decisions and thresholds for decides and joins
- adjust snapshotting to use actual rocksdb snapshots
- resolve unsynced leave issuance condition
- reapply docker build optimizations to Dockerfile.source
- add consensus rejoin for lagging archives by syncing proposals from peers

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue with static linking for flint/mpfr/gmp
- fix standalone worker connection string derivation
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files, and various additional bugs
- fix keys file handling, pare back excess joins/leaves
- demote p2p and various loggers to debug
- enhance v2.1.0.23 with log coverage, shard ops, prover submission, and various fixes
- resolve domain separation bug for invalid signature
- resolve tokio thread issue with logging
- fix leaving prover bug in worker allocator
- resolve worker storage location bug and log noise
- fix TUI quirks for manual mode
- forcibly adjust halt risk shards as primary selection criteria
- address issues 1,2,3 from blackswan
- resolve worker persistence and missing lock updates
- harden prover path
- fix shard store discrepancy and use different source for current frame number
- cache requests to stop available shards from flashing
- resolve stale 0 frame data response, adjust blossomsub params
- refactor tree behaviors to skip stale data effects
- never assume, always ensure prover tree
- handle orphaned allocations and allocations on zero byte shards
- fix issues 1-6 reported by blackswan
- fix autonat bug crashing worker threads
- fix build for linux
- fix too many streams issue and address edge case with delegate address
- resolve stream connection issue with kad-dht
- fix quil-engine unit tests and router validator tests
- support white spaces in genesis seed for testnets
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- improve rust and docker build times
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix router_validator_passes_well_formed_peer_info test
- refactor quil-node main into submodules (storage, keys, engines, frame_pipeline, networking, etc.)
- fix canonicalization bug for peer info
- propagate errors from subsystems
- reduce logging on noisy connection events
- increase duration between peer info and key registry publishes
- fix OOM from unbounded stores with memory profiling, logging, and allocator swap
- add diagnostics for message drops
- fix bit

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands, show worker id
- relaxed peerstore clearing interval
- tuned component-level logging
- prover management tui: manual management tracking, joins by worker id
- optimized tui performance
- added logging for shard allocation join confirm/reject and plan leave details
- updated default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed "pending" to "joining" in ui
- fixed merge spend marker
- fixed sorting and ring position issues in tui
- fixed render width for [M] marker in tui
- fixed timereel behavior to accept new head immediately
- added timeout for global frame fetch
- added lru cache to getglobalframe handler
- fixed estimation behavior to properly calculate ring position and membership set
- fixed worker tui reward calculation and logical shard count, reduced bandwidth on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject for shard joins and leaves
- fixed dynamic filter width
- improved blossomsub, estimate/hard calc changes
- applied migrations to resolve eviction issue
- refactored global consensus engine into discrete components
- adjusted rpc/worker ring display in tui

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting/precision on prover reward data
- fix peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- Allow debug environment variable to be read
- Fix newPebbleDB constructor config parameter
- Fix high CPU overhead in initial worker behaviors and ongoing sync
- Add extra data to node info and query metrics from command line
- Leave proposals for overcrowded shards
- Implement hub-and-spoke global message broadcasts
- Small tweaks to CLI output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- fix seniority marker join blocker
- fix sync message size limit defaults
- resolve signature failure
- fix one-shot sync message size, app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins
- remove compatibility with old 2.0.0 blossomsub
- resolve abandoned prover joins
- reload prover registry
- fix stale worker proposal edge
- resolve non-fallthrough condition
- fix rare SIGFPE and orphan expired joins blocking worker reallocation
- add reconnect fallback if no peers found with variable reconnect time
- update base peer count to 1
- fix expired prover join frames, starting port ranges, proposer getting stuck, and seniority on joins
- fix panic on shutdown, libp2p discovery picking inaccessible peers, coverage event check not in shutdown logic, and amend app shard worker behavior for prover root reconciliation
- fix shutdown scenario quirks and reload hanging
- do not bailout early on shutdown of coverage check
- force registry refresh on worker waiting for registration
- fix worker manager refresh filter on allocation, snapshots blocking close on shutdown
- force shutdown after five seconds for app worker
- don't loop when shutting down
- use deterministic key for peer id of workers to stop flagging as sybil attacks
- remove pubsub stop from app consensus engine, integrate shutdown context to PerformSync to prevent stuck syncs
- fix blossomsub pubsub interface subscription tracking
- fix subscribe order to avoid nil panic
- switch from dnsaddr to dns4 for peer discovery
- add missing quic-v1
- restore proper respawn logic, fix frozen hypergraph post respawn, unsubscribe from missing bitmasks

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
- fixed blossom off-switch for minimum previous peers
- resolved server side error for missing frame producer case
- allow server side engine to process without pending objects
- added kzg batch verification for Ed25519 batch signatures

---

*This document is auto-generated daily. Curated notes come from the monorepo RELEASE-NOTES file. Versions marked (auto-generated) are summarized from commit messages and may be less precise.*
