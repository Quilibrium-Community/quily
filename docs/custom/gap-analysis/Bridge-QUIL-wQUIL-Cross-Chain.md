---
title: "Quilibrium Bridge — QUIL/wQUIL Cross-Chain Bridging (NOT LIVE)"
source: official_docs_synthesis
date: 2026-08-12
type: technical_reference
topics:
  - Bridge
  - bridge status
  - is the bridge live
  - can I bridge QUIL
  - wQUIL
  - QUIL
  - cross-chain
  - cross-mint
  - Ethereum
  - bridging
  - MPC signer
  - alt-fee basis
---

# Quilibrium Bridge: QUIL/wQUIL Cross-Chain Bridging

> **⚠️ THE BRIDGE IS NOT LIVE (as of 2026-08-12).** Bridging is gated on the QUIL token shard-out completing, and the bridge page at `quilibrium.com/bridge` has not been published yet. It was up previously, was taken down, and is expected back shortly after the v0.25 release.
>
> **Everything in this document describes how the bridge works *when running*. Do not present any of it as something a user can do today.** See [Quilibrium Network Status](../Mainnet-Status-What-Is-Live.md).
>
> Note that plenty of Quilibrium *is* live and unaffected by this: Quorum, the Q Console services (QStorage, QKMS, Identity and Authorization, QQ, QPing), QNS, MegaRPC, Klearu and MetaVM. The bridge being down says nothing about them.

**Classification:** the Bridge is a **protocol-layer capability, not a Q Console managed service.** It does not appear in Q Console. When running it is used at `quilibrium.com/bridge` or directly via the `qclient` CLI. See [Quilibrium Service Classification](../Quilibrium-Service-Classification.md).

**Primitives used:** Ethereum state import via alt-fee basis app shards.

---

## What the Bridge Does

The Quilibrium Bridge is designed to enable bidirectional transfer of tokens between the Quilibrium network and Ethereum. In its current form, it converts native QUIL tokens into wQUIL (wrapped QUIL), an audited ERC-20 token on Ethereum, and vice versa. The wQUIL ERC-20 contract has received a successful independent audit (publicly accessible via IPFS).

The bridge monitors the Ethereum blockchain for mint and burn events. An MPC-based signer built on top of Quilibrium handles the signing operations, eliminating single points of failure and making the bridge trustless rather than relying on a centralized custodian.

## How the Bridge Works Technically

The bridge uses **alt-fee basis app shards** -- a special shard type that is not consensus-bearing but does impart a commitment at the global level. Quilibrium runs an Ethereum execution node, generates output execution state in KZG polynomial commitment format, and pulls that state into an alt-fee basis app shard. This costs only 74 bytes rolled into consensus as part of 19 kilobytes of global proof state.

With this imported state, the bridge can prove anything about Ethereum's network state, enabling bidirectional bridging. Finality follows Ethereum's probabilistic model: after two epochs (~12.8 minutes), transactions are considered truly finalized. Many accept 6-7 block confirmations for lower-value transfers.

## How the Bridge Works: ZKP Stack vs Traditional Cross-Chain

Traditional cross-chain bridges (including those built on LayerZero) rely on **oracle networks** to attest that an event occurred on the source chain. These oracles are trusted parties that sign a message saying "yes, this deposit happened." The trust model is: if enough oracles agree, the bridge believes them.

Quilibrium's bridge uses a fundamentally different approach: **full cryptographic verification via MetaVM**.

| Aspect | Traditional Oracles (LayerZero style) | Quilibrium Bridge (MetaVM + MegaRPC) |
|--------|--------------------------------------|--------------------------------------|
| **Trust model** | Trusted oracle operators | Zero-trust cryptographic proof |
| **How verification works** | Oracle multi-signature attestation | MetaVM proves Ethereum execution, consensus, and finality |
| **What is proved** | "Oracles say this happened" | "Ethereum's state transition is mathematically correct" |
| **Privacy** | Oracle sees the full bridge request | MegaRPC uses ORAM — operator cannot see what is queried |
| **Decentralization** | Permissioned oracle set | Permissionless verification |
| **Consensus cost** | Oracle fees | ~74 bytes rolled into global consensus state |

**The proof stack in detail:**

1. **Execution proof** — MetaVM proves correct EVM execution of the deposit/burn transaction
2. **Data validity** — SLOAD/SSTORE + MPT proofs verify account balances and storage
3. **Consensus proof** — Validator set and attestation signatures prove the block was agreed upon
4. **Finality proof** — ≥2/3 attestations for a finalized checkpoint prevent re-orgs

This means Quilibrium does not trust *anyone* about Ethereum's state. It verifies it mathematically, at a cost of ~74 bytes per imported state update.

## Privacy Advantage of Bridging to Q

When you bridge an asset to Quilibrium, the entry point is public (because Ethereum is public), but where the asset goes on Q -- what address takes possession -- is completely private. Data bridges in encrypted format. The network verifies that the transaction is real and correct but does not know what you actually did.

This means you can give privacy to every single ERC-20 on Ethereum by routing through Q. Coins can come in and come out such that sender and recipient cannot be linked, provided sufficient bridging volume and time have elapsed.

## Bridging Commands via qclient

> **These steps cannot be completed today.** The bridge is not live and the web flow has not been published. This is the procedure for when it returns.

The `cross-mint` command initiates a cross-chain bridging operation:

```bash
qclient cross-mint [payload]
```

The `payload` parameter is the signed data for the operation. Currently, Ethereum is the only supported network.

**Step-by-step bridging process (QUIL to wQUIL):**

1. Navigate to the official bridge page at `https://quilibrium.com/bridge`.
2. Enter your QUIL account address.
3. **Save the displayed coin addresses** -- these are essential for recovery if the bridge operation fails.
4. Select a coin address to bridge.
5. Execute the `qclient cross-mint [payload]` command shown on the bridge page.
6. Copy the qclient response into the bridge page field (do not press Enter).
7. Run a second `cross-mint` command shown on the bridge page to verify account ownership.
8. Copy the second qclient response into the bridge field (do not press Enter).
9. Wait for the "Complete Bridge" button to appear, then click it. Do not refresh the page.
10. Approve the bridging transaction in your Ethereum browser wallet when prompted.
11. Save the transaction ID for reference on Etherscan.

**Prerequisites:**
- Ethereum-compatible browser wallet
- Enough ETH for gas fees (at least $50 worth recommended, though actual costs are usually lower)
- Latest qclient version installed

**Important:** Always note your coin address before attempting to bridge. If the bridge operation fails, your coin may enter a "limbo" state where `qclient token coins` cannot query it. The bridge documentation provides three recovery methods: first-format decoding, second-format decoding, and Etherscan input-data decoding.

## Future Bridge Expansion

The roadmap calls for significantly broader bridging support:

- **Standard ERC-20 tokens** -- any ERC-20 except unusual rebasing tokens
- **ERC-721 collectibles (NFTs)** -- including bridging IPFS data into encrypted Q collectibles
- **Native ETH**
- **Solana SPL tokens**
- **Other EVM-compatible chains**
- **Social media chains** like Farcaster

The long-term vision includes trustless bridging from Solana, trustless bridging for all ERC-20s on Ethereum, and deeper integrations with other networks to improve their privacy properties.

---

*Last updated: 2026-08-12*
