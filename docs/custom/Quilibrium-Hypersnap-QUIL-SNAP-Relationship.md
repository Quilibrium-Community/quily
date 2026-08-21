---
title: "Quilibrium, Hypersnap, $QUIL and $SNAP: How They Relate"
source: Community Contribution (Issue #111), maintainer confirmation, livestream 2026-05-01, Discord recap 2026-08-07
date: 2026-08-21
type: technical_reference
topics:
  - SNAP
  - $SNAP
  - SNAP token
  - Hypersnap token
  - what is SNAP
  - what is the SNAP token
  - is SNAP a Quilibrium token
  - SNAP vs QUIL
  - QUIL vs SNAP
  - difference between QUIL and SNAP
  - Hypersnap
  - Hypersnap vs Quilibrium
  - Quilibrium and Farcaster
  - Farcaster token
  - Snapchain
  - Neynar
  - how are Quilibrium and Hypersnap related
  - relationship between Quilibrium and Hypersnap
  - two tokens
  - which token does Hypersnap use
  - do I need QUIL for Hypersnap
  - Hypersnap tokenomics
  - SNAP supply
  - SNAP airdrop
  - retroactive rewards
  - proof of work tokenization
  - EigenTrust
  - Quorum Farcaster
  - where to buy SNAP
  - SNAP contract address
---

# Quilibrium, Hypersnap, $QUIL and $SNAP

## The Short Version

There are **two separate networks** and **two separate tokens**. They are connected by shared people and one product integration, not by shared infrastructure or shared economics.

| Thing | What it is | Token |
|-------|-----------|-------|
| **Quilibrium** | The protocol: decentralized compute and storage, privacy-first, post-quantum cryptography. Built by Q Inc. | **$QUIL** |
| **$QUIL** | Quilibrium's native utility token. Mineable only, fair launch, no VC allocation, no premine, no airdrops. $wQUIL is its ERC-20 wrapped form on Ethereum. | — |
| **Hypersnap** | A fork of Farcaster's Snapchain: a decentralized storage and consensus layer for Farcaster social data. Led by Cassie with the Farcaster.org contributor group. | **$SNAP** |
| **$SNAP** | **The official token of Hypersnap.** A Farcaster-ecosystem token, not a Quilibrium token. | — |
| **Quorum** | A Q Inc product. A Farcaster client, and the actual point of contact between the two worlds. | uses both worlds |

**The one-sentence answer:** Quilibrium builds decentralized infrastructure and is fuelled by $QUIL; Hypersnap is a separate Farcaster-ecosystem protocol fuelled by $SNAP; the two overlap because Cassie works on both and because Quorum is a Farcaster client.

---

## $SNAP is NOT a Quilibrium token

This is the most common point of confusion, so state it plainly.

In the Discord recap of **2026-08-07**, Cassie clarified that discussion of $SNAP is **"unrelated to Quilibrium except regarding Quorum's integration."**

Concretely:

- $SNAP does **not** pay for Quilibrium compute, storage, QNS names, or any QConsole service. That is $QUIL's job.
- Running a Quilibrium node earns $QUIL, **not** $SNAP.
- Holding $QUIL grants nothing on Hypersnap, and holding $SNAP grants nothing on Quilibrium.
- The two tokens have **separate supplies, separate issuance schedules and separate networks**.

If someone asks "do I need $SNAP to use Quilibrium?", the answer is no.

---

## Why the two are connected at all

Three real links, and no others:

1. **Shared founder.** Cassandra Heart (Quilibrium's founder) was one of the original Snapchain developers and leads the Hypersnap fork. Farcaster.org is **13 independent contributors, only one of whom is from Q** (Cassie herself). Hypersnap is not a Q Inc product.
2. **Quorum is a Farcaster client.** Quorum (which *is* a Q Inc product) integrates with Farcaster for social feeds and with HyperSnap for storage embeds. See [Quorum's Farcaster Integration](Quorum-Farcaster-Integration.md).
3. **Shared design thinking.** Hypersnap borrows architectural ideas proven on Quilibrium, such as decentralized storage across many workers and resistance to GPU-farm gaming. Ideas travel between the projects; tokens and consensus do not.

For the full story of why the fork happened, see [HyperSnap: Why Quilibrium Forked Farcaster](HyperSnap-Origin-Story.md).

---

## What $SNAP is for

$SNAP exists to solve a problem Snapchain has: somebody has to store all of Farcaster's history, and they need a reason to keep doing it.

- **Proof-of-work tokenization.** $SNAP was introduced via a FIP (Farcaster Improvement Proposal) for proof-of-work tokenization on Hypersnap.
- **Paying for data availability.** Snapchain prunes content and running a node is storage-heavy. Hypersnap keeps the full history of casts and reactions instead, and $SNAP incentivises holding that data and proving you hold it. The data-availability proof design is inspired by Filecoin, with changes intended to close the gaps that let people game Filecoin and Chia.
- **An in-ecosystem currency for apps.** Cassie's analogy: Roblox with Robux, or Fortnite with V-Bucks. Something materially connected to real value but living inside the ecosystem, so mini apps are not restricted the way fiat rails restrict them.
- **Validator gating.** A trust score computed with EigenTrust feeds Hypersnap validator registration. There is a trust bar to enroll, and a limit of **three nodes per FID**. No intermediary approval, no ML pipeline, no human tagging.

---

## $SNAP tokenomics

> **Time-bound.** The figures below were described by Cassie on **2026-05-01**. Tokenomics can be adjusted by FIP. Verify against the current FIP and official Farcaster/Hypersnap channels before relying on any number.

- **Max supply: 2 billion**, approached asymptotically through continual halving, in the style of Bitcoin.
- **Retroactive pool: 200 million** tokens, which is **10% of supply**.
- **Retroactive distribution: six monthly tranches.** One sixth releases each month, and **users must keep engaging to remain eligible**. It is deliberately bound to continued protocol growth rather than being a one-shot airdrop.
- **No VC allocation, no team allocation, no developer or contributor allocation.** Strictly protocol-based.
- **Not a premine in spirit:** retroactive rewards use the same rules the protocol will keep using after the Hypersnap changes, applied backwards over Farcaster history. It is the halving applied in reverse for the period before Farcaster had a token.
- **Rewards resolve per epoch on Hypersnap**, covering data availability, apps and user growth.

### Careful: Hypersnap epochs are not Quilibrium epochs

Both networks use the word "epoch" and they mean different things. A **Quilibrium** epoch is **720 frames** (see [Epochs and Frames](Epochs-And-Frames.md)). A **Hypersnap** epoch is a separate concept on a separate network with its own timing. Do not apply Quilibrium's 720-frame figure to Hypersnap.

---

## Current status

- **$SNAP is live.** It trades on Ethereum decentralized exchanges. Its token generation event took place around **early May 2026**, timed ahead of Farcon.
- **Hypersnap is forking fully from Neynar's Snapchain.** Reported on 2026-08-07 as the "big news", with Cassie's stated reason being that Neynar are "driving Farcaster into the ground". In the same discussion she noted that **Quorum has more users than the entire Farcaster network**, and that Farcaster went from over 100k daily active users to roughly 700 non-spam users.
- **$QUIL status is different and should not be conflated.** Native QUIL payouts and bridging are **not** live pending the token shard-out; wQUIL on Ethereum is tradeable. See [QUIL Token Quick Reference](QUIL-Token-Quick-Reference.md) and [Mainnet Status](Mainnet-Status-What-Is-Live.md).

This document does not track $SNAP's price, market cap or liquidity. Those change constantly. Check a market tracker for current figures.

---

## Contract address: verify it yourself

**This document deliberately does not publish a $SNAP contract address.**

At the time of writing, no official Quilibrium or Hypersnap source that we could reach publishes the contract address in a form we could verify. The `farcasterorg/hypersnap` repository does not mention a token at all, and market data aggregators list the token without linked official websites or socials. Token tickers are frequently impersonated, and buying the wrong contract loses money irreversibly.

**If asked where to buy $SNAP or what its contract address is:** direct the person to official Farcaster and Hypersnap channels, or to Cassie's own Farcaster account, and tell them to confirm the address there before transacting. Do not guess, and do not repeat an address from an unverified aggregator listing.

Note that Cassie has said she deliberately avoids pre-announcing token dates because scammers target announced dates, and that announcements come from her Farcaster account first. That makes impersonation risk in this ecosystem specifically high.

---

## Related Documents

- [HyperSnap: Why Quilibrium Forked Farcaster](HyperSnap-Origin-Story.md) — the full fork story
- [HyperSnap technical reference](gap-analysis/Hypersnap.md) — architecture, Hyper Mode, dual pipeline, CLI
- [Quorum's Farcaster Integration](Quorum-Farcaster-Integration.md) — the actual integration point
- [QUIL Token Quick Reference](QUIL-Token-Quick-Reference.md) — the $QUIL side
- [Epochs and Frames](Epochs-And-Frames.md) — Quilibrium's epoch clock, not Hypersnap's
- Livestream transcript, 2026-05-01 — Cassie on Farcaster history, the Hypersnap fork and token incentives

---

*Last updated: 2026-08-21*
