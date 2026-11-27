---
title: "MetaVM — Zero-Knowledge Proof System for VM Execution"
source: MetaVM GitHub repo (QuilibriumNetwork/metavm) + transcripts + dev updates
date: 2026-11-27
type: technical_reference
topics:
  - MetaVM
  - zero-knowledge proofs
  - ZK
  - virtual machine
  - RISC-V
  - EVM
  - Solana
  - BPF
  - SBF
  - KZG
  - polynomial commitments
  - recursive proofs
  - metavirtualization
  - execution
  - compute
  - FFT
  - NTT
---

# MetaVM: Zero-Knowledge Proof System for VM Execution

## Availability and target runtimes

MetaVM is Quilibrium's public Rust library for proving VM execution. The repository contains RV64IMAC RISC-V execution and Linux boot tooling, an Ethereum EVM executor and prover, and Solana BPF (SBF) execution tracing and proof constraints. The November 21, 2026 roadmap reports extensive RISC-V use by the team and a multiparty Doom demo. It targets MetaVM as a Quilibrium mainnet intrinsic in 2.1.1 and identifies it as a prerequisite for the planned FFX serverless service. The demo and public library establish experimentation and implementation. Network execution, FFX and managed Q Console access remain roadmap work. [November roadmap livestream](https://www.youtube.com/watch?v=OppCHV3tsHw)

MetaVM's workspace has five crates. `core` supplies field arithmetic, Shamir secret sharing and transcripts. `zkp` handles proving, verification, KZG commitments and recursive folding. `riscv` includes the emulator, ELF loading, Linux boot and proof constraints. `evm` traces execution through revm and defines EVM proof constraints. `sbf` traces Solana BPF execution through solana-rbpf and defines SBF constraints. [MetaVM source](https://github.com/QuilibriumNetwork/metavm)

## Ethereum execution, inclusion and finality

The public MetaVM master branch ends at the June 8, 2026 EVM prover update. It adds EVM constraint code for operations including storage, calls, gas accounting and precompiles, alongside Ethereum proof components for Merkle Patricia trie paths, beacon data and stake-weighted finality. There are separate code paths for proving block execution and for composing execution, inclusion and finality. The `prove-block` CLI fetches a block from an Ethereum RPC, replays its transactions and produces a folded execution proof. [June EVM prover diff](https://github.com/QuilibriumNetwork/metavm/commit/12d28e2)

The joint finality proof test in MetaVM uses a synthetic witness for one transaction, one execution block, one beacon block header and one Casper FFG finalization. It uses cross-system LogUp arguments to link values between specialized constraint systems. The linked proof of a real Ethereum mainnet transaction through economic finality still requires real execution, trie, beacon and attestation witnesses and full-width bindings in place of the demo's single-column anchors. This test shows how the proof layers fit together. A deployed QUIL/wQUIL bridge using the complete stack remains unverified. [MetaVM finality composition test](https://github.com/QuilibriumNetwork/metavm/blob/12d28e2/crates/zkp/src/integration_finality_proof_master_joint_prove.rs)

## MetaVM Proof System

### How It Works

1. **Execution trace** — The VM executes the program and records every step as a table of columns (registers, memory, selectors) over a multiplicative subgroup of a prime field.
2. **KZG commitments** — The prover commits to each column polynomial via KZG.
3. **Constraint polynomial** — A combined constraint polynomial is built from selector polynomials and correctness relations for each instruction type, using Fiat-Shamir challenges.
4. **Quotient polynomial** — The constraint polynomial is divided by the vanishing polynomial to produce the quotient, which is committed and opened at a random point via batch KZG proof.
5. **Verification** — The verifier reconstructs the constraint evaluation, checks the quotient relation, and verifies the batch KZG opening with a single pairing check.

### Recursive Proof Composition (Tree Folding)

For long executions, MetaVM can split execution traces into fixed-size chunks. Each chunk produces an independent KZG proof. These are aggregated via a binary tree fold that accumulates pairing arguments, producing a single final proof verified by one pairing operation. State hash chains ensure chunk continuity.

### Auxiliary Arguments

- **LogUp range checks** — byte decomposition of witness columns with running sum accumulation
- **Memory permutation** — grand-product argument over (address, value, timestamp, rw) tuples
- **Register file permutation** — multi-port grand product (3 ports for RISC-V, 2 for SBF)

---

## Supported Curves

| Curve | Source | G1 Size | Scalar Size | Max Domain |
|-------|--------|---------|-------------|------------|
| BLS48-581 | Quilibrium ceremony SRS | 74 bytes | 73 bytes | 256 |
| BLS12-381 | Ethereum KZG ceremony | 48 bytes | 32 bytes | 4096 |

BLS12-381 uses NTT-based (Number Theoretic Transform) polynomial multiplication for domains >= 64. BLS48-581 falls back to naive convolution but has a `bls48581-fast` variant with optimized FFT (Fast Fourier Transform) using precomputed roots of unity.

---

The public MetaVM prover still uses KZG over BLS48-581 and BLS12-381. Quilibrium's v2.1.0.25 node cryptography migration concerns separate state, consensus and storage mechanisms. MetaVM's publicly visible KZG proof implementation is therefore distinct from the node's post-quantum storage proofs.

*Last updated: 2026-11-27*
