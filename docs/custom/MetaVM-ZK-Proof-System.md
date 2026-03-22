---
title: "MetaVM — Zero-Knowledge Proof System for VM Execution"
source: MetaVM GitHub repo (QuilibriumNetwork/metavm) + transcripts + dev updates
date: 2026-03-22
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

# MetaVM — Zero-Knowledge Proof System for VM Execution

MetaVM is Quilibrium's modular zero-knowledge proof system for proving correct execution of RISC-V, EVM, and Solana BPF programs. It is **not** a "Metaverse Virtual Machine" — the name refers to a meta-level virtual machine framework that can target multiple instruction set architectures.

**Repository**: [github.com/QuilibriumNetwork/metavm](https://github.com/QuilibriumNetwork/metavm)

---

## What MetaVM Does

MetaVM takes a program execution (RISC-V binary, Ethereum transaction, or Solana BPF program) and produces a cryptographic proof that the execution was carried out correctly. This proof can be verified cheaply without re-executing the program. It uses KZG polynomial commitments and supports both BLS48-581 (Quilibrium's own ceremony) and BLS12-381 (Ethereum KZG ceremony) curves.

### Key Capabilities

- **Prove RISC-V ELF binary execution** — bare-metal programs compiled for rv64imac
- **Prove Linux boot** — full Linux kernel boot with OpenSBI, device emulation (CLINT, PLIC, UART, VirtIO), and initramfs
- **Prove Ethereum transactions and blocks** — replay and prove all transactions in an Ethereum block
- **Prove Solana BPF programs and slots** — execute and prove Solana transactions with BPF program tracing
- **Recursive proof composition** — long executions are split into chunks, each proven independently, then aggregated via binary tree folding into a single proof

---

## Architecture

MetaVM is organized as a Rust workspace with five crates:

| Crate | Purpose |
|-------|---------|
| `core` | Field arithmetic, Shamir secret sharing, Fiat-Shamir transcript |
| `zkp` | Curve-agnostic prover/verifier, KZG commitments, recursive IVC, tree fold |
| `riscv` | RV64IMAC emulator, ELF loader, Linux boot, execution trace, constraints |
| `evm` | EVM executor (revm), U256 limb decomposition, EVM constraints |
| `sbf` | Solana BPF executor (solana-rbpf), SBF constraints |

### Constraint Systems

Each supported VM has a specific constraint system:

| VM | Columns | Constraints | Selectors | Oracle Selectors |
|----|---------|-------------|-----------|------------------|
| RISC-V (RV64IMAC) | 84 (20 data + 64 selectors) | 128 + 1 shifted | 64 | 0 |
| EVM | 61 (20 data + 41 selectors) | 106 + 1 shifted | 41 | 13 |
| SBF | 39 (17 data + 22 selectors) | 47 + 1 shifted | 22 | 1 |

Oracle selectors mark operations verified externally (complex opcodes like KECCAK, storage, calls).

---

## Proof System

### How It Works

1. **Execution trace** — The VM executes the program and records every step as a table of columns (registers, memory, selectors) over a multiplicative subgroup of a prime field.
2. **KZG commitments** — The prover commits to each column polynomial via KZG.
3. **Constraint polynomial** — A combined constraint polynomial is built from selector polynomials and correctness relations for each instruction type, using Fiat-Shamir challenges.
4. **Quotient polynomial** — The constraint polynomial is divided by the vanishing polynomial to produce the quotient, which is committed and opened at a random point via batch KZG proof.
5. **Verification** — The verifier reconstructs the constraint evaluation, checks the quotient relation, and verifies the batch KZG opening with a single pairing check.

### Recursive Proof Composition (Tree Folding)

For long executions (like booting Linux), MetaVM splits execution into fixed-size chunks. Each chunk produces an independent KZG proof. These are aggregated via a binary tree fold that accumulates pairing arguments, producing a single final proof verified by one pairing operation. State hash chains ensure chunk continuity.

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

## Role of FFT/NTT in MetaVM

FFT (Fast Fourier Transform) and its finite-field variant NTT (Number Theoretic Transform) are used internally by MetaVM for efficient polynomial multiplication during proof generation. This is standard in ZK proof systems — FFT/NTT enables O(n log n) polynomial operations rather than O(n^2) naive convolution. Notably, the discrete Fourier transform can be used to calculate KZG commitments faster than the naive approach (computing multi-scalar multiplications directly), because polynomial evaluation in the frequency domain maps naturally to the commitment structure. In MetaVM specifically:

- BLS12-381 proofs use NTT-based polynomial multiplication for larger domains (>= 64 elements)
- The `bls48581-fast` variant uses optimized FFT with precomputed roots of unity for the BLS48-581 curve
- FFT/NTT is an internal implementation detail of the prover, not a user-facing feature

FFT does **not** stand for "Fault-Tolerant Framing" or any other Quilibrium-specific acronym. In this context, it is always the standard Fast Fourier Transform algorithm.

---

## Roadmap Context

MetaVM is positioned as a foundational infrastructure component for Quilibrium's compute layer:

- **Equinox phase** — MetaVM / metavirtualization runtime is planned for the Equinox roadmap phase (after the 2.1/Dusk release)
- **EC2 equivalent** — Described by Cassie as "like EC2 on Amazon but on the network," enabling users to run Linux servers on Quilibrium
- **Prerequisite for f(x)/Lambda** — The f(x) serverless compute platform (Quilibrium's AWS Lambda equivalent) depends on MetaVM
- **RPC runner** — Being used as a MetaVM runner for Ethereum and other chains, removing dependency on external RPCs like QuickNode
- **QConsole integration** — "Raw MetaVM support" announced as a fast-follow feature for QConsole (March 2026)
- **Dynamic fee model** — Execution on MetaVM will use Quilibrium's dynamic fee market with a baseline execution fee

---

## Relationship to Other Compute Primitives

| Component | What It Does | Status |
|-----------|-------------|--------|
| **MetaVM** | ZK proofs of VM execution (RISC-V, EVM, Solana BPF) | Repo available, integration in progress |
| **QCL** | Privacy-preserving compute via garbled circuits/MPC | Shipped (mainnet since 2.0) |
| **f(x) / Q Lambda** | Serverless compute platform (like AWS Lambda) | Planned, requires MetaVM |
| **Klearu** | E2EE ML inference runtime (2PC-based) | Open-sourced, mainnet integration planned |

MetaVM handles **verifiable execution** (proving a computation ran correctly), while QCL handles **private execution** (computing on encrypted data). They serve different purposes and are complementary.

---

## Common Misconceptions

- **"MetaVM stands for Metaverse Virtual Machine"** — Incorrect. MetaVM is a meta-level VM framework, not related to any metaverse concept.
- **"MetaVM is Quilibrium's smart contract execution environment"** — Partially correct but misleading. MetaVM proves correct execution of programs; it is not a smart contract platform in the Ethereum sense. QCL serves the privacy-preserving compute role.
- **"FFT in MetaVM refers to Fault-Tolerant Framing"** — Incorrect. FFT refers to the standard Fast Fourier Transform algorithm used for polynomial multiplication in the proof system.
- **"MetaVM supports ZK-native operations optimized for zero-knowledge proofs"** — Not how it works. MetaVM proves execution of standard instruction sets (RISC-V, EVM, SBF). Programs are written normally; the ZK proof is generated after execution.
