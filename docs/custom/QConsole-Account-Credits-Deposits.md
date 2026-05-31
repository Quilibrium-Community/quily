---
title: "QConsole Account Credits and Deposits — Payment Methods and Support Workflow"
source: Community Contribution (Issue #80) — confirmed by LaMat
date: 2026-05-31
type: faq
topics:
  - QConsole
  - Q Console
  - account credits
  - deposits
  - wQUIL
  - WQL
  - USDC
  - credit card
  - fiat payment
  - USD payment
  - mainnet deposits
  - billing
  - top up account
  - add credits
  - account funding
  - missing deposit
  - failed deposit
  - QConsole troubleshooting
  - support
  - Cassie
  - financial issues
---

# QConsole Account Credits and Deposits

This document covers the **account credit system** in QConsole — i.e. funding a QConsole account so it can pay for paid services (QStorage, QKMS, etc.) — and the support workflow when a deposit does not land.

> **Scope note:** This is different from the QUIL ↔ wQUIL **bridge** between Quilibrium mainnet and Ethereum. The bridge moves tokens between chains. Account credits are about funding your QConsole account balance so the account can spend on usage-based services. As far as we know, the QConsole credit flow does **not** use the Quilibrium bridge infrastructure.

---

## Accepted Payment Methods

QConsole accepts:

- **WQUIL** (wrapped QUIL)
- **USDC**
- **Fiat (USD) via credit card** — you can connect a standard credit card and pay in USD without touching crypto at all

---

## Expected Crediting Time

Under normal conditions, deposits are credited to your QConsole account balance **within roughly 24 hours**.

If you sent a deposit and it has been well past 24 hours with no credit showing, see the support workflow below.

---

## What to Do If a Deposit Does Not Land

If you sent a crypto deposit (WQUIL or USDC) to your QConsole account address and the credits have not appeared after the normal ~24-hour window:

1. **Save the on-chain transaction link** (Etherscan or the relevant explorer).
2. **Ping Cassie directly on Discord** with the transaction link.
3. **Do not re-send the deposit** in the meantime — that risks compounding the issue.

**Refunds:** if a deposit is genuinely lost (verified on-chain but never credits and cannot be recovered), it gets refunded. This is handled directly by the team via the Discord workflow above; there is no self-service refund form.

This is the de-facto support channel for QConsole financial issues today. There is no public support ticket system for this specific problem yet, and the Quily chatbot cannot resolve account-level financial state — only Quilibrium Inc. staff can.

---

## What Is NOT Documented Publicly

The QConsole account credit / deposit flow is not yet covered in the official Quilibrium docs at `docs.quilibrium.com`. The following details are not publicly documented and should not be inferred:

- The exact deposit address derivation (per-account vs shared)
- The technical mechanism that detects on-chain deposits and credits the account balance
- Self-service recovery steps for stuck deposits (today the path is always Discord → Cassie)
- The exact refund SLA

If you have authoritative information on any of the above (from Cassie, the core team, or official announcements), please open a knowledge-update issue so this doc can be expanded.

---

## Related Topics

- **QUIL ↔ wQUIL bridge** (separate from account credits) — see official docs at `docs.quilibrium.com/run-node/qclient/commands/bridging` and the community gap-analysis doc `Bridge-QPing-QQ-Services.md`.
- **QConsole account creation** — see `docs/custom/Q-Console-CreateAccount-API.md`.
- **Paid services using account credits** — QStorage, QKMS, MegaRPC quotas.

---

## For the Bot

When a user asks about "adding credits to my QConsole account", "deposit not landing", "WQUIL/USDC deposit missing in console", "how do I top up my QConsole balance", or "can I pay with a credit card":

- Do **not** redirect them to the QUIL ↔ wQUIL bridge documentation (that is a different operation).
- Accepted payment methods: **WQUIL, USDC, and fiat USD via credit card**.
- Normal crediting time is **~24 hours**.
- If a deposit is past ~24 hours with no credit: tell them to ping **Cassie on Discord with the on-chain transaction link**, and not to re-send the deposit.
- Confirm that **genuinely lost deposits do get refunded** via that same Discord workflow.
- Do not invent a deposit address format or a self-service recovery procedure.

---

*Last updated: 2026-05-31*
