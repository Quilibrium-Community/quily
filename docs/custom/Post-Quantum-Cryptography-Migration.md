---
title: "Post-Quantum Cryptography Migration: What Quilibrium Actually Uses Now"
source: QuilibriumNetwork/monorepo at v2.1.0.25 (crate manifests and source headers), plus Cassie's .25 branch announcement (Discord, 2026-07-20)
date: 2026-08-23
type: technical_reference
topics:
  - what cryptography does quilibrium use
  - cryptographic primitives
  - crypto stack
  - post-quantum
  - post quantum cryptography
  - pqc
  - quantum resistant
  - quantum safe
  - is quilibrium quantum resistant
  - cryptographic agility
  - falcon
  - fn-dsa
  - falcon 512
  - ntru
  - sntrup761
  - streamlined ntru prime
  - lattice cryptography
  - m-lwe
  - m-sis
  - bdlop
  - module lattice
  - verkle
  - verkle tree
  - is quilibrium still using verkle
  - kzg
  - kzg commitments
  - polynomial commitments
  - bls48-581
  - bls48581
  - bls signatures
  - ed448
  - x448
  - decaf448
  - bulletproofs
  - schnorr
  - merkle tree
  - merkle forest
  - jellyfish merkle tree
  - jmt
  - proof trees
  - state trees
  - signature scheme
  - key types
  - peer identity
  - mtls
  - transport encryption
  - commonware
  - simplex consensus
  - consensus library
  - v2.1.0.25
  - 2.1.0.25
  - what changed in .25
---

# Post-Quantum Cryptography Migration

## Short Answer

Node release **v2.1.0.25** (rolling out from August 2026) replaced most of Quilibrium's classical cryptography with post-quantum alternatives. Anything you read that describes Quilibrium as using **Verkle trees, KZG state commitments, BLS48-581 consensus signatures, Ed448 peer keys or X448 transport keys** is describing **v2.1.0.24 and earlier**, not the current node.

| Area | Up to v2.1.0.24 | From v2.1.0.25 | Status |
|---|---|---|---|
| Consensus signatures (votes, timeouts, quorum certificates, frame headers, prover-join proofs) | BLS48-581 | Falcon / FN-DSA-512 | Live |
| Peer identity and p2p attestation | Ed448 | Falcon (libp2p key type 5, mandatory) | Live |
| Transport key exchange (QUIC / mTLS) | X448 | sntrup761 (Streamlined NTRU Prime) | Live |
| Config read and encryption keys | X448 | sntrup761 | Live |
| State proof trees | 64-ary Verkle tree with KZG vector commitments | Three-tier Merkle forest over Jellyfish Merkle Trees (SHA-256) | Live, with a migration step for archives |
| Global consensus driver | Hand-rolled implementation | Commonware simplex | Wired into the node in .25 |
| Token privacy (commitments, range proofs) | decaf448 Pedersen + Bulletproofs + verifiable encryption | Module-lattice (M-LWE / M-SIS, BDLOP style) | **Not live yet**: in the repo, self-labelled pre-audit |

Two things did **not** change, and are still correct in older material:

- **Storage possession proofs still use KZG over BLS48-581.** The per-frame storage attestation path (`quil-crypto/src/porep.rs`) is a wrapper over `bls48581::aggregate_verify_openings`. The Merkle swap replaced the *state trees*, not the storage proofs.
- **MetaVM, the zero-knowledge VM, still uses KZG polynomial commitments over BLS48-581 and BLS12-381.** It is a separate subsystem and was not part of this migration.

---

## Why It Happened: Performance First, Quantum Safety Second

This is the part most summaries get backwards. Per Cassie's announcement of the .25 branch (Discord, 2026-07-20), the work started as a **performance investigation**, not a quantum-readiness project. Post-quantum safety was the side effect.

The concrete problem: every time the network started growing, opportunistic operators would spin up many nodes at once. Each new peer brought a fresh key, so caching did not help, and mutual authentication work piled up until it starved the threads that peers needed for syncing and submitting requests. Thread pooling just moved the bottleneck. The primitives themselves were the cost.

Measured effects reported at the time:

- Falcon verification was faster than BLS48-581 on every metric that mattered, even though Falcon has no signature aggregation scheme.
- Swapping the Ed448 Noise transport for NTRU "collapsed" verification time and processor burden.
- Moving from Verkle/KZG to Merkle was several orders of magnitude faster in cases without AVX512 hardware support: worst case went from low seconds to low milliseconds.
- Replacing hand-rolled consensus logic with battle-tested libraries brought average time-to-confirmation down from a 1 to 3 second range to sub-second.

The stated framing was that this demonstrates **cryptographic agility**, a design goal from the start: being able to swap primitives that share a purpose. The motivation is not only quantum computers but also the possibility that an established cryptosystem is broken in some unexpected way.

Cassie also stated that with .25 there is **no later PQC migration stage**: the non-post-quantum-safe intrinsics were removed in one pass rather than being phased out over several releases.

---

## Signatures: BLS48-581 to Falcon

**As of v2.1.0.25.** Consensus signing moved to **Falcon-512**, also known as **FN-DSA-512**, a lattice-based post-quantum signature scheme. The implementation is Thomas Pornin's pure-Rust `fn-dsa` crate, wrapped in `crates/quil-crypto/src/falcon.rs`.

It covers the consensus path: votes, timeouts, quorum certificate shares, frame header signatures and prover-join proofs of possession.

Sizes, which matter because they are much larger than what they replaced:

| Item | Size |
|---|---|
| Signing key | 1281 bytes |
| Public (verifying) key | 897 bytes |
| Signature | 666 bytes |

**The important trade-off: Falcon does not aggregate.** BLS48-581 could compress many signatures into one. Falcon cannot, so a quorum certificate is now a list of individual Falcon signatures plus a bitmask saying who signed. The team accepted this because verification speed more than paid for the extra bytes. Verification is CPU-fast and constant-time; the floating-point arithmetic that makes Falcon tricky to implement safely is confined to signing.

The old `crates/quil-crypto/src/bls.rs` module was **removed** in .25. The `bls48581` crate itself still exists, because storage proofs and MetaVM still use it.

---

## Peer Identity and Transport: Ed448 and X448 to Falcon and NTRU

**As of v2.1.0.25.**

**Peer identity is Falcon.** Quilibrium's libp2p fork now defines Falcon as key type 5, and its manifest states plainly that Falcon "is the mandatory network identity". Peer keys are used both for p2p message attestation and for mutual authentication, which is exactly where the load problem showed up.

**Transport key exchange is sntrup761**, also called Streamlined NTRU Prime, a post-quantum key encapsulation mechanism (KEM). It is used as the QUIC key-exchange group in the `libp2p-tls` fork, and it also replaced X448 for **config read keys**, the keys a third party encapsulates to when writing data the owner should be able to read. Implementation is PQClean via the `pqcrypto-ntruprime` crate.

Sizes:

| Item | Size |
|---|---|
| Public key | 1158 bytes |
| Secret key | 1763 bytes |
| Ciphertext | 1039 bytes |
| Shared secret | 32 bytes |

Note that **Ed448 has not been deleted from the codebase**. The `ed448-rust` crate is still present and still referenced, so older `qclient` key material and commands referencing `ed448` are not automatically invalid. What changed is which primitive the network itself uses for identity and transport.

---

## Proof Trees: Verkle and KZG to a Merkle Forest

**As of v2.1.0.25.** This is the change reported in [issue #114](https://github.com/Quilibrium-Community/quily/issues/114), and it is the one most likely to appear in older documentation.

Quilibrium's state is no longer held in a **64-ary Verkle tree with KZG vector commitments**. It is held in `quil-forest`, described in its own source as "a three-tier authenticated Merkle forest built over a battle-tested Jellyfish Merkle Tree (JMT) primitive". The JMT implementation is the Aptos-origin, Penumbra-forked `jmt` crate, vendored as `crates/jmt`.

The three tiers:

- **Level 1: 256 global trees.** Keyed by app address, indexed by the first address byte (0 to 255). Each leaf holds an app's current tree root, leaf count, total size and intrinsic metadata. **Every node holds all 256.**
- **Level 2: per-app shard-commitment tree.** One leaf per shard, holding that shard's commitment, leaf count and size. It splits and merges as the app subdivides. **Held by any prover under that app.**
- **Level 3: per-shard state trees.** The actual state leaves. The CRDT keeps four *phase* trees per shard (vertex and hyperedge, each with adds and removes) for OR-set merge semantics, so one shard is four JMT instances. Their four roots are the frame header's `state_roots` and roll up into Level 2. **Held by that shard's provers.**

**Archives hold all three levels.** This is why Cassie's .25 announcement said the branch required migration steps of archives, and why `quil-forest-migrate` exists as its own crate.

The point of the swap, in the code's own words: commit uses hash commitments (SHA-256) instead of the KZG/BLS48-581 vector commitment, so "a branch commit becomes a hash, not a G1 multiexp". Every tree is an independent JMT instance sharing one RocksDB, namespaced by tree id, so each party stores only the trees its role needs.

**Caveat on the 4,096 logical shard slots figure.** Older community docs derive "4,096 logical shards" from the 64-ary Verkle tree structure. The tree structure it was derived from no longer exists. Treat the shard-count figure as needing re-verification rather than as confirmed current.

---

## Consensus: Hand-Rolled Logic to Commonware

**As of v2.1.0.25.** Alongside the cryptography work, Quilibrium removed most of its hand-rolled generic consensus code. These were implementations the team had written by hand because no suitable library existed at the time, and they have been replaced with established libraries.

The new crate is `quil-cw-consensus`, described as a "Commonware simplex consensus backend for Quilibrium", using a Falcon certificate scheme with simplex engine adapters over the node's `:8340` transport. It is pinned to Commonware release `2026.7.0` and is a declared dependency of both `quil-node` and `quil-engine` in .25.

A design decision worth noting: the migration chose **equal votes**, meaning count-based quorum, so no threshold or BLS crates are needed on this path.

The older `quil-consensus` crate is still a dependency too, so both are present in .25. Reported effect of this work: average time-to-confirmation dropped from a 1 to 3 second range to sub-second.

---

## Token Privacy: Not Migrated Yet

**As of v2.1.0.25, this one is in progress and should not be described as live.**

The current live path for confidential token operations is still the classical one: **decaf448 Pedersen commitments, Bulletproofs range proofs, and verifiable encryption** (`verenc`). The adapter in `crates/quil-crypto/src/bulletproof_adapter.rs` is still present and still wired up.

The post-quantum replacement exists in the repo as `crates/quil-lattice-ct`, described as "post-quantum confidential-transaction primitives (module-lattice), the PQ replacement for the decaf448 Pedersen/Bulletproof/verenc privacy stack". It is a substantial implementation covering commitments, range proofs, membership proofs, accumulators and sigma protocols. The approach is the module-lattice equivalent of the commitment and range-proof trick used in Monero-style confidential transactions, built on M-LWE and M-SIS hardness assumptions in the BDLOP commitment family, with SIS-accumulator proofs to reduce the overhead of privacy preservation.

Two reasons to be careful about it:

1. Its own manifest labels it **"PHASE 5, PRE-AUDIT"**.
2. It is **not** a dependency of `quil-node` or `quil-engine` in v2.1.0.25, so it is not on the running node's code path.

So: the design and code exist, the performance results were reported as good, but "Quilibrium's token privacy is post-quantum today" is not an accurate statement as of v2.1.0.25.

---

## Sourcing and Confidence

This document was compiled on 2026-08-23 by reading the Quilibrium monorepo directly at branch `v2.1.0.25`: crate manifests (`Cargo.toml`) and module-level source documentation. It is cross-checked against Cassie's public announcement of the .25 branch in Discord on 2026-07-20.

**Confidence by claim:**

- **High** (read directly from code in .25): Falcon for consensus signatures and peer identity, sntrup761 for transport and config keys, the three-tier JMT Merkle forest, the removal of `bls.rs`, Commonware simplex being wired into the node, `quil-lattice-ct` being present but not on the node's dependency path, KZG/BLS48-581 remaining for storage attestation and MetaVM.
- **Reported, not independently measured**: all performance figures (order-of-magnitude tree speedups, sub-second confirmation times, NTRU verification collapse). These come from the team's own announcement.

**Known documentation lag.** Official documentation on docs.quilibrium.com had not been updated to reflect this migration as of 2026-08-23. The monorepo's own `ARCHITECTURE.md`, even on the `v2.1.0.25` branch, still describes "Verkle tree structures" and KZG proofs. So a document describing the old primitives is not necessarily a document anyone has reviewed and confirmed; it is more likely one that has not been touched yet.
