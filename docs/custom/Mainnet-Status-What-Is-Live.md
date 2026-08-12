---
title: "Mainnet Status: What Is and Is Not Live on Quilibrium"
source: Discord announcements and recaps, livestream transcripts, maintainer confirmation
date: 2026-08-12
type: technical_reference
topics:
  - mainnet status
  - is mainnet live
  - is the bridge working
  - is the bridge live
  - bridge status
  - can I bridge QUIL
  - are transactions live
  - can I send QUIL
  - transfer QUIL
  - mining rewards
  - are rewards live
  - when do I get paid
  - shard-out
  - shard out
  - token shards
  - coverage halt
  - can I build an app on Quilibrium
  - deploy an app
  - permissionless
  - what works now
  - what is live
  - current status
  - alt-fee basis
---

# Mainnet Status: What Is and Is Not Live

**Read this before answering any "does X work / is X live / can I do X" question about Quilibrium.**

Most documentation in this knowledge base describes how things are *designed* to work, written in the present tense. That is not the same as those things being available today. Several major capabilities are built, documented in detail, and **still not switched on**, because they are gated behind the QUIL token shard-out, which has not completed.

## The one-sentence version

Mainnet is running, and the Q Console services work, but **the QUIL token itself is still locked**: token transactions, mining rewards, the bridge, and permissionless app deployment are all **not live yet** and all wait on the same thing.

---

## NOT live yet

Every item here is blocked by the same root cause: the token shard-out has not completed, so fee-based transactions on the token shards are not enabled.

| Capability | Status |
|---|---|
| **QUIL token transactions / transfers** | **Not live.** Token shards are locked pending shard-out completion |
| **Mining rewards** | **Not live.** Provers are running and coverage is accruing, but rewards are not being paid out |
| **The Bridge (QUIL ↔ wQUIL)** | **Not live.** See below |
| **Apps from external developers** | **Not live.** Permissionless deployment of third-party apps directly on the network requires the shard-out. Quilibrium's own services run today on an alt-fee basis instead |
| **Full QUIL token utility** | **Not live.** Paying for services in QUIL, and the rest of the token's role, follow the same unlock |

Do not tell a user any of these work. Do not give step-by-step instructions for doing them as though they were available today. If a doc contains such instructions, they describe the intended flow, not a currently working one.

### The Bridge specifically

The bridge is **not live**. As of 2026-08-12:

- `quilibrium.com/bridge` returns **404**.
- The bridge **was** up at an earlier point and was taken down. In the 2026-08-09 community call Cassie noted that when it was previously up, people immediately tried to exploit it, so it is being approached fresh-eyed this time.
- It is expected to return **shortly after the v0.25 release**, roughly a day after, for breathing room. The `.25` update was pushed on 2026-08-11; the bridge had not followed as of 2026-08-12.
- The 2026-06-18 announcement described "preparation work for the bridge", not an operational service.
- Its return date has slipped repeatedly. A bridge opening was referenced as "this weekend" roughly six weeks before 2026-08-04.

The detailed bridge documentation elsewhere in this knowledge base (the MPC signer, the MetaVM proof stack, `qclient cross-mint`, the step-by-step web flow, wQUIL's audited contract) is an accurate description of **how the bridge works when it is running**. None of it means the bridge is running now.

---

## Live and working today

| Capability | Notes |
|---|---|
| **Mainnet itself** | Running. 2.1 released to mainnet 2025-04-14 |
| **Node operation / proving** | Running. The shard-out is in progress and provers are covering shards |
| **Q Console services** | QStorage, QKMS, Identity and Authorization, QQ, QPing are live |
| **QNS** | Live at names.quilibrium.com. Registration is paid through Ethereum-side wallets |
| **Quorum** | The messenger and its mobile app are live |
| **MegaRPC** | Live in production, powering Quorum Mobile's wallet and the QNS backend |
| **Klearu** | Available as an open-source library and a browser demo, not as a network service |

### Why the services work when the token does not

This is the distinction that makes the whole picture coherent, and getting it wrong in either direction produces a wrong answer.

Quilibrium ships **alt-fee-basis app shards**: a shard type that is not consensus-bearing but still commits at the global level. Alt-fee-based transactions are completely valid right now, and that is precisely why Q services could be launched while the shard-out for the QUIL token is still being resolved. The token shards are what block everything else, because everything else relies on fee-based transactions.

So: **services on alt-fee basis = working. Anything that needs the QUIL token to move = not working.**

Do not overcorrect into "nothing on Quilibrium works". QStorage, QKMS, QQ, QPing, QNS and Quorum are genuinely usable today.

---

## The shard-out, briefly

The network has three shard coverage levels:

| Level | Provers | Meaning |
|---|---|---|
| **Halt risk** | fewer than 3 | Network halts, token shards locked |
| **Needs coverage** | 3 to 5 | Network continues, transactions can proceed |
| **Healthy** | 6 or more | Ideal, maximum resilience |

The network activates when all shards are out of halt risk (3 or more provers). It does **not** require every shard to be healthy. Completing the shard-out is what unlocks the token primitives and lets applications be released directly on the network rather than on an alt-fee basis.

---

## How to answer status questions

1. **Never infer "it is live" from the existence of detailed documentation.** The depth of a technical reference says nothing about deployment state. This is the specific mistake that produced a wrong answer about the bridge.
2. **Present tense in a doc is a description of design, not a status claim.** "The bridge converts QUIL into wQUIL" means that is what it does when running.
3. **Anything touching the QUIL token moving is not live.** Transactions, rewards, bridging, paying for services in QUIL.
4. **If asked whether something works, say plainly that it does not yet, and name the gate** (the shard-out), rather than hedging with "it is rolling out in stages".
5. **Point users at Discord announcements for current status**, since dates here go stale.

---

*Last updated: 2026-08-12*
