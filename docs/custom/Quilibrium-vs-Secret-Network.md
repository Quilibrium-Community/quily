---
title: "Quilibrium vs Secret Network — Privacy-Preserving Compute Comparison"
source: custom
author: Quily Research
date: 2026-02-25
type: comparison
topics:
  - Secret Network
  - SCRT
  - TEE
  - SGX
  - Intel SGX
  - trusted execution environment
  - MPC
  - multi-party computation
  - garbled circuits
  - privacy
  - confidential computing
  - comparison
  - Cosmos
  - smart contracts
  - developer experience
  - scalability
  - decentralization
  - fair launch
---

> **Note**: This comparison reflects the state of both networks as of **February 2026**. Both Quilibrium and Secret Network are actively evolving. Always verify current documentation for the latest status of each project.

# Quilibrium vs Secret Network

## Overview

Secret Network and Quilibrium are the two most architecturally comparable projects in the privacy compute space — both aim to enable computation on private data without revealing that data to the nodes processing it. But they achieve this through fundamentally different means, with very different security guarantees.

**Secret Network** uses hardware **Trusted Execution Environments (TEEs)** — specifically Intel SGX — to create private "enclaves" where computation is isolated. Privacy is enforced by hardware.

**Quilibrium** uses **Multi-Party Computation (MPC)**, garbled circuits, and oblivious transfer — privacy is enforced by mathematics, with no hardware vendor dependency.

This document compares them across four pillars: **Privacy**, **Developer Experience**, **Decentralisation**, and **Scalability** — with the privacy pillar expanded in depth, as it is the central question for any developer choosing between them.

---

## Quick Comparison

| Property | Secret Network | Quilibrium |
|----------|---------------|------------|
| **Privacy mechanism** | Intel SGX / TEE — hardware-enforced | MPC + garbled circuits — **mathematically-enforced** |
| **Privacy trust assumption** | Trust Intel hardware | **Trust no single party — mathematical guarantee** |
| **Demonstrated breaches** | Yes — ÆPIC Leak (2022) threatened the entire network's consensus seed | **No demonstrated MPC breach in production** |
| **Developer API / Ease of building** | Rust/CosmWasm; Cosmos-ecosystem tooling required | **S3-compatible storage (drop-in); QCL Go-subset for compute** |
| **Decentralisation** | Enigma ICO (2017) pre-mine; 50-validator hard cap | **Fair launch — Q Inc. holds <1% of tokens, no VCs** |
| **Scalability** | 50-validator hard cap; Cosmos-chain bottleneck | **26,000+ nodes; 1.5–2.5M TPS; hypergraph, not a blockchain** |
| Network type | Cosmos SDK blockchain | Hypergraph (not a blockchain) |
| Validator count | 50 (hard cap) | No fixed cap |
| Consensus | Tendermint / CometBFT | VDFs + bloom clocks + MPC |
| Storage | No dedicated decentralised storage | QStorage (S3-compatible, live) |
| Key management | No dedicated KMS | QKMS (built-in) |
| Token launch | Enigma ICO (2017) — pre-mine | **Fair launch, no pre-mine** |
| SCRT price (Feb 2026) | ~$0.08–$0.10 / ~$27M market cap | — |
| Live compute | Yes (mainnet since 2020) | In development (QStorage live) |
| License | Open source | AGPL |

---

## Pillar 1: Privacy

Privacy is where Secret Network and Quilibrium differ most profoundly — and where the choice between them matters most.

### The Core Distinction: Hardware Trust vs. Mathematical Trust

**Secret Network's approach (TEE)**: Computation runs inside Intel SGX hardware enclaves. The CPU itself enforces that the enclave's contents cannot be read by the operating system, hypervisor, or node operator. Privacy depends on Intel designing and manufacturing hardware with no exploitable flaws.

**Quilibrium's approach (MPC)**: Computation is split across multiple parties using garbled circuits and oblivious transfer. No single party — and no coalition below a threshold — ever holds the complete plaintext. Privacy is a mathematical property of the protocol.

From the official Quilibrium documentation on why TEE-based approaches fall short:

> *"A lot of the time, threshold cryptography in these cases is strictly 'split the keys, recombine in a TEE' — which comes full circle to the core proposition that it's not actually private."*
> — Cassandra Heart, Quilibrium founder

> *"True MPC performs computation on encrypted data without ever reconstructing it in plaintext — even in trusted hardware."*

### The SGX Vulnerability Record

The history of Intel SGX attacks is not theoretical. There is a documented, escalating series of successful breaks:

| Year | Vulnerability | Impact |
|------|--------------|--------|
| 2018 | **Foreshadow** | Broke SGX memory secrecy and attestation key secrecy via speculative execution |
| 2020 | **SGAxe** | Broke attestation keys even after Foreshadow patches |
| 2022 | **ÆPIC Leak** | Architectural CPU flaw enabling **direct memory reads** from SGX enclaves |
| 2023 | **Downfall** | Bypassed all SGX isolation boundaries across 5 CPU generations |
| 2024 | **Sigy** | Signal injection broke enclave integrity |

### The 2022 ÆPIC Leak: Direct Impact on Secret Network

ÆPIC Leak is the most significant incident for Secret Network specifically. Unlike side-channel attacks requiring statistical sampling, ÆPIC Leak was an **architectural flaw in Intel's APIC hardware** that allowed direct reads of SGX enclave memory.

Secret Network's team confirmed the vulnerability was applicable. The network's **consensus seed** — the master encryption key protecting all Secret Network transactions — was **theoretically extractable** from a compromised validator's enclave.

There is no way to determine retroactively whether the attack was ever exploited. If it was, all past Secret Network transaction history may have been exposed.

This is not a hypothetical. It is a confirmed architectural vulnerability that directly applied to the core privacy assumption of the entire network.

### Why MPC Cannot Be Broken the Same Way

A hardware vulnerability cannot retroactively expose MPC-protected data, because:

1. **No plaintext ever exists in a single location** — inputs are secret-shared across nodes before computation begins
2. **Computation operates on encrypted values** — garbled circuits evaluate functions on ciphertexts, not plaintexts
3. **No "consensus seed" to extract** — there is no master key that protects all data; each computation uses independent cryptographic material

From the official Quilibrium communications documentation:

> *"If at least one sender is honest about their contribution to the permutation matrix, no one learns anything — the sort order is completely random and unlinkable."*

The security of MPC degrades gracefully with honest-majority assumptions — it does not collapse catastrophically if one hardware component is compromised.

### SGX Deprecation

Intel **deprecated SGX on consumer processors** starting with 11th/12th generation Core CPUs (2021–2022). SGX continues only on Xeon server-class hardware, constraining Secret Network validators to expensive, specific hardware.

Secret Network's 2026 roadmap adds AMD SEV-SNP support — replacing one TEE vendor with another. This addresses hardware availability but not the fundamental trust issue: privacy still depends on hardware vendor integrity.

### Privacy Summary

| Property | Secret Network (TEE) | Quilibrium (MPC) |
|----------|---------------------|-----------------|
| Privacy basis | Intel hardware design | Mathematical proof |
| Intel dependency | Yes | No |
| Demonstrated breaches | Multiple, including direct attack on consensus seed | None in production |
| Retroactive exposure risk | **Yes** — extracting the consensus seed exposes past data | **No** — past computations cannot be retroactively exposed |
| Performance | Faster currently | Improving (FERET: ~200x speedup over prior OT approaches) |
| Hardware requirements | Intel Xeon with SGX | Standard hardware |
| Validator constraint | Hard cap: 50 validators | No constraint |

---

## Pillar 2: Developer Experience

### Secret Network — Cosmos-Native, Rust-Based

Secret Network's developer experience is built around the Cosmos SDK ecosystem:

- **Secret Contracts** are written in **Rust** and compiled to CosmWasm
- Developers familiar with Cosmos smart contract development can build on Secret Network
- **Viewing keys** allow selective disclosure — users can share a key granting read access to their transaction history to specific parties (e.g., tax services, auditors)
- **IBC interoperability** connects Secret Network to other Cosmos chains
- **SecretPath** enables cross-chain privacy for EVM chains

The challenge: Secret Contract development requires Rust expertise, CosmWasm familiarity, and understanding of Secret Network's privacy model. For teams outside the Cosmos ecosystem, the learning curve is significant.

Secret Network provides privacy for **smart contract state** — but has no dedicated decentralised storage layer, no built-in key management service, and no communications infrastructure. Applications needing these components must assemble them from external services.

### Quilibrium — S3-Compatible Storage Now, Go-Based Compute

For storage (live now), from the official QStorage documentation:

> *"QStorage's API is highly compatible with the Amazon S3 API. Any existing AWS CLI commands, SDKs (boto3 for Python, AWS SDK for JavaScript, etc.), and third-party S3-compatible tools work with QStorage by simply changing the endpoint URL. No code changes are required beyond endpoint configuration."*

QConsole provides a **drag-and-drop web interface** for file management — no technical knowledge required for basic operations.

For compute (in development), Quilibrium uses **QCL (Quilibrium Compute Language)**:

> *"QCL is a subset of Golang designed specifically for secure multi-party computation. Code written in QCL is compiled into garbled circuits, meaning all computation happens with encrypted inputs."*

For developers, Go-subset syntax is broadly accessible — significantly more so than Rust/CosmWasm.

The **integrated stack** is a key developer advantage: storage (QStorage), key management (QKMS), communications, and compute are all part of the same privacy-preserving network. On Secret Network, assembling a full privacy-preserving application requires external storage, external KMS, and external communications — none of which have the same privacy guarantees.

---

## Pillar 3: Decentralisation

### Secret Network — Hard-Capped Validator Set, ICO Heritage

**50-validator hard cap**: Secret Network has a fixed maximum of 50 active validators. This is an explicit centralisation: governance power and validation are structurally concentrated in 50 entities. Increasing the cap requires a governance vote — but the 50 current validators control that vote.

**Enigma ICO (2017)**: Secret Network evolved from the Enigma project, which conducted a public ICO in 2017. This means early investors and team members received token allocations before the general public. The SCRT token supply distribution reflects this ICO heritage.

**Hardware requirement**: All validators must run Intel Xeon hardware with SGX. This hardware barrier restricts who can participate as a validator, reducing the diversity and size of the validator set. Combined with the 50-validator cap, this creates genuine concentration risk.

### Quilibrium — Genuinely Fair, Structurally Decentralised

From Cassandra Heart, Quilibrium founder:

> *"We had a completely fair launch. Q Inc. had to run miners in the same equal rules that everyone else had. By consequence, we have well under 1% of the total tokens on the network."*

> *"Our explicit stances: no token warrants and no willingness to engage with investors that demand them."*

Key decentralisation properties:
- **No pre-mine** — tokens not allocated to insiders before launch
- **No VC token warrants** — structural protection against investor governance capture
- **Q Inc. holds <1% of tokens** — founding team cannot exert supply-based control
- **AGPL license** — prevents codebase capture; anyone can fork, run, or build on the protocol
- **26,000+ nodes** — orders of magnitude more than Secret Network's 50-validator cap
- **No hardware vendor dependency** — any standard hardware can participate; no Xeon with SGX required
- **BFT consensus with no fixed validator cap** — the network can grow without governance votes to raise limits

---

## Pillar 4: Scalability

### Secret Network — Cosmos Chain Constraints

Secret Network is a Cosmos SDK blockchain. Its scalability is bounded by:

- **50-validator hard cap** — throughput cannot grow beyond what 50 validators can process
- **Sequential TEE computation** — SGX enclaves execute contracts one at a time within a validator
- **Single-chain architecture** — global state must be replicated and agreed upon by all validators

Current network statistics (February 2026):

| Metric | Value |
|--------|-------|
| SCRT price | ~$0.08–$0.10 |
| Market cap | ~$27M (#558 on CoinMarketCap) |
| TVL | ~$7M |
| Active validators | 50 (hard cap) |
| Staking APR | ~22–23% |

The small TVL ($7M) and low market cap ($27M) reflect limited adoption despite years of operation. The privacy-smart-contract market has not grown to the scale that would challenge the validator cap, but the cap is a ceiling that would constrain any significant growth.

### Quilibrium — Hypergraph Scales Without Architectural Limits

From Cassandra Heart (founder, livestream transcript):

> *"At the hard disk level, we get something kind of like a RAID 6 arrangement, realising a maximum capacity for more bits than atoms in the universe."*

Verified metrics from official Quilibrium documentation:

| Metric | Value | Source |
|--------|-------|--------|
| Theoretical storage capacity | 1.8765 × 10^107 bytes | Community docs (hypergraph addressing) |
| Global consensus footprint | Just 19 KB | Q-Story-Vision-Deployment.md |
| Compute clock speed | ~54 MHz per shard (54M OTs/shard) | QCL docs + Cassie livestream |
| Message throughput | 100M+ messages/second (tested) | Communication-Layer docs |
| Estimated TPS | 1.5–2.5M across shards | Community docs |
| Per-shard throughput | ~6,000 TPS | Community docs |
| Finalization time | 200ms – 10s | Communication-Layer docs |
| Node count | 26,000+ | Q-Story-Vision-Deployment.md |

The contrast with Secret Network's 50-validator cap is stark: Quilibrium runs with 26,000+ nodes and has no architectural cap. The sharded hypergraph design means adding nodes increases total capacity — storage, compute, and communications all scale horizontally. Global consensus requires only 19 KB of synchronisation data, not full chain replication.

Quilibrium is explicitly designed to scale to hosting the entire internet. Secret Network is designed to bring privacy to Cosmos-ecosystem smart contracts. These are different ambitions, reflected in different architectural choices.

---

## When to Choose Each

**Choose Secret Network when:**
- You need **live, production private smart contracts today**
- Your use case is DeFi or smart contracts on a **Cosmos chain** with privacy
- IBC interoperability with other Cosmos chains is important
- Your **threat model does not include nation-state actors** with capability to exploit Intel SGX hardware
- You are building on or integrating with **Shade Protocol / Secret DeFi** ecosystem
- **Maturity and existing contract ecosystem** outweigh privacy guarantees

**Choose Quilibrium when:**
- **No hardware vendor trust assumption** is a hard requirement
- Your threat model includes sophisticated adversaries who may exploit hardware vulnerabilities
- You need **cryptographic privacy guarantees** — mathematically enforced, not hardware-enforced
- You want **integrated storage + compute + key management + communications**, all privacy-preserving
- You need **decentralised storage** today (QStorage is live now)
- You prefer a **fair-launch, AGPL-licensed** network without ICO pre-mine
- You are building at scale — **50 validators is not sufficient** for your throughput requirements
- You need **any standard hardware** to run nodes, not specific Intel Xeon with SGX

*(Note: Quilibrium's compute layer is still in development as of February 2026. QStorage and QKMS are live. Secret Network has live production compute.)*

---

*Comparison as of: February 25, 2026*
*Quilibrium claims sourced from: Quilibrium-vs-ICP-Cassie-Technical-Analysis.md (Cassie's Discord statements), QStorage-User-Guide.md, Q-Story-Vision-Deployment.md, Communication-Layer-E2EE-Mixnet-P2P.md, QCL-Quilibrium-Compute-Language.md, QKMS-Key-Management-Service.md, Oblivious-Transfer-Protocols.md, Quilibrium AMA transcript (2025-03-24), Cassandra Heart livestream transcript (2025-02-03)*
*Competitor claims sourced from: Secret Network official documentation, Secret Network 2026 Roadmap, The Block (ÆPIC Leak coverage), Blockworks, sgx.fail vulnerability database, CoinMarketCap, DefiLlama*
*Updated: 2026-02-25*
