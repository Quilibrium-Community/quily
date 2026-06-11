---
title: "Klearu"
source: quilibrium.com/ecosystem (automated)
date: 2026-06-11
type: community_reference
topics:
  - Klearu
  - klearu
  - Quilibrium ecosystem
  - ecosystem project
  - projects on Quilibrium
  - apps on Quilibrium
  - ai
  - privacy
  - open-source
---

# Klearu

**Part of the official Quilibrium ecosystem.** Relation to the network: Quilibrium Protocol (a core piece of Quilibrium, built into the network itself).

**Private AI you can actually verify.** Klearu lets you chat with a large language model running on a remote server **without the server ever seeing what you wrote**, with the guarantee enforced by math instead of trust.

When you talk to most AI services today, your prompt goes to their servers as plain text. They could read it, log it, train on it, hand it over. "Private AI" usually means a promise on a privacy page. Klearu replaces the promise with a cryptographic protocol: the server runs the model, you hold the input, and a two-party exchange between the two of you produces the answer without either side learning what the other holds. **The server never sees your prompt. You never see the model weights.** The privacy is in the math.

A live demo runs entirely in your browser at https://klearu-demo.qstorage.quilibrium.com. You can open your browser's network inspector while you chat and watch what actually goes over the wire: every message is split into cryptographic shares that look like random noise to anyone observing them. No plaintext ever leaves your device. It's the kind of guarantee you can check yourself rather than take on faith.

Klearu runs on **regular CPU hardware, no GPU required**. There are several security modes you can pick from: a lighter one that runs roughly as fast as a local model on your laptop, and stronger ones that trade some speed for stronger privacy guarantees about the in-flight computation. The right mode depends on what you're protecting and how much time you're willing to wait.

Klearu is **open source**. It is available today as a library and a demo; native integration into the Quilibrium network is planned for a future upgrade, at which point private inference will be available as a built-in service to any application running on Quilibrium.

**Website:** https://github.com/QuilibriumNetwork/klearu

**Links:**
- Live demo: https://klearu-demo.qstorage.quilibrium.com/

**Categories:** ai, privacy, open-source

---

*This document is auto-generated from the official Quilibrium ecosystem page at quilibrium.com/ecosystem.*
