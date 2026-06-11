---
title: "Quilibrium Bridge"
source: quilibrium.com/ecosystem (automated)
date: 2026-06-11
type: community_reference
topics:
  - Quilibrium Bridge
  - quilibrium-bridge
  - Quilibrium ecosystem
  - ecosystem project
  - projects on Quilibrium
  - apps on Quilibrium
  - bridge
  - infrastructure
---

# Quilibrium Bridge

**Part of the official Quilibrium ecosystem.** Relation to the network: Quilibrium Protocol (a core piece of Quilibrium, built into the network itself).

**The official bridge between Quilibrium and Ethereum.** Move native `QUIL` to `wQUIL` (an audited ERC-20 on Ethereum) and back, with no centralised custodian sitting in the middle. The bridge is bidirectional: every direction of the trip is handled by the same on-chain mechanism.

Most cross-chain bridges in the industry rely on a permissioned set of oracle operators who attest that something happened on the other chain. The Quilibrium Bridge is structured differently. It runs an **Ethereum execution node inside Quilibrium** and uses MetaVM to produce a cryptographic proof that Ethereum's state transitions are correct: not "a quorum of oracles says so," but "the math says so." Execution-layer proofs are working today; the consensus and finality layers of the proof are still being integrated, after which the bridge model is fully trustless end-to-end. Signing on the Quilibrium side is handled by an **MPC-based signer** rather than a single custodial key. The result is a bridge with no permissioned operators and no trusted middleman.

**Finality** follows Ethereum's probabilistic model: roughly **12.8 minutes** (two Ethereum epochs) for full finalisation, with many users accepting 6–7 block confirmations for lower-value transfers.

**Two ways to use it.** The web flow at quilibrium.com/bridge walks you through a `qclient cross-mint` exchange step by step: enter your QUIL account address, save the displayed coin addresses (you'll need them for recovery if anything fails), run the commands the page gives you, paste the responses back, and complete the bridge. If you prefer the command line, the same operation is available directly through the `qclient` CLI without ever opening the web UI.

**A note on visibility.** Native QUIL on Quilibrium is private by default. Once tokens are bridged to wQUIL on Ethereum, they are subject to Ethereum's transparency: balances and transfers of `wQUIL` are visible to any standard Ethereum block explorer. The audited contract address is `0x8143182a775c54578c8b7b3ef77982498866945d`.

Built by **Quilibrium Inc.**

**Website:** https://quilibrium.com/bridge

**Categories:** bridge, infrastructure

---

*This document is auto-generated from the official Quilibrium ecosystem page at quilibrium.com/ecosystem.*
