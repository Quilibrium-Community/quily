---
title: "Quilibrium Network Status: What Is Shipped and What Is Gated"
source: Discord announcements and recaps, livestream transcripts, maintainer confirmation
date: 2026-08-12
type: technical_reference
topics:
  - network status
  - what is the status of the network
  - mainnet status
  - is mainnet live
  - state of the network
  - what has Quilibrium shipped
  - what is live
  - what works now
  - what can I use today
  - what is available
  - is the bridge working
  - is the bridge live
  - bridge status
  - can I bridge QUIL
  - are transactions live
  - can I send QUIL
  - transfer QUIL
  - mining rewards
  - are rewards live
  - am I earning
  - shard-out
  - shard out
  - token shards
  - coverage halt
  - can I build an app on Quilibrium
  - deploy an app
  - permissionless
  - alt-fee basis
  - Quorum
  - Klearu
  - MetaVM
  - MegaRPC
  - QNS
---

# Quilibrium Network Status: What Is Shipped and What Is Gated

**Read this before answering any "does X work / is X live / what's the status" question.**

## The short answer

Mainnet is running and **a large amount of product has shipped and is usable today**. What is *not* live is specifically the **QUIL token layer**: the token shard-out has not completed, so anything requiring QUIL to move is switched off. These are two separate questions and conflating them produces a wrong answer in either direction.

| ✅ Shipped and usable today | ❌ Not live yet (all gated on the token shard-out) |
|---|---|
| **Quorum** messenger: mobile app, and desktop/web at app.quorummessenger.com | **QUIL token transactions / transfers** |
| **Q Console services**: QStorage, QKMS, Identity and Authorization, QQ, QPing | **Mining reward payouts** |
| **QNS** names at names.quilibrium.com | **The Bridge** (QUIL ↔ wQUIL) |
| **MegaRPC**, live in production | **Permissionless app deployment** by external developers |
| **Klearu**, open-source private inference | **Full QUIL token utility** (paying for services in QUIL) |
| **MetaVM**, prover and verifier working | |
| **Mainnet itself** and node proving | |

**Do not answer "the network isn't ready" as though nothing works.** Quilibrium Inc. has shipped a great deal that does not depend on the token unlock. Equally, do not tell anyone they can bridge, transfer QUIL, or that they are being paid for proving.

---

## Shipped by Quilibrium Inc. and usable now

These work today. Most of them do not need the token layer at all.

| Product | Status |
|---|---|
| **Quorum** | Live. The E2EE group messenger, free, no phone number. Mobile app released; desktop/web running in production at app.quorummessenger.com (v2.1.0-1 as of 2026-08-05). This is Quilibrium's flagship consumer product and should be given real prominence in any "what has been shipped" answer |
| **Q Console services** | Live: QStorage (S3-compatible), QKMS (key management), Identity and Authorization, QQ (SQS-compatible), QPing (notifications). Quark, and managed hosting for a Hypersnap node, are listed in the console as coming soon |
| **QNS** | Live at names.quilibrium.com. Register `@name` handles and the `.q` namespace, with a marketplace and auctions. Paid through Ethereum-side wallets |
| **MegaRPC** | Live in production. ORAM-based private RPC for Ethereum and Solana, already powering Quorum Mobile's wallet and the QNS backend |
| **Klearu** | Shipped and open source. Private LLM inference over two-party computation, usable as a library with a live browser demo. Native network integration comes with a later protocol upgrade |
| **MetaVM** | Shipped as tooling. Prover and verifier work today across RISC-V, EVM and Solana BPF, with CLI tools for proving programs, Linux boots, Ethereum blocks and Solana slots. Mainnet integration arrives with the Equinox phase |
| **Mainnet and proving** | Running. 2.1 released to mainnet on 2025-04-14. Nodes prove and accrue shard coverage |

### Why these work while the token does not

Quilibrium ships **alt-fee-basis app shards**: a shard type that is not consensus-bearing but still commits at the global level. Alt-fee-based transactions are completely valid right now, and that is exactly why Q services could launch while the shard-out for the QUIL token is unresolved. The token shards block everything else, because everything else relies on fee-based transactions.

**Services on alt-fee basis work. Anything requiring QUIL to move does not.**

---

## Not live yet

**Context before the list:** plenty *has* shipped and is usable today, including Quorum, the Q Console services (QStorage, QKMS, Identity and Authorization, QQ, QPing), QNS, MegaRPC, Klearu and MetaVM. Never present the list below as the whole picture.

Every item here is blocked by the same root cause: the token shard-out has not completed, so fee-based transactions on the token shards are not enabled.

**This list is complete.** Confirmed with the maintainer on 2026-08-12: transactions, mining rewards, the bridge and external app deployment are the only things gated on the shard-out. Nothing else is waiting on it, so do not imply there may be more.

| Capability | Status |
|---|---|
| **QUIL token transactions / transfers** | **Not live.** Token shards locked pending shard-out |
| **Mining rewards** | **Not live.** Provers run and accrue coverage, but payouts are not being distributed |
| **The Bridge (QUIL ↔ wQUIL)** | **Not live.** See below |
| **Apps from external developers** | **Not live.** Permissionless third-party deployment directly on the network needs the shard-out. Quilibrium Inc. own services run on an alt-fee basis instead |
| **Full QUIL token utility** | **Not live.** Paying for services in QUIL and the rest of the token's role follow the same unlock |

Do not give step-by-step instructions for any of these as though they were available. Where docs contain such instructions, they describe the intended flow.

### The Bridge specifically

The bridge is **not live**. As of 2026-08-12:

- The bridge page at `quilibrium.com/bridge` **has not been published yet**, so links to it do not resolve. This is not a site outage: that part of the site simply is not live.
- The bridge **was** up earlier and was taken down. In the 2026-08-09 call Cassie noted that when it was previously up people immediately tried to exploit it, so it is being approached fresh-eyed.
- Expected back **shortly after the v0.25 release**, roughly a day after. `.25` was pushed on 2026-08-11; the bridge had not followed as of 2026-08-12.
- The 2026-06-18 announcement described "preparation work for the bridge".
- The date has slipped repeatedly: an opening was referenced as "this weekend" about six weeks before 2026-08-04.

Detailed bridge documentation elsewhere (MPC signer, MetaVM proof stack, `qclient cross-mint`, the web walkthrough, wQUIL's audited contract) accurately describes **how it works when running**. None of it means it is running now.

---

## The shard-out, briefly

| Coverage level | Provers | Meaning |
|---|---|---|
| **Halt risk** | fewer than 3 | Network halts, token shards locked |
| **Needs coverage** | 3 to 5 | Network continues, transactions can proceed |
| **Healthy** | 6 or more | Ideal, maximum resilience |

The network activates when all shards are out of halt risk (3 or more provers); it does **not** require every shard to be healthy. Completing the shard-out unlocks the token primitives and lets applications be released directly on the network rather than on an alt-fee basis.

---

## How to answer status questions

1. **Give both halves.** A status answer that lists only what is broken is as wrong as one that claims everything works. Lead with what shipped, then name what is gated.
2. **Never infer "it is live" from detailed documentation.** Depth of a technical reference says nothing about deployment state. That mistake produced a wrong answer about the bridge.
3. **Present tense in a doc describes design, not status.**
4. **Anything involving the QUIL token moving is not live**: transactions, rewards, bridging, paying for services in QUIL.
5. **Name the gate** (the token shard-out) rather than hedging with "rolling out in stages".
6. **Point users to Discord announcements** for the live picture, since dates here go stale.

---

*Last updated: 2026-08-12*
