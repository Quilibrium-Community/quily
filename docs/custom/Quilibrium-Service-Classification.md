---
title: "Quilibrium Service Classification — Protocol vs Q Console vs Ecosystem"
source: Community Contribution (Issue #109) + Q Console service registry + Tech Tree + quilibrium.com/ecosystem
date: 2026-08-12
type: technical_reference
topics:
  - Q services
  - Quilibrium services
  - list all Q services
  - what services does Quilibrium offer
  - Q Console services
  - QConsole
  - managed services
  - service classification
  - protocol vs service
  - AWS equivalent
  - QStorage
  - QKMS
  - QQ
  - QPing
  - Quark
  - Hypersnap
  - IAM
  - Identity and Authorization
  - MetaVM
  - Klearu
  - MegaRPC
  - Bridge
  - QNS
---

# Quilibrium Service Classification

> **This document answers "what kind of thing is it", NOT "does it work yet".** The two are independent.
>
> **Shipped and usable today:** Quorum (mobile and desktop), the Q Console services (QStorage, QKMS, Identity and Authorization, QQ, QPing), QNS, MegaRPC, Klearu and MetaVM. Quilibrium Inc. has shipped a great deal that does not depend on the token layer.
>
> **Not live yet**, all gated on the QUIL token shard-out: **the Bridge**, token transactions, mining reward payouts, and permissionless app deployment by external developers.
>
> Being listed in this document is not evidence that a thing is running, and is not evidence that it is broken either. For status, see **[Quilibrium Network Status](Mainnet-Status-What-Is-Live.md)**.

**This document is the authoritative reference for which Quilibrium things are Q Console managed services and which are not.** If another document in this knowledge base describes something as a "Q Console service" and this document disagrees, this document is correct.

Quilibrium ships in three distinct layers. Conflating them is the single most common mistake when answering "list all Q services", because Quilibrium Inc. builds at all three layers and the marketing surface often presents them together.

| Layer | What it is | How you access it |
|---|---|---|
| **Protocol** | Capabilities built into the network itself. Not provisioned, not billed per-use, no console page. | Automatically present for anything running on Quilibrium |
| **Q Console managed services** | AWS-style managed services you provision inside a Q Console project and pay for. | console.quilibrium.com, under **Services** |
| **Ecosystem apps and tools** | Standalone applications, SDKs and sites built on Quilibrium. | Their own websites or repos |

---

## Q Console managed services (the definitive list)

These, and only these, appear under **Services** in Q Console.

| Service | Description | AWS equivalent | Status |
|---|---|---|---|
| **QStorage** | S3-compatible object storage | S3 | Active |
| **QKMS** | Key management service, MPC-native | KMS | Active |
| **Identity and Authorization** (IAM) | Identity and access management | IAM | Active |
| **QQ** | SQS-compatible message queuing | SQS | Active |
| **QPing** | SNS-compatible notifications | SNS (partial) | Active |
| **Hypersnap** | Enhanced Farcaster Snapchain node | (none) | Coming soon |
| **Quark** | 3D asset library and SDK | (none) | Coming soon |

**Billing** and **Docs** also appear in the Q Console sidebar, but they are account/resource entries, not services.

**Hypersnap and Quark are listed in Q Console but are not yet activated.** Quark is an SDK by nature (a 3D asset library composing the token primitive, file schemas, QStorage and RDF schema validation), and it is surfaced as a Q Console service entry. Both of these facts are true at once, and neither contradicts the other.

### Announced but not yet in Q Console

| Service | AWS equivalent | Status |
|---|---|---|
| **f(x)** ("F of X") | Lambda | In development. Depends on MetaVM mainnet integration, arriving with the Equinox phase |
| **Relational** | RDS / Keyspaces / DynamoDB / Redis | In development |
| **QName** | Route 53 | Tracked as shipped in the Tech Tree. See the QNS note below |
| API Gateway, ElastiCache, and ~200 further entries | various | Planned, mostly under internal codenames |

---

## Protocol layer

These are **not** Q Console services. They are part of the network, and the official ecosystem page describes each as *"a core piece of Quilibrium, built into the network itself"*.

| Component | What it is | Status |
|---|---|---|
| **MetaVM** | Zero-knowledge proof system for VM execution, covering RISC-V, EVM and Solana BPF. The foundation that f(x) and raw compute workloads will be built on. | In development. Prover and verifier work today, mainnet integration arrives with Equinox |
| **Klearu** | End-to-end encrypted ML inference via two-party computation. Open source, runs today as a library and a browser demo. | In development for mainnet. Native network integration planned for a future protocol upgrade |
| **Bridge** | QUIL to wQUIL cross-chain bridging with Ethereum, using an in-network Ethereum execution node plus an MPC signer. | **NOT live.** Gated on the token shard-out completing. It was up previously and was taken down; expected back shortly after the v0.25 release. `quilibrium.com/bridge` currently 404s. See [Mainnet Status](Mainnet-Status-What-Is-Live.md) |
| **Hypersnap** | Decentralized, hyperdimensional Snapchain. | Shipped at the protocol layer; the Q Console managed offering is separate and still coming soon |
| **Dispatch Queue** | Ordered message dispatch between participants. The primitive QPing and QQ are built on. | Shipped |
| **EVM Shard** | EVM-compatible app shard supporting rollup follower mode or raw EVM execution. | In development |
| **Streaming data primitives** | Video and audio streaming primitives for calls. | Planned, arriving with a future protocol upgrade |

Alongside these sit the cryptographic primitives (commitments, KZG, VRF/VDF helpers, signatures, hashing, KDF, AEAD, Ristretto group operations and others), all shipped, and none of them services.

---

## Ecosystem apps and tools

Built on Quilibrium, accessed on their own sites, **not** provisioned through Q Console.

| Project | What it is | Built by |
|---|---|---|
| **Quorum** | The encrypted messenger and its wallet. A consumer product, not a Q Console service. | Quilibrium Inc. |
| **QNS** (Quilibrium Names Service) | One-time-purchase names: `@yourname` on Quorum and the `yourname.q` namespace. Registry, marketplace and auctions at names.quilibrium.com. | Quilibrium Inc. |
| **MegaRPC** | ORAM-based privacy-preserving RPC for Ethereum and Solana. Live in production, powering Quorum Mobile's wallet and QNS's backend. | Quilibrium Inc. |
| **Klearu demo** | Browser demo of private inference. | Quilibrium Inc. |
| Quilscan, ZapMe, Quilibrium Dashboard and others | Community-built tools. | Community |

**On MegaRPC specifically:** it has been described in livestreams as "a managed service being exposed on Q Console", and Q Console access for external teams wanting API keys has been discussed since March 2026. That access has not landed: MegaRPC is not in the Q Console service registry. Treat it as a live Quilibrium-operated service that is **not currently a Q Console managed service**.

**On QNS vs QName:** the Tech Tree tracks a Route 53 equivalent called **QName** under Web Services, marked shipped. The user-facing product is **QNS**, a web app at names.quilibrium.com with its own API and multi-chain wallet payment flow, backed by network-level naming. QNS is **not accessible through Q Console**. When asked, describe QNS as the naming service and its website, and do not list it under Q Console services.

---

## Commonly misclassified: quick reference

| Thing | Is it a Q Console managed service? | What it actually is |
|---|---|---|
| QStorage, QKMS, QQ, QPing, Identity/Authorization | **Yes**, active | Managed services |
| Quark, Hypersnap | **Yes**, listed as coming soon | Quark is an SDK surfaced as a console service; Hypersnap is also a shipped protocol component |
| **MetaVM** | **No** | Protocol layer. Foundation for f(x) |
| **Klearu** | **No** | Protocol layer. Available on the network as a library, not a managed service |
| **Bridge** | **No** | Protocol layer. Used at quilibrium.com/bridge or via `qclient` |
| **MegaRPC** | **No** | Live Quilibrium-operated service, accessed outside Q Console |
| **Streaming data primitives** | **No** | Planned protocol primitives, not a service |
| **QNS** | **No** | Ecosystem app at names.quilibrium.com |
| **Quorum** | **No** | Consumer product |

### The test to apply

Ask: *can you provision it inside a Q Console project and get billed for usage?* If yes, it is a Q Console managed service. If it is simply present because you are on Quilibrium, it is protocol. If it has its own website and sign-up, it is an ecosystem app.

Being built by Quilibrium Inc. does not make something a Q Console service, and neither does being AWS-comparable.

---

## Sources

- **Q Console service registry** — the `serviceRegistry` in the Q Console application, which drives the Services sidebar. This is the ground truth for what is in the console. Snapshot read 2026-08-12 against the Q Console repository at its 2026-06-04 state.
- **[Quilibrium Tech Tree](https://qstorage.quilibrium.com/techtree/index.html)** — separates Protocol, Cryptography, Consumer and Web Services. Synced weekly into `docs/custom/auto/Quilibrium-Tech-Tree.md`.
- **[quilibrium.com/ecosystem](https://quilibrium.com/ecosystem)** — each project carries a "Relation to the network" field distinguishing "Quilibrium Protocol" from "Built on Quilibrium". Synced into `docs/custom/auto/ecosystem/`.
- Community correction, GitHub issue #109.

---

*Last updated: 2026-08-12*
