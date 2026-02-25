---
title: "Quilibrium vs Arweave — Decentralised Storage Comparison"
source: custom
author: Quily Research
date: 2026-02-25
type: comparison
topics:
  - Arweave
  - AR
  - AO
  - permanent storage
  - blockweave
  - SPoRA
  - permaweb
  - comparison
  - storage
  - privacy
  - MPC
  - immutability
  - GDPR
  - decentralised storage
  - developer experience
  - scalability
  - decentralization
  - fair launch
---

> **Note**: This comparison reflects the state of both networks as of **February 2026**. Both Quilibrium and Arweave are actively evolving. Always verify current documentation for the latest status of each project.

# Quilibrium vs Arweave

## Overview

Arweave and Quilibrium take fundamentally different approaches to decentralised storage, rooted in different philosophies: Arweave is built for **permanent, immutable, public archiving** — pay once, preserved forever. Quilibrium is built for **private, mutable, encrypted storage** — data sovereignty where no one, not even the network, can read your data.

This document compares them across four pillars: **Privacy**, **Developer Experience**, **Decentralisation**, and **Scalability**. Understanding these dimensions helps clarify when each system is the right choice.

---

## Quick Comparison

| Property | Arweave | Quilibrium |
|----------|---------|------------|
| **Privacy** | Public by default — no protocol-level privacy | **Private by default — MPC + garbled circuits at protocol level** |
| **Developer API** | Transaction-based upload; Arweave-specific SDKs required | **S3-compatible — existing AWS SDK code works unchanged** |
| **Ease of building** | Arweave-specific SDKs; no S3 compatibility; no mutability | **Drop-in S3 replacement; familiar tooling; supports update/delete** |
| **Decentralisation** | Pre-mine at genesis (55M AR); Protocol Labs-like team control | **Fair launch — Q Inc. holds <1% of tokens, no VCs** |
| **Scalability** | ~285 TiB stored (Apr 2025); endowment model | **Theoretical capacity: 1.8765 × 10^107 bytes** |
| Data permanence | **Permanent and immutable — cannot delete** | Mutable — can be updated or deleted |
| Storage proofs | SPoRA (miners prove access to random old data) | KZG commitments + Reed-Solomon erasure coding |
| GDPR compatibility | Structurally incompatible with right to erasure | Compatible |
| Consensus | SPoRA (Proof of Random Access) | VDFs + bloom clocks + MPC |
| Compute layer | AO (actor model, mainnet Feb 2025) | Native MPC compute (in development) |
| License | Arweave Public License (proprietary) | AGPL |
| AR price (Feb 2026) | ~$1.85–$2.06 / ~$120M market cap | — |

---

## Pillar 1: Privacy

### Arweave — Public by Default

All data stored on the base Arweave protocol is **public**. The blockweave is an inherently public ledger. Anyone with an Arweave transaction ID can retrieve the data. From the Arweave developer documentation:

> *"Privacy is treated as an application-layer concern; uploads are assumed to be durable and public."*

Application-layer encryption is possible — ArDrive uses AES-256-GCM for private drives — but this means:
- Privacy requires trusting the application's encryption implementation
- Transaction metadata (wallet address, timestamp, data size, tags) is **always permanently public** — even for "private" content
- If encryption keys are lost, data becomes permanently inaccessible with no recovery path
- Immutability means encryption mistakes are also permanent

### Quilibrium — Private by Default

Quilibrium's privacy is enforced at the **protocol level** using MPC (multi-party computation) and garbled circuits. From the official Quilibrium documentation:

> *"Quilibrium Inc. and the underlying network operators have no access to any user metadata. All metadata is encrypted and inaccessible to Quilibrium or network operators. Only data explicitly marked as public is visible to others."*

Critically, **even metadata is private**: the existence of data, its size, and who stored it are encrypted — not just the content. This goes meaningfully beyond Arweave, where even encrypted uploads leave a permanent public trace.

The privacy guarantee is **mathematical**, not policy-based. No single node (or coalition below threshold) can reconstruct stored data, because the underlying MPC protocol ensures plaintext is never reassembled in any single location.

### The GDPR Problem: Immutability vs. the Right to Erasure

Arweave's permanent immutability creates a structural legal conflict:

- **EU GDPR Article 17** gives citizens the right to request deletion of personal data. Arweave cannot comply — deletion is technically impossible. The only workaround is encrypting data and destroying the key, which renders data "practically inaccessible" but not actually deleted.
- **CCPA (California)** has the same deletion right issue.
- **Court-ordered takedowns** are structurally impossible at the protocol level.
- **COPPA (children's data)** cannot be complied with.

Any application handling personal data built on Arweave is potentially non-compliant with major privacy regulations by design. Quilibrium supports deletion and is compatible with these frameworks.

---

## Pillar 2: Developer Experience

### Arweave — Archival Focus, Transaction-Based

Arweave's base protocol processes uploads as individual blockchain transactions — suitable for archival, not for dynamic data workflows. High-volume uploads require **Irys** (formerly Bundlr), which batches transactions and claims ~$0.03/GB and 100K TPS throughput, but adds a dependency on a third-party layer.

Base Arweave pricing (~$0.48/GB) is a one-time permanent fee. This is simple in principle, but:
- One-time fees make it hard to reason about costs for large or growing datasets
- AR token price volatility makes budgeting unpredictable
- Data cannot be deleted or updated — versioning creates accumulating cost

Arweave has no native S3-compatible API. Developers must use Arweave-specific SDKs (`arweave-js`, `@irys/sdk`) or third-party abstraction layers. Porting S3-based applications requires meaningful code changes.

### Quilibrium — S3-Compatible, Drop-In, Drag-and-Drop

From the official QStorage documentation:

> *"QStorage's API is highly compatible with the Amazon S3 API. Any existing AWS CLI commands, SDKs (boto3 for Python, AWS SDK for JavaScript, etc.), and third-party S3-compatible tools work with QStorage by simply changing the endpoint URL. No code changes are required beyond endpoint configuration."*

> *"Because QStorage is S3-compatible, migration is straightforward: update your endpoint configuration, transfer your credentials, and use standard S3 tools to sync data."*

QConsole also provides a **drag-and-drop web interface** for direct file uploads — no CLI or SDK required for basic operations.

The developer proposition: existing S3-based apps gain private, decentralised storage as a configuration change. No new SDK, no deal market, no blockchain-specific tooling needed.

---

## Pillar 3: Decentralisation

### Arweave — Structural Centralisation Risks

**Pre-mine**: At genesis (June 2018), 55 million of the 66 million AR maximum supply was minted immediately. The team's allocation details are not fully publicly disclosed.

**Gateway centralisation**: For years, the entire permaweb ecosystem depended on `arweave.net` — a single gateway operated by the Arweave team. This was a severe centralisation risk. AR.IO (decentralised gateway network, mainnet February 2025) directly addresses this, but decentralised gateways are still nascent.

**Mining centralisation**: Arweave's SPoRA consensus (miners who access random historical data earn more) has created **storage pool centralisation**: well-funded operators build fast-access NVMe archives of the entire weave, giving them a systematic advantage that resembles Bitcoin's mining pool problem. Individual miners are progressively squeezed out.

**AR supply**: At ~65.45M of the 66M cap already circulating, the supply is essentially fully diluted. The genesis pre-mine gave early team members and investors a structural advantage that cannot be corrected.

### Quilibrium — Genuinely Fair Launch

From Cassandra Heart, Quilibrium founder:

> *"We had a completely fair launch. Q Inc. had to run miners in the same equal rules that everyone else had. By consequence, we have well under 1% of the total tokens on the network."*

Key decentralisation properties:
- **No pre-mine** — tokens were not allocated to insiders before public launch
- **No VC token warrants** — explicit policy against investor terms that compromise network neutrality
- **Q Inc. holds <1% of tokens** — founding team has no supply advantage
- **AGPL license** — prevents the codebase from being captured by commercial interests; anyone can fork, run, or build on the protocol
- **26,000+ nodes** with Byzantine Fault Tolerant consensus
- **No single gateway chokepoint** by design — the network does not depend on any company's servers remaining online

---

## Pillar 4: Scalability

### Arweave — Proven but Modest at Scale

Arweave has real, meaningful scale for its niche: ~285 TiB of data stored (April 2025), ~3,000 nodes across 92 countries. The endowment model provides a credible economic guarantee of permanence over long time horizons.

However, 285 TiB is modest by cloud standards. Amazon S3 stores exabytes (1 exabyte = ~1 million TiB). Arweave's strength is permanence and censorship resistance, not raw capacity. AO compute (mainnet February 2025) adds an actor-model compute layer with ~$578M TVL, but AO's state is permanently stored on the public Arweave weave — with no privacy guarantees.

The blockweave architecture is blockchain-derived: each block references a random historical block. This imposes blockchain-style throughput constraints that are absent from Quilibrium's hypergraph design.

### Quilibrium — Built to Host the Internet

From Cassandra Heart (founder, livestream transcript):

> *"At the hard disk level, we get something kind of like a RAID 6 arrangement, realising a maximum capacity for more bits than atoms in the universe."*

Specific verified metrics:

| Metric | Value | Source |
|--------|-------|--------|
| Theoretical storage capacity | 1.8765 × 10^107 bytes | Community docs (hypergraph addressing) |
| Global consensus footprint | Just 19 KB | Q-Story-Vision-Deployment.md |
| Compute clock speed | ~54 MHz per shard (54M OTs/shard) | QCL docs + Cassie livestream |
| Message throughput | 100M+ messages/second (tested) | Communication-Layer docs |
| Estimated transaction throughput | 1.5–2.5M TPS across shards | Community docs |
| Finalization time | 200ms – 10s | Communication-Layer docs |

The architectural key: instead of every node replicating a single global ledger, Quilibrium's sharded hypergraph distributes both storage and computation. Adding more nodes expands total capacity. Global consensus requires only a **19 KB commitment** — compared to Arweave's entire historical weave that miners must store to compete.

Storage uses **Reed-Solomon erasure coding** across the distributed node set, with **KZG polynomial commitments** generating compact 74-byte proofs that data is intact and retrievable. This is verifiable, efficient, and designed to scale horizontally without architectural limits.

The storage addressing space — the theoretical maximum — exceeds the number of atoms in the observable universe. This is not a claim about current stored data, but about the addressing capacity of the hypergraph design. Quilibrium is built to grow to internet-scale, not to a ceiling imposed by a single-chain architecture.

---

## How Arweave Works (Technical Background)

### The Blockweave

Arweave's blockweave links each block not only to the previous block but also to a randomly selected older block (the "recall block"). This forces miners to hold historical data to produce valid blocks. Unlike blockchains that store only transaction data, Arweave stores arbitrary file content on-chain permanently.

### SPoRA Consensus

SPoRA (Succinct Proof of Random Access) ties mining profitability to the speed of accessing random historical data. Miners with fast NVMe storage arrays earn more — creating storage pool centralisation as a structural by-product.

### Storage Endowment Model

A single one-time payment covers storage costs:
- Part goes immediately to miners
- The remainder enters a network endowment that grows as storage costs decline (~30%/year historically)
- The model assumes only 0.5%/year cost decline — very conservative — to ensure long-term sustainability

Current pricing: ~$0.48/GB direct; ~$0.03/GB via Irys.

### AO Compute (Mainnet February 2025)

AO is an actor-model compute layer on Arweave. All state is permanently stored on the public weave. AO processes are parallel, isolated, and can self-schedule. TVL reached ~$578M. However, all computation and state is transparent — AO does not provide privacy-preserving computation.

---

## Arweave Network Status (February 2026)

| Metric | Value |
|--------|-------|
| Total data stored | ~285 TiB (April 2025) |
| Mining nodes | ~3,000 |
| AR token price | ~$1.85–$2.06 |
| AR market cap | ~$120–122M |
| AR all-time high | $90.64 (November 2021) |
| AR circulating supply | ~65.45M (~99.2% of 66M cap) |
| AO TVL | ~$578M |

---

## When to Choose Each

**Choose Arweave when:**
- Data is **inherently public** and you want it permanently and irrevocably accessible
- You need **guaranteed permanence** — the data must exist 100 years from now with no maintenance
- You are archiving **NFT metadata, blockchain history, journalism, or public records**
- **Immutability is a feature** — audit trails, historical evidence, public documentation
- **GDPR and data deletion** are not requirements
- You are building autonomous AI agents on AO's compute layer
- The one-time payment model suits your economics

**Choose Quilibrium when:**
- Data is **private, sensitive, or regulated** (personal data, health records, financial data, business secrets)
- You need **data mutability** — files need to be updated or deleted
- **GDPR, CCPA, or other data-protection compliance** is required
- You want **privacy-preserving computation** alongside storage
- You need an **S3-compatible drop-in** with no Arweave-specific SDK
- **Fair launch / no pre-mine / AGPL** matters to your trust model
- You want **internet-scale** storage capacity with no architectural ceiling

### These Systems Are Complementary

Arweave and Quilibrium serve different philosophies and largely different use cases. A sophisticated application could use **both**: Arweave for public-facing permanent records (NFT assets, audit trails, public documents) and Quilibrium for private user data and sensitive computation.

---

*Comparison as of: February 25, 2026*
*Quilibrium claims sourced from: QStorage-User-Guide.md, Q-Story-Vision-Deployment.md, Communication-Layer-E2EE-Mixnet-P2P.md, Block-Storage-VDFs-Bloom-Clocks.md, QCL-Quilibrium-Compute-Language.md, Quilibrium AMA transcript (2025-03-24), Cassandra Heart livestream transcript (2025-02-03), official Quilibrium API docs*
*Competitor claims sourced from: Arweave White Paper v2.1.0, Arweave Yellow Paper, AO mainnet launch (BusinessWire), AR.IO mainnet launch (GlobeNewswire), ViewBlock explorer, CoinGecko, CoinMarketCap, Arweave developer documentation*
*Updated: 2026-02-25*
