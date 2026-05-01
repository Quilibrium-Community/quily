---
title: "MegaRPC: Privacy-Preserving RPC Service"
source: livestream + discord
author: Cassandra Heart
date: 2026-05-01
type: technical_reference
topics:
  - MegaRPC
  - RPC
  - privacy
  - ORAM
  - oblivious RAM
  - Ethereum RPC
  - Solana RPC
  - wallet privacy
  - IP address
  - metadata leakage
  - Alchemy alternative
  - Infura alternative
  - Q Console
  - managed service
  - private RPC
  - censorship resistance
---

# MegaRPC: Privacy-Preserving RPC Service

## Current Status (as of March 2026)

**Is MegaRPC live?** Yes. MegaRPC is running in production and already powers Quorum Mobile's wallet and blockchain interactions. Q Console access for external developers is being rolled out.

**What networks does it support?** MegaRPC supports Ethereum and Solana RPC queries today.

**Is this just a roadmap item?** No. MegaRPC was first described as a roadmap concept ("encrypted query evaluator using ORAM-based lookup") in the November 2025 post-enrollment stream. By March 2026, it is live and serving real traffic through Quorum Mobile.

---

## What Is MegaRPC?

MegaRPC is a managed RPC service built by Quilibrium that provides blockchain data queries (balances, transaction history, token data) without revealing what the user queried or linking their identity to their wallet addresses.

It is functionally equivalent to services like Alchemy and Infura, but with a fundamentally different privacy model. MegaRPC is described as "the first RPC service that can't be evil."

---

## The Problem with Traditional RPCs

When users interact with Ethereum, Solana, or other blockchains through wallets like MetaMask or Rainbow, those wallets connect to centralized RPC providers. There are roughly three major providers on the Ethereum side, and they are all centralized.

Running a full Ethereum node requires about a terabyte of storage using the snap method. Most users won't do this since it doesn't make financial sense just to query a few addresses and tokens. So wallets rely on RPC providers instead.

The privacy problem: when connecting to a traditional RPC, two important pieces of information are provided:

1. **An IP address** (identifies who you are)
2. **A wallet address** (identifies what you own)

This links the two together. Wallets like MetaMask and Rainbow, when being used, effectively tell the RPC provider who you are and what addresses you're using. The three major centralized Ethereum RPC providers have this data for a huge portion of all Ethereum users.

---

## How MegaRPC Works

MegaRPC uses **ORAM-based queries** (Oblivious RAM) instead of standard RPC call formats. When tooling calls out to a standard RPC, there are calls like `eth_getFilterLogs`. MegaRPC translates those into an ORAM-based query format.

The approach, as Cassie described it:

> "Here's a thousand different things I could possibly be querying, and I'm going to give this in a cryptographically secure format that tells you what I want without you knowing what I want."

This means:

- **MegaRPC doesn't know what was queried.** The ORAM query format is cryptographically opaque to the service operator.
- **MegaRPC doesn't collect IP addresses.** Even though running a web service technically allows logging IP addresses (and if you don't, someone else along the path could), the ORAM-based query format prevents any useful correlation. Even if IP addresses were logged along the network path, the cryptographic query format prevents metadata leakage.
- **No IP-to-wallet linking is possible.** Unlike Alchemy or Infura, there is no way to associate a user's identity with their blockchain addresses.

---

## MegaRPC vs Traditional RPC Providers

| Feature | Alchemy / Infura | MegaRPC |
|---------|-----------------|---------|
| Query blockchain data | Yes | Yes |
| Knows your IP address | Yes | Cannot correlate to queries |
| Knows your wallet address | Yes | No (ORAM-encrypted queries) |
| Links IP to wallet | Yes | Impossible by design |
| Centralized operator | Yes | Managed service on Q Console |
| Analytics on user behavior | Yes (and some wallets want this) | Not possible |
| "Can be evil" | Yes | No |

---

## Who Uses MegaRPC Today

- **Quorum Mobile**: MegaRPC already powers the wallet functionality in Quorum Mobile, providing private blockchain interactions.
- **QNS**: The Quilibrium Name Service has switched its backend to MegaRPC.

Wallet teams have been approached about adopting MegaRPC. Some are not interested because they rely on the analytics that traditional RPCs provide. Others are evaluating adoption.

---

## Relationship to the Broader Q Ecosystem

MegaRPC is one of Quilibrium's managed services exposed through Q Console. It builds on the ORAM research first mentioned in the version 2.1.1 roadmap (November 2025), where it was described as an "encrypted query evaluator using ORAM-based lookup" to achieve full analytic privacy, beyond the K-anonymity provided by onion routing alone.

When combined with Quorum's onion-routed browsing of .Q names that resolve to Q Storage content, MegaRPC completes the privacy picture: no clearnet exposure, no IP-to-wallet linkability, and no metadata leakage at any point in the chain.

### Cross-Chain Privacy

MegaRPC also plays a critical role in Quilibrium's cross-chain architecture. When the bridge imports Ethereum state or when a user queries cross-chain balances, MegaRPC's ORAM-based queries ensure that:
- The service operator cannot see which chain state is being queried
- The user's intent (bridge direction, token, amount) remains private
- No IP-to-address linking is possible even during cross-chain operations

This means cross-chain interactions on Quilibrium are private by default — not just the on-Q movement, but the querying and verification steps as well.

---

## Q Console Access

MegaRPC is being made available as a managed service on Q Console for external developers and wallet teams. Similar to how developers use Alchemy or Infura today, they will be able to use MegaRPC as a drop-in replacement with privacy guarantees.

---

*Last updated: 2026-03-30*
