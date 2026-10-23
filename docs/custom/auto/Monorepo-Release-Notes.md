---
title: "Quilibrium Node Release Notes"
source: github.com/QuilibriumNetwork/monorepo (automated daily)
date: 2026-10-23
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

**Last updated:** October 23, 2026
**Source:** [Quilibrium Monorepo](https://github.com/QuilibriumNetwork/monorepo)

This document tracks changes in each Quilibrium node release.

## v2.1.0.24 (version .24) *(auto-generated)*
- restored docker build optimizations to Dockerfile.source (consolidated gen stages, restored cargo/go cache mounts)
- fixed race where initial sync failout could doom workers to idle until reboot
- fixed patch number sync with config
- added more test coverage
- re-enabled ed448-rust tests and pacemaker_advances_on_qc test
- fixed transaction safety for hypergraph store writes (vertex data now joins the same txn batch as tree nodes and shard commit)
- made sync-apply path atomic: partial syncs don’t persist on error
- fixed vertex data roundtrip test and added new one
- made LazyVectorCommitmentTree::commit retry-safe (dirty-state clearing deferred until txn commits durably)
- made compute_shard_root read-only (was leaking writes outside frame transactions on hot master-stream path)
- refactored hypergraph store writes to require RocksTxn, removing silent direct-write fallback for unrecognized txns
- added consensus catch-up for lagging archives: rejoin by syncing proposals from peers (GetGlobalProposal, on_missing_parent trigger, catch-up task)

## v2.1.0.23 (version .23) *(auto-generated)*
- fix docker build issue
- revert static linking of flint/mpfr and gmp
- standalone worker: derive connection string correctly
- fix too many joins, invalid signature in qclient, standalone worker mode bugs, workers not logging to own files
- keys file handling, pare back excess joins/leaves
- demote p2p loggers to debug
- log archive client connection, coverage halt risk, shard ops, shard qc submission, prover message submission, shard frame produce, and shard split/merge to debug
- add action to confirm and reject
- resolve domain separation bug for invalid signature
- resolve tokio thread issue re: logging
- fast path: push straight to archives to retrieve info
- fix leaving prover bug in worker allocator
- resolve worker storage location bug + log noise
- smaller tweaks to prover shard choices
- TUI quirks for manual mode
- tweak worker ring logic for available shards
- forcibly adjust halt risk shards as primary selection criteria
- resolve worker persistence
- fix shard store discrepancy
- use different source for current frame number
- cache requests so available shards don't keep flashing
- resolve stale 0 frame data response, adjust blossomsub params
- refactor tree behaviors to skip stale data effects
- halt risk test
- switch archive node
- never assume, always ensure prover tree
- handle orphaned allocations and allocations on zero byte shards
- fix autonat bug crashing worker threads
- fix build for linux
- fix too many streams issue
- address edge case with delegate address, resolve stream connection issue with kad-dht
- fix build script to force static link on libchannel
- fix quilt-engine unit tests and test compilation
- fix router validator tests
- support white spaces in genesis seed for testnets
- add Rust CI with GitHub Actions
- improve router drop logging
- fix propose skip on coverage halts
- fix vdf link order and enable tests in CI
- update Cargo.lock to fix CI
- improve rust and docker build times
- support archive endpoints config in rs node
- use sha3 for prover join vdf verifier
- fix router_validator_passes_well_formed_peer_info test
- refactor quil-node main and extract sibling modules
- refactor ritual-node main: extract engines,

## v2.1.0.22 (version .22) *(auto-generated)*
- improved prover commands and show worker id in output
- relaxed peerstore clearing interval
- added component-level logger tuning
- prover management TUI now tracks manual management and specifies joins by worker id
- optimized TUI rendering and performance
- log shard allocation join confirm/reject and plan leave details
- added default archive peer list
- fixed prover eviction bug
- improved prover visibility when leaving is implicitly accepted
- fixed prover leaving status in event distributor
- renamed pending status to joining
- fixed merge spend marker
- fixed sorting and ring position issues in TUI
- fixed render width for [M] marker
- timereel now accepts new head immediately
- added timeout and LRU cache for global frame fetch
- adjusted estimation behavior for ring position and membership set calculation
- fixed worker TUI reward calc, logical shard count, and bandwidth reduction on app worker
- added auto-sized filters
- optimized logging for plan/decide and confirm/reject shard joins and leaves
- fixed dynamic filter width
- improved blossomsub and estimate/hard calc changes
- added migration to resolve eviction issue
- refactored global consensus engine into discrete components
- adjusted rpc/worker ring display

## v2.1.0.21 (version .21) *(auto-generated)*
- reconcile old and new config paths
- fix formatting and precision on prover reward data
- address possible peering issue
- fix app shard lookups on mainnet

## v2.1.0.20 (version .20) *(auto-generated)*
- support debug env variable for enabling debug mode
- fix pebble db constructor config parameter
- reduce high CPU overhead in initial worker behaviors and ongoing sync
- speed up docker builds with better caching
- add extra data to node info and query metrics from cli
- leave proposals for overcrowded shards
- implement hub-and-spoke global message broadcasts
- tweak cli output for join frames

## v2.1.0.19 (version .19) *(auto-generated)*
- enhanced error logging and fixed seniority marker join blocker
- fixed sync message size limit defaults and one-shot sync message size
- resolved signature failures and added logging for merge-related signatures
- fixed app shard TC signature size, collector/hotstuff race condition, and expired joins blocking new joins
- removed compatibility with old 2.0.0 blossomsub
- resolved abandoned prover joins and reloaded prover registry
- fixed stale worker proposal edge and added full sanity check on join submission
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
- fixed worker manager refreshing filter on allocation and snapshots blocking close on shutdown
- forced shutdown after five seconds for app worker and fixed looping on shutdown
- added named workers to trace hanging shutdowns
- used deterministic key for peer id of workers to stop flagging workers as sybil attacks
- removed pubsub stop from app consensus engine and integrated shutdown context to PerformSync to prevent stuck syncs halting respawn
- fixed blossomsub pubsub interface not properly tracking subscription status
- fixed subscribe order to avoid nil panic
- switched from dnsaddr to dns4 and added missing quic-v1
- applied sledgehammer to restart logic
- restored proper respawn logic, fixed frozen hypergraph post respawn, and unsubscribed from previously missing bitmask

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
