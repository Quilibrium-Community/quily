---
title: "Quorum's Farcaster Integration"
source: livestream (2026-03-30) + discord
author: Cassandra Heart
date: 2026-03-30
type: technical_reference
topics:
  - Quorum
  - Farcaster
  - Farcaster client
  - HyperSnap
  - social media
  - feed
  - direct messages
  - DMs
  - wallet
  - Neynar API
  - Q Storage
  - embeds
  - decentralized social
  - Quorum Farcaster
  - does Quorum support Farcaster
  - Farcaster on Quorum
---

# Quorum's Farcaster Integration

Quorum is a Farcaster client. It integrates with the Farcaster protocol directly for social feeds, and with the Neynar Farcaster API for direct messaging. This document covers what Quorum provides as a Farcaster client and how it connects to the broader Farcaster ecosystem through HyperSnap.

---

## What Quorum Provides as a Farcaster Client

### Farcaster Feed

Quorum's feed feature uses the Farcaster protocol directly. Users can browse and interact with the Farcaster social feed from within Quorum. The feed is accessed through the protocol layer, not through a third-party API.

### Wallet Integration

When plugging in a Farcaster wallet, users get access to their wallet's funds as a secondary address on their Quorum wallet. This means Farcaster users can manage their Farcaster-connected funds alongside their Q wallet.

### Direct Messages

Quorum added support for Farcaster direct messages. These DMs exist only on the Merkle/Neynar Farcaster API -- they are not part of the Farcaster protocol itself. This is an important distinction: while the feed is protocol-native, DMs are API-based through Neynar's infrastructure.

---

## HyperSnap Integration

Quorum connects to Farcaster through HyperSnap, Quilibrium's fork of the Snapchain protocol. HyperSnap runs as an alt-fee basis shard on the Q network.

### Q Storage Embeds on Farcaster

If somebody uses Q Storage to host files (images, media), those files can be embedded directly into Farcaster posts. This is enabled by HyperSnap's integration with the Q network, where proofs of the hosted content are incorporated onto the Q network and made available to Farcaster.

### Privacy Through Onion Routing

When QNS (Quilibrium Name Service) resolves names to Q Storage content and the content is in a public bucket, Quorum's browser uses onion routing to navigate to .Q names. This means traffic is routed through the network so it never passes through clearnet. Nobody can identify what was requested or the size of what was requested. This privacy extends to Farcaster content accessed through Quorum.

---

## Architecture Overview

```
Quorum App
├── Feed ──────────── Farcaster Protocol (via HyperSnap)
├── Direct Messages ── Neynar Farcaster API
├── Wallet ─────────── Farcaster wallet as secondary address
└── Embeds ─────────── Q Storage → HyperSnap shard → Farcaster
```

- **Feed**: Protocol-native, decentralized
- **DMs**: API-based through Neynar (not protocol-native)
- **Wallet**: Farcaster wallet funds accessible as secondary address
- **Embeds**: Q Storage content usable as Farcaster embeds via HyperSnap

---

## Why Farcaster?

Despite dramatically decreasing in daily active users, Farcaster remains one of the most powerful decentralized social media protocols for gaining traction with developers. The community is a very special group: many are early adopters, naturally curious, and exceedingly kind. This developer community quality is why Q invested in building Quorum as a full Farcaster client.

For the full story of why Q forked Farcaster's Snapchain into HyperSnap, see [HyperSnap: Why Quilibrium Forked Farcaster](HyperSnap-Origin-Story.md).

---

*Last updated: 2026-03-30*
