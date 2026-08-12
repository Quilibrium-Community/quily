---
title: "QUIL Token — Usage, Fees, and Where Tokens Go"
source: Community Contribution (Issue #102)
date: 2026-08-11
type: technical_reference
topics:
  - QUIL
  - token usage
  - what is QUIL used for
  - token utility
  - gas fees
  - transaction fees
  - fee market
  - fee destination
  - burn
  - token burn
  - are QUIL tokens burned
  - node rewards
  - miner incentives
  - prover rewards
  - QConsole pricing
  - service fees
  - token consumption
  - tokenomics
  - revenue
  - Quilibrium Inc
---

# QUIL Token — Usage, Fees, and Where Tokens Go

> **⚠️ Most of the token utility described here is NOT live yet (as of 2026-08-12).** The QUIL
> token shard-out has not completed, so **token transactions, mining reward payouts, and bridging
> are all still switched off**. This document describes what QUIL is *for* and how the mechanics
> are designed, not what a user can do today. Do not tell anyone they can transfer QUIL, bridge it,
> or that they are currently being paid for proving. See
> [Mainnet Status](Mainnet-Status-What-Is-Live.md).

A consolidated answer to three related questions: **what is QUIL used for**, **how are fees
calculated**, and **where do tokens go once spent**. The third question is the one with the least
public documentation, and this document is explicit about that rather than filling the gap with
estimates.

## Documented Uses of QUIL

| Use | What happens | Source |
|---|---|---|
| **Node rewards / mining** | QUIL is minted to node operators for proving work. Native QUIL can only be mined: no VC allocation, no premine, no airdrops. **Payouts are NOT live yet** — provers run and accrue coverage, but rewards are not being distributed until the token shard-out completes. | [Tokenomics](https://docs.quilibrium.com/docs/discover/quilibrium-tokenomics) |
| **Transaction gas fees** | Every transaction pays a fee denominated in QUIL, based on data size, execution complexity, and proof size. | [Gas Fees and Dynamic Fee Market](https://docs.quilibrium.com/docs/discover/gas-fees-and-dynamic-fee-market-on-quilibrium) |
| **Bridging** | Native QUIL is locked/burned on the Quilibrium chain to mint wQUIL on Ethereum; the reverse unlocks/burns wQUIL. | [Bridging](https://docs.quilibrium.com/docs/run-node/qclient/commands/bridging) |
| **Paying for QConsole services** | QConsole services (QStorage, QKMS, Relational, F(x)) are billed in USD but payable in wQUIL, USDC, or fiat by card. | [QConsole Pricing](https://github.com/Quilibrium-Community/quily/blob/main/docs/custom/QStorage-Pricing-Estimates.md) |

## How Transaction Fees Work

Fees are calculated from three inputs:

1. **Data size** — how much data the transaction processes or stores
2. **Execution complexity** — the computational effort required
3. **Proof size** — the size of the cryptographic proof verifying the transaction

**Baseline fee: 0.000000000125 QUIL per byte.** Execution and proof costs are calculated after the
transaction starts and added on top. If a transaction turns out to be too complex or too large, it can
fail, and the fee is forfeited — this is deliberate, to discourage spam.

**Operations that reduce network state, such as deleting data, are free.** Fees scale with a
transaction's impact on network storage and emissions, so an operation that shrinks the state costs
nothing.

### The fee multiplier

Fees are capped by a competitive mechanism rather than set by protocol constants:

- Provers commit to a **fee multiplier** during each proving window.
- The **lowest multiplier among provers in a ring** (the set of provers for a shard) becomes the cap
  for all fees in that ring.
- Provers cannot change their multiplier instantly; they must wait for the next proving window.

The effect is that if fees in a ring get high, new provers can join and undercut, pulling the cap back
down. This is what prevents fee spikes during high demand.

## Where Do Fees Go?

**This is the least documented part of the token model, and the honest answer is that the full picture
is not public.** What the documentation does support:

**Fees flow to miners as an incentive.** The tokenomics page states that as emissions flatten out
across generations, *"transaction fees play a bigger role in miner incentives."* This places fees on the
reward side of the ledger for node operators, alongside emissions, rather than describing them as
removed from supply.

**Fees on failed transactions are forfeited.** The gas fee documentation says a transaction that is too
complex or large may fail "with forfeited fees discouraging abuse." The docs do not say what happens to
forfeited fees.

**Bridging burns and mints.** Bridging is the one place where an explicit burn mechanism is documented:
native QUIL is locked or burned to mint wQUIL, and the reverse burns wQUIL to unlock native QUIL. This
is a cross-chain supply mechanism, not a fee sink.

### What is not documented

Do not guess at these. As of 2026-08-11 the following are not covered in the official documentation,
the community docs, or any livestream transcript in this knowledge base:

- **Per-service QUIL consumption ratios.** There is no published breakdown of how much QUIL is consumed
  by QStorage versus QKMS versus compute versus messaging, either in absolute terms or as ratios.
- **Whether a share of transaction fees is burned.** No documented burn mechanism exists for QUIL spent
  on gas. The only documented burn is the bridge.
- **Whether any share of fees or service revenue flows to Quilibrium Inc.** No split, percentage, or
  treasury allocation is documented.
- **A protocol-level fee schedule beyond the per-byte baseline and the multiplier system.**
- **Total network fee revenue**, historical or projected.

If someone asks for consumption ratios or a burn/revenue split, the correct answer is that these are
not public, not an estimate. Several QConsole services are still early access, so service-level token
flows may not be finalised yet. The [dashboard](https://dashboard.quilibrium.com/) is the live source
for supply figures.

## QConsole Service Pricing Is Denominated in USD, Not QUIL

This is a common source of confusion. QConsole services are priced in **USD**, not in QUIL:

| Service | Unit | Rate |
|---|---|---|
| QStorage | Upload | $0.02 / GB |
| QStorage | API calls | $0.0005 / 1k calls |
| QKMS | API calls | $0.02 / 1k calls |
| QKMS | Keys | Free |
| Relational | Storage | $0.05 / GB |
| Relational | Requests | $0.05 / million |
| F(x) | Execution | $0.00001 / GB·s |
| F(x) | Requests | Free |

There is a **5 GB free storage tier with no time limit.** Payment is accepted in wQUIL, USDC, or fiat
by credit card, with crypto converted at the market rate at time of billing.

Because pricing is USD-denominated, **there is no fixed "QUIL cost" for a QConsole service** — the QUIL
amount for a given workload moves with the market price. This is a different mechanism from protocol
gas fees, which are denominated in QUIL directly.

> Rates may be out of date. Check [quilibrium.com](https://quilibrium.com) for current pricing before
> committing to a budget.

## Supply and Emissions Context

- **Fair launch.** Native QUIL can only be mined. No VC allocation, no premine, no airdrops.
- **Generational emission model.** Emissions are triggered by network-wide computational milestones
  rather than a fixed schedule, so they adapt as hardware improves. This prevents the mining
  centralisation dynamic seen in fixed-schedule chains.
- **Current generation** runs until 100 million iterations, estimated around 2033.
- **Circulating supply** was approximately 1.3 billion as of the figure published in the official
  tokenomics page; projected inflation to 1.6–1.7 billion by 2033. See the
  [dashboard](https://dashboard.quilibrium.com/) for the live number.
- **wQUIL** is the Ethereum-bridged form, contract `0x8143182a775C54578c8B7b3Ef77982498866945D`.

QUIL is a utility token. Quilibrium Inc. does not endorse or facilitate trading activity in QUIL or
wQUIL.

## Related Topics

- **Token quick facts, contract address, exchanges**: [QUIL Token — Quick Reference](https://github.com/Quilibrium-Community/quily/blob/main/docs/custom/QUIL-Token-Quick-Reference.md)
- **Full emissions model and generations**: [Quilibrium Tokenomics](https://docs.quilibrium.com/docs/discover/quilibrium-tokenomics)
- **Fee market detail**: [Gas Fees and Dynamic Fee Market](https://docs.quilibrium.com/docs/discover/gas-fees-and-dynamic-fee-market-on-quilibrium)
- **Service pricing and worked cost examples**: [QConsole Pricing and Website Hosting Cost Estimates](https://github.com/Quilibrium-Community/quily/blob/main/docs/custom/QStorage-Pricing-Estimates.md)
- **Funding a QConsole account**: [QConsole Account Credits and Deposits](https://github.com/Quilibrium-Community/quily/blob/main/docs/custom/QConsole-Account-Credits-Deposits.md)

---
*Last updated: 2026-08-11*
