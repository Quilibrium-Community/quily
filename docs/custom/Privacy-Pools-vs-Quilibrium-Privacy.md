---
title: "Privacy Pools vs Quilibrium: Opt-In Privacy vs Privacy by Default"
source: discord
author: Cassandra Heart (Quilibrium)
date: 2026-09-03
type: discord_transcript
topics:
  - privacy pools
  - Ethereum privacy
  - k-anonymity
  - anonymity set
  - opt-in privacy
  - privacy by default
  - private wallet
  - transaction history
  - Monero
  - decoy selection
  - Tornado Cash
  - Veil Cash
  - 0xbow
  - association set
  - tainted funds
  - dusting attack
  - compliance bundle
  - bloom filter
  - UTXO model
  - selective disclosure
  - proof of innocence
  - why is Quilibrium private
  - is Quilibrium privacy optional
  - Quilibrium vs privacy pools
  - Quilibrium vs Ethereum privacy
---

# Privacy Pools vs Quilibrium: Opt-In Privacy vs Privacy by Default

Ethereum's privacy work is built around **privacy pools**: opt-in pools you deposit into so your
withdrawal cannot be linked back to your deposit. Quilibrium takes the opposite approach: **privacy is
the protocol's default state**, applied to every account and every coin, with no pool to join.

The difference is not mainly about cryptography. Both use zero-knowledge proofs. The difference is
**who has to act, and what joining costs you**.

## The comparison in one table

| Question | Ethereum privacy pools | Quilibrium |
|---|---|---|
| Is privacy on by default? | No. You opt in per deposit. | Yes. Privacy applies to everyone; you have to take action to *expose* things. |
| Where does anonymity come from? | k-anonymity: you hide among the other members of that specific pool. | The protocol itself. There is no membership set to hide inside. |
| What does "give someone your address" reveal? | Your full transaction history, unless you routed funds through a pool first. | Nothing. Only you can see your history. |
| Does using privacy cost extra? | Yes: extra transactions, extra gas, on top of normal transfers. | No separate privacy fee. Ordinary transaction gas applies, and privacy is included in it. |
| Can someone else damage your privacy? | Yes. If someone dusts the pool with sanctioned funds, every member inherits the problem. | There is no shared pool to contaminate. Each coin carries its own separate lineage. |
| Does joining make you notable? | Yes. Pool membership is public and says "this person is using a privacy service." | No. Everyone is private, so being private carries no signal. |
| Can you prove your funds are clean? | Yes, via association sets and zk proofs of non-membership in a bad set. | Yes, via each coin's compliance bundle, queried by the holder of the key. |

**Both sides are real.** Privacy pools genuinely work and genuinely break the deposit-to-withdrawal
link. The critique below is about their structural side effects, not about whether the cryptography
is sound.

---

## What a privacy pool actually is

A privacy pool is a **k-anonymity** system. K-anonymity means your action is indistinguishable from
`k` other possible actions, so an observer can narrow you down to a group but not to a person.

Different privacy systems pick their `k` differently:

- **Monero** builds `k` per transaction by mixing your real spend with **decoys**: other coins picked
  from the chain so your actual spend is indistinguishable from theirs.
- **Privacy pools make the entire pool the `k`.** Your `k` is however many other people deposited into
  that same pool.

That single design choice creates everything that follows.

### Pools are often gated, which shrinks k further

Many privacy pools restrict who may deposit. **Veil.Cash** on Base is the clearest example: it gates
deposits on an on-chain attestation that you are a KYC-verified Coinbase user, issued through the
Ethereum Attestation Service
([Veil docs](https://docs.veil.cash/intro/verified-users/coinbase-onchain-verification)). Coinbase
already did the identity check off-chain, and the on-chain attestation is just a yes/no flag against
your address, so the pool learns you are attested without learning who you are. (The attestation
itself is a plain signed record, not a zero-knowledge proof; the zk machinery in Veil is what breaks
the deposit-to-withdrawal link afterwards.)

The trade is direct: gating raises the pool's compliance standing and lowers its anonymity, because
anonymity is a function of how many people are in the set. A smaller, cleaner pool is a smaller
crowd to hide in.

**0xbow's Privacy Pools**, [launched on Ethereum in March 2025](https://www.theblock.co/post/348959/0xbow-privacy-pools-new-cypherpunk-tool-inspired-research-ethereum-founder-vitalik-buterin)
and based on the 2023 paper *Blockchain Privacy and Regulatory Compliance: Towards a Practical
Equilibrium* by Vitalik Buterin, Jacob Illum, Matthias Nadler, Fabian Schär and Ameen Soleimani
([SSRN 4563364](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364)), uses a different gate:
an **Association Set Provider** screens deposits for links to known bad actors, and lets a deposit
later be removed from the association set if it turns out to be criminal. Rejected depositors can
"ragequit" their funds back to the original address.

---

## The three structural problems

### 1. Joining the pool is itself a public statement

By electing to join a privacy pool, you are announcing on-chain that you use this privacy service as
a member of that pool. Membership is visible even when the deposit-withdrawal link is not.

That matters over time. If you join a pool that later accumulates a large amount of value, your
membership makes you a target: an observer knows a large transfer belongs to one of `n` members, and
you are one of them. You did not have to do anything wrong to end up on that list. You just had to be
early.

### 2. One participant can spoil the pool

The concrete attack is **dusting**: someone deposits ETH from a sanctioned address into the pool.

Nothing about your own funds changed, but your burden of proof did. You are now a member of a pool
that contains tainted money, and explaining yourself to an exchange or a bank is harder than it was
the day before. Newer designs push back on this: 0xbow's retroactive removal from the association set
is specifically meant to eject a bad deposit without touching other users' funds or privacy. Whether
that fully solves the reputational problem, as opposed to the cryptographic one, is the open question.

### 3. It costs gas, and it is optional

Using a privacy pool means extra on-chain transactions with real gas costs, on top of simply moving
your money. Privacy is a product you buy, per use, rather than a property the system already has.

Optional privacy also has a well-known failure mode independent of cost: the people who use it are
the people who chose to, which is exactly the signal described in problem 1.

---

## Where Monero fits

Monero's decoy approach avoids the "membership is a signal" problem, because all Monero transactions
look alike. On a pure "data visible on the protocol" basis, membership in a Monero ring is genuinely
indistinguishable.

Monero's weaknesses come from a different direction: **statistical analysis of how decoys are chosen**.
Documented issues include:

- The **EAE attack** (Eve-Alice-Eve), where an entity that repeatedly transacts with you can use the
  local transaction graph to make a probabilistic guess about the real source or destination of funds.
  This was used in the real world to trace WannaCry 2.0 funds.
- A **decoy selection bug** disclosed in 2023 that broke sender anonymity for transactions spending
  outputs exactly 10 blocks old, affecting wallet versions v0.13.0.0 through v0.18.2.1
  ([monero-project issue #8872](https://github.com/monero-project/monero/issues/8872)).

Some of these are being fixed and some are not. The largest fix underway is **FCMP++** (full-chain
membership proofs), which replaces rings entirely: instead of forming a ring of 16 (the real spend
plus 15 decoys), a spend proves it
corresponds to *some* output in the whole chain, moving the effective anonymity set from 16 to on the
order of 100 million and removing decoy selection as an attack surface altogether
([getmonero.org](https://www.getmonero.org/2024/04/27/fcmps.html)).

---

## What Quilibrium does differently

### Privacy is the default state, not an action

The simplest framing, and the one that matters most day to day:

> "If you give someone your address, they get to see your entire transaction history. Privacy pools
> are opt-in, and not gas-free to use. If someone taints the pool you're in, you have a much more
> difficult burden to deal with. For Q, if you give someone your address, nobody knows your
> transaction history except you. If you ever needed to prove your history, you can, and if you need
> to prove the legitimacy of a specific coin, you also can. Instead of making privacy opt-in, you have
> to do more to opt out."
>
> — Cassandra Heart

This is a stated design principle across the project, not only a token property. On the product side:

> "The approach is to never assume anything about what users want to expose. Users are never opted in
> to anything automatically; everything requires manual opt-in. This sometimes means the UI won't be
> the simplest, but privacy is always the default."
>
> — `docs/transcriptions/2026-03-30_quilibrium-state-of-union-megarpc-metavm.md`

Because everyone on Quilibrium is private, being private conveys no information about you. There is
no equivalent of "this address used the mixer."

### Per-coin lineage instead of one shared pool

Quilibrium does not commingle balances. It uses a **UTXO-style model**, closer to Bitcoin than to
Ethereum's account model:

> "Quilibrium doesn't work like that. It's more similar to the unspent transaction outputs (UTXO)
> model of Bitcoin. If I'm Alice and I get sent different QUIL tokens from different people, those
> will all be distinct coin entities. My account will have a balance reflecting the total, but they're
> not lumped together."
>
> — Cassandra Heart, `docs/transcriptions/2024-09-09_quilibrium-2.0-rollout-rdf-data-schema.md`

There is no single confidential pool holding everyone's funds, so there is no single object that a
dusting attack, a court order, or a blacklist can point at. The targeting granularity is per coin,
not per protocol. This is the direct structural answer to "one person can spoil the pool."

### You can still prove what you need to prove

Privacy that cannot be selectively lifted is unusable in practice, because at some point a bank or an
exchange asks where the money came from. Quilibrium handles this with a **compliance bundle** attached
to each coin: an opaque cryptographic marker recording the lineage of addresses the coin passed
through, implemented as a modified bloom filter.

> "A token on Quilibrium contains a compliance bundle: a collection of all addresses that previously
> touched that coin, smashed into an opaque number like a black box. You can query whether a specific
> address ever touched this coin, and it gives you a yes or no. It won't tell you who all touched it.
> The only way you can query that bundle is if you have the rights to read the coin, which means you
> need the key."
>
> — Cassandra Heart, `docs/transcriptions/2024-09-09_quilibrium-2.0-rollout-rdf-data-schema.md`

Two properties follow:

- **Screening happens at receive time, by the recipient**, not after the fact by an authority. A
  receiver can query the coin against any list they choose and reject it, in which case the coin
  returns to a refund address.
- **The query answers yes or no.** It does not reveal which address matched, or when, or who else
  touched the coin.

Coins can also be merged and split, and the holder can deliberately exclude tainted coins from a merge
so clean and dirty funds never combine. See
`docs/quilibrium-official/discover/08-how-quilibrium-protects-privacy-without-enabling-crime.md`.

### An honest note on cost

Cassie's point that privacy pools are "not gas-free to use" is a comparison of *marginal* cost, not a
claim that Quilibrium is free. Quilibrium does charge gas fees denominated in QUIL, based on data
size, execution complexity, and proof size. The distinction is that on Quilibrium there is no extra
privacy transaction to pay for: privacy is part of what an ordinary transfer already does. On
Ethereum, a private transfer costs a normal transfer *plus* the pool deposit and withdrawal.

---

## Background: why Tornado Cash was actually shut down

A common claim is that regulators shut down Tornado Cash because it mixed clean and dirty funds
indiscriminately, and that privacy pools are safe because they use zk proofs to prove funds are
legitimate. Both halves of that claim need correcting.

**Tornado Cash also used zk proofs, and it also had a compliance path.** Its
[Compliance Tool](https://tornado-cash.medium.com/tornado-cash-compliance-9abbf254a370), introduced
around mid-2020, let a user take the secret Note generated at deposit time and produce a verifiable
report re-linking their deposit and withdrawal, to hand to an exchange or institution. Coin Center
described this as selective disclosure: the public link is severed by the pool contract, and the tool
lets the user voluntarily undo that severance for a chosen third party. A separate third-party tool,
[Chainway's "Proof of Innocence"](https://www.theblock.co/post/204544/tornado-cash-proof-of-innocence),
added zk proofs of non-membership in a list of malicious wallets in early 2023.

The real difference is narrower than "clean vs dirty." Tornado mixes all deposits equally; privacy
pools let you prove your funds come from a *specific, vetted* subset. That is a meaningful
improvement, but it is a refinement of the same idea, not a different category.

**The enforcement action was about the developers, not the mixing.** The case centred on an alleged
link between the dev team and sanctioned entities, and on evidence about how much control the team
retained over the service. Emails between the Tornado Cash developers and their investors at Dragonfly
Capital, discussing whether to add KYC to the protocol, were entered into evidence at
[Roman Storm's trial](https://www.defieducationfund.org/us-v-storm-background-timeline/).

**Tornado Cash is no longer sanctioned.** In *Van Loon v. Department of the Treasury* (November 2024)
the Fifth Circuit held that OFAC exceeded its authority in sanctioning immutable smart contracts,
since no person controls them once deployed.
[OFAC removed Tornado Cash from the SDN list in March 2025](https://www.defieducationfund.org/deep-dive-on-delisting-of-tornado-cash-potential-implications/).
Roman Semenov remains individually listed.

The practical lesson for a privacy design: compliance features did not prevent the enforcement action,
and a court can weigh a service's history rather than its current feature set. Building compliance
into the protocol at the coin level, as Quilibrium does, is a different bet from building it into a
front-end tool.

---

## The one-line version

Privacy pools ask you to **join a crowd**, and your safety depends on that crowd staying large, staying
clean, and staying uninteresting to observers. Quilibrium removes the crowd from the design: there is
nothing to join, nothing to taint, and no signal in being private, because everyone already is.

---

## Verification notes

This document is built from a Discord explanation by Cassandra Heart (Quilibrium's founder), with
external facts checked against primary sources. Two details from that conversation could **not** be
independently confirmed and are therefore not stated as fact above:

- That an investor specifically advised the Tornado Cash developers *against* adding a KYC feature.
  Confirmed: emails discussing KYC between the developers and Dragonfly were entered into evidence.
  The specific advice given is not established here.
- That the court proceedings relied on older screenshots of Tornado Cash that predated its compliance
  features. This was offered as a recollection and is not corroborated by available sources.

## Related reading

Nobody can freeze native QUIL, because there is no issuer, no admin key and no shared pool to serve an
order against: `docs/custom/Asset-Freezing-And-Sovereignty.md`. The compliance bundle is a modified
bloom filter, and the false-positive odds are compared to picking one specific atom in a universe
larger than ours: `docs/quilibrium-official/discover/08-how-quilibrium-protects-privacy-without-enabling-crime.md`.
Quilibrium charges gas denominated in QUIL, priced on data size, execution complexity and proof size:
`docs/custom/QUIL-Token-Usage-Fees-And-Destinations.md`. Quilibrium's privacy comes from MPC and
garbled circuits rather than trusted hardware, which is the core difference from TEE-based designs
like Secret Network: `docs/custom/Quilibrium-vs-Secret-Network.md`. The UTXO coin model and the
contamination problem it solves are explained in Cassie's own words in
`docs/transcriptions/2024-09-09_quilibrium-2.0-rollout-rdf-data-schema.md`.

---

*Last updated: 2026-09-03*
