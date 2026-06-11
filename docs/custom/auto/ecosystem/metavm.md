---
title: "MetaVM"
source: quilibrium.com/ecosystem (automated)
date: 2026-06-11
type: community_reference
topics:
  - MetaVM
  - metavm
  - Quilibrium ecosystem
  - ecosystem project
  - projects on Quilibrium
  - apps on Quilibrium
  - infrastructure
  - devtools
  - open-source
---

# MetaVM

**Part of the official Quilibrium ecosystem.** Relation to the network: Quilibrium Protocol (a core piece of Quilibrium, built into the network itself).

**A way to prove a program ran correctly, without anyone having to re-run it.** MetaVM is built directly into Quilibrium so the network can trust the result of a computation by checking a small cryptographic proof instead of repeating the work.

Decentralized networks have a basic trust problem. If one node runs a program, how do all the others know the answer is real? The usual fixes are to make every node redo the work, which is expensive, or to assume the result is right and let people challenge it later, which is slow and never quite watertight. MetaVM takes a different route. **Whoever runs the program produces a short proof alongside the result.** Anyone can verify the proof in a fraction of the time it would take to rerun the program, and the proof gives nothing away about the private inputs.

MetaVM speaks **three machine languages**: RISC-V (a common open instruction set), the Ethereum Virtual Machine, and Solana's BPF. The same proving engine sits underneath all three, so the same system that certifies a Linux server's boot sequence can also certify an Ethereum block or a Solana slot. In practice that means you can prove a regular Linux program ran correctly, prove every transaction in an Ethereum block, or prove a Solana program executed as expected, all with the same tool.

For long-running programs, MetaVM splits the execution into chunks, proves each chunk on its own, and then folds them all together into **a single proof**. The result is one short proof for the whole run, no matter how long it was. Verifying it takes a single check.

**This is the piece that lets Quilibrium read other chains without trusting anyone.** When the QUIL bridge needs to confirm something happened on Ethereum, MetaVM is designed to prove the transactions ran correctly, the balances and storage are real, the validators agreed, and the block is finalized, all bundled into one proof. Execution-layer proofs are working today; consensus and finality layers are being integrated. No oracle network in the middle, no permissioned operators, just math that anyone can check.

The prover and verifier work today across all three machine types, with command-line tools for proving standalone programs, full Linux boots, Ethereum blocks, and Solana slots. Mainnet integration is in progress and arrives with the **Equinox phase**, where MetaVM becomes the foundation for f(x) (Quilibrium's serverless compute platform) and raw MetaVM workloads on Q Console.

**Website:** https://github.com/QuilibriumNetwork/metavm

**Categories:** infrastructure, devtools, open-source

---

*This document is auto-generated from the official Quilibrium ecosystem page at quilibrium.com/ecosystem.*
