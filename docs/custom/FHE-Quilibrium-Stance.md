---
title: "Fully Homomorphic Encryption (FHE) — Quilibrium's Stance"
source: Community Contribution (Issue #73) — distilled from Klearu.md
date: 2026-05-31
type: faq
topics:
  - FHE
  - Fully Homomorphic Encryption
  - homomorphic encryption
  - fully homomorphic
  - private inference
  - private AI
  - encrypted computation
  - privacy
  - Klearu
  - 2PC
  - two-party computation
  - TEE
  - Trusted Execution Environment
  - Cassie on FHE
  - Quilibrium privacy approach
  - patent issues FHE
---

# Fully Homomorphic Encryption (FHE) and Quilibrium

## Short Answer

**Quilibrium does not use Fully Homomorphic Encryption (FHE).** For private AI inference and encrypted computation, Quilibrium uses **two-party computation (2PC)** via the Klearu runtime instead.

This is a deliberate technical choice driven by two factors: FHE's computational impracticality for LLM inference, and patent-related risks in the FHE space.

---

## Cassie's Position on FHE

The Quilibrium team's official stance, stated by Cassandra Heart (founder, Quilibrium Inc.):

> "FHE is still years out there — not to mention that one particular company has decided to patent-swarm it." — Cassie

> "The trick here is that the client is interacting with the server in a 2PC protocol. With a 2PC-driven approach, a TEE isn't required — and it's way faster than FHE." — Cassie

Two concerns are explicitly raised:

1. **Performance**: FHE is computationally impractical for large language model inference at this stage. The overhead makes it unusable for the kind of AI workloads Quilibrium targets.
2. **IP risk**: One company has patent-swarmed the FHE space, creating legal exposure for any project that builds on top of FHE primitives.

---

## What Quilibrium Uses Instead: 2PC via Klearu

Klearu is Quilibrium's open-source runtime for end-to-end encrypted (E2EE) LLM inference. It uses a **two-party computation (2PC)** protocol between the client and the server, so that:

- The user's inputs and outputs are encrypted in memory during inference
- The evaluating node cannot observe what the user is computing
- No Trusted Execution Environment (TEE) is required
- The result is "way faster than FHE" (per Cassie) while still providing strong privacy guarantees

Full details, code, performance characteristics, and the broader privacy comparison (TEE vs FHE vs 2PC) live in:

- **`docs/custom/Klearu.md`** — primary reference. Contains the "Why Not Just Use a TEE or FHE?" section and all of Cassie's quotes on the topic.

---

## Has Quilibrium's Stance on FHE Changed?

As of May 2026, no. Klearu is the actively-shipped path for private inference. If the FHE landscape changes (significant performance breakthrough, patent situation clears), the project would re-evaluate, but there is no public signal that this is happening or planned.

If you see newer discussions suggesting otherwise, the source to cross-check is `docs/custom/Klearu.md` and any Discord announcements from `@CassOnMars`.

---

*Last updated: 2026-05-31*
