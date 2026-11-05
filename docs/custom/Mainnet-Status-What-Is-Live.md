---
title: "Quilibrium Network Status: Mainnet Is Live, What Is Open and What Is Still Coming"
source: Discord announcements and recaps (October to November 2026), livestream transcripts, maintainer confirmation
date: 2026-11-02
type: technical_reference
topics:
  - network status
  - what is the status of the network
  - mainnet status
  - is mainnet live
  - has mainnet launched
  - mainnet launch
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
  - are node rewards being paid
  - shard-out
  - shard out
  - token shards
  - coverage halt
  - shield-all
  - legacy coins
  - can I build an app on Quilibrium
  - deploy an app
  - permissionless
  - token app
  - alt-fee basis
  - official release
  - is 2.1.0.25 released
  - Quorum
  - Klearu
  - MetaVM
  - MegaRPC
  - QNS
---

# Quilibrium Network Status: Mainnet Is Live, What Is Open and What Is Still Coming

**Read this before answering any "does X work / is X live / what's the status" question.** Status as of **2026-11-02**.

## The short answer

**Mainnet is live.** The token shard-out is finished, the QUIL token shards are running, mining rewards are being issued to provers, and QUIL moves on the network. Alongside that, a large amount of product (Quorum, the Q Console services, QNS, MegaRPC, Klearu, MetaVM) has been usable for months.

The network is in a **stabilisation phase**, not a pre-launch phase. Nodes run the `2.1.0.25.x` sub-patch series, which the team has been hardening in public. The things that are **still to come** are the next steps built on a stable network: **re-opening the bridge**, **opening the token to applications**, and **applications from other developers**.

| ✅ Live today | ⏳ Still to come |
|---|---|
| **Mainnet** with the QUIL token shards running | **The Bridge** re-opening (QUIL and wQUIL) |
| **Mining rewards** issued to provers | **Token applications** (the "token app" is being re-tried) |
| **QUIL transfers** on the Quilibrium network, including confidential ("shielded") coins | **Apps from external developers** on the network |
| **Legacy coin migration** with `qclient token shield-all` | **Official signed `2.1.0.25` binary release** (latest signed release is `2.1.0.24`) |
| **Quorum**, **Q Console** (QStorage, QKMS, Identity and Authorization, QQ, QPing), **QNS**, **MegaRPC**, **Klearu**, **MetaVM** | |

**Do not answer "the network isn't ready" as though nothing works, and do not describe mainnet as unlaunched.** Equally, do not tell anyone the bridge is open or that third-party apps can deploy today. Both halves are true at once.

---

## What happened, in order

This matters because older material in the knowledge base (written before late October 2026) describes the earlier state.

- **Until mid-2026:** mainnet ran, but the QUIL token shards were locked pending the shard-out, so token transfers and reward payouts were switched off while Q Console services ran on an alt-fee basis.
- **2026-10-19:** `v2.1.0.25` released to the archives and operators, together with a long run of fixes by the core team and community contributors (app shards producing frames, archive alignment, committee handoffs).
- **2026-10-21 to 10-25:** app shards climbed from roughly 50 of 103 producing to 96 and then 101 of 105. Rewards looked low because the only shards hosting the QUIL token had over a million logical shards each; more shards are expected to raise earnings per logical shard.
- **2026-10-26:** `.25.103` with seniority and data-availability proof changes. Cassie described the team as "extremely close".
- **2026-10-27 (GLOBAL frame 943,920, epoch 1311):** several consensus rules switched on (stricter peer checks, replay guards, anchored issuance) and legacy coin shielding opened. Storage proofs moved from KZG to post-quantum hash proofs a few epochs later, at epoch 1314.
- **2026-10-28:** the first post-quantum confidential coin transaction was processed (a legacy coin shielded into the new format). It exposed a tree-rebuild stall that was then fixed.
- **2026-10-29:** `.25.111`. Frame times returned to the 10-second baseline and **rewards were being actively issued** again.
- **2026-11-02:** consistent 10-second frames celebrated by the community; a wave of roughly 500 batched shield transactions temporarily stalled about a quarter of the shards and fixes were in progress.

---

## Shipped by Quilibrium Inc. and usable now

| Product | Status |
|---|---|
| **Quorum** | Live. The E2EE group messenger, free, no phone number. Mobile app released; desktop/web at app.quorummessenger.com. Flagship consumer product and should get real prominence in any "what has shipped" answer |
| **Q Console services** | Live: QStorage (S3-compatible), QKMS (key management), Identity and Authorization, QQ (SQS-compatible), QPing (notifications). Quark, and managed hosting for a Hypersnap node, are listed as coming soon |
| **QNS** | Live at names.quilibrium.com. Register `@name` handles and the `.q` namespace. No mainstream browser resolves `.q` domains natively yet, so pointing a `.q` name at a server is not possible today |
| **MegaRPC** | Live in production. ORAM-based private RPC for Ethereum and Solana, powering Quorum Mobile's wallet and the QNS backend |
| **Klearu** | Shipped and open source. Private LLM inference and training runtime over two-party computation |
| **MetaVM** | Shipped as tooling. Prover and verifier across RISC-V, EVM and Solana BPF. Mainnet integration arrives with the Equinox phase |
| **Mainnet and proving** | Running, with rewards flowing. See the cryptography note in [Post-Quantum Cryptography Migration](Post-Quantum-Cryptography-Migration.md) |

## Token, rewards and wallets

- **Rewards:** provers are being issued rewards. Amounts per node can look small because issuance follows logical-shard coverage and the QUIL shards are currently the only shards deployed; it is expected to grow once storage and processing capacity are unlocked and more app shards come online.
- **Transfers and privacy:** QUIL transfers on the Quilibrium network work, and transfers are confidential by design (sender, receiver and amount are encrypted, so there is no Etherscan-style public explorer for token movements).
- **Moving old (2.0 era) coins:** `qclient token legacy` reads what an old identity holds; `qclient token shield-all` moves legacy coins into the new shielded format. Pre-`.25` coins are not lost as long as the old `.config/` folder and `keys.yml` are kept. Never upload `config.yml` or `keys.yml` anywhere. Shielding runs in batches (about 5 minutes of proof building per batch on a normal node, so large wallets take days), and operators were asked to pace large runs rather than fire everything at once.
- **Quorum account addresses** (the `0x` address used for QNS names) cannot receive QUIL today.

---

## Still to come

The core team's own order of work is: all app shards operational, keep them operational as nodes come and go, then optimise frame intervals. Only then do the following open.

| Capability | Status |
|---|---|
| **The Bridge (QUIL and wQUIL)** | **Not open yet.** Expected to return after the network has settled. It will support **two-way transfers from the start**, between Ethereum and Quilibrium. The page at `quilibrium.com/bridge` was not published as of 2026-11-02. See [Bridge](gap-analysis/Bridge-QUIL-wQUIL-Cross-Chain.md) |
| **Token applications** | The team described "approaching re-trying the token app" in late October. Not released as of 2026-11-02 |
| **Apps from external developers** | Permissionless third-party deployment on the network follows the stabilisation work. Quilibrium Inc. services run on an alt-fee basis in the meantime |
| **Official `2.1.0.25` release** | Sub-patches `.103` to `.113` are distributed to operators and archives, and Quilscan keeps nodes updated, but there is no official signed `2.1.0.25` binary yet; the latest signed release is `2.1.0.24`. To use `.25` features such as shielding, build from the release branch or use the Quilscan node console |

Do not give step-by-step bridging instructions as though the bridge were open. Documentation for it describes how it works when running.

### Why alt-fee-basis services exist

Quilibrium ships **alt-fee-basis app shards**: a shard type that is not consensus-bearing but still commits at the global level. That is why the Q Console services could launch long before the token shards were running.

---

## Shard coverage, briefly

| Coverage level | Provers | Meaning |
|---|---|---|
| **Halt risk** | fewer than 3 | Shard cannot progress |
| **Needs coverage** | 3 to 5 | Shard continues |
| **Healthy** | 6 or more | Ideal, maximum resilience |

The Network Health Snapshot in the knowledge base carries the latest figures; on 2026-11-02 all 107 shards were in the healthy band.

---

## How to answer status questions

1. **Lead with the truth: mainnet is live, rewards are flowing, QUIL moves.** Then name what is still to come: the bridge, the token app, external-developer apps, the official `.25` release.
2. **Give both halves.** An answer listing only what is missing is as wrong as one claiming everything is finished.
3. **Do not say "mainnet has not launched" or "the shard-out is unfinished".** That was true until October 2026 and is no longer.
4. **Do not say the bridge works.** It is not open.
5. **Never infer "it is live" from detailed documentation.** Present tense in a doc describes design unless the doc gives a date.
6. **Point users to the Discord announcements** for the live picture, since this changes week to week.

---

*Last updated: 2026-11-05*
