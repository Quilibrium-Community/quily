---
title: "Post-Quantum Cryptography Migration: What Quilibrium Actually Uses Now"
source: QuilibriumNetwork/monorepo branch v2.1.0.25 (crate manifests, source headers, merged PRs, read 2026-11-03), Cassie's .25 branch announcement (Discord, 2026-07-20), Discord node-updates and recaps (October 2026)
date: 2026-11-03
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
  - storage proofs
  - hash-based storage proofs
  - post-quantum storage proofs
  - stark
  - plonky3
  - poseidon2
  - qct3
  - lattice confidential transactions
  - shielded coins
  - shield-all
  - legacy coins
  - qclient token shield
  - epoch 1311
  - epoch 1314
  - quantum resistance
  - is the network quantum resistant
---

# Post-Quantum Cryptography Migration

## Short Answer

**Yes, Quilibrium is now post-quantum for its core protocol.** Node release **v2.1.0.25** (the `2.1.0.25.x` sub-patch series, running on mainnet since October 2026) replaced almost all of Quilibrium's classical cryptography with post-quantum alternatives: signatures, peer identity, transport, state trees, storage proofs and the confidential token format. Anything you read that describes Quilibrium as using **Verkle trees, KZG state or storage commitments, BLS48-581 consensus signatures, Ed448 peer keys, X448 transport keys, or decaf448 plus Bulletproofs for token privacy** is describing **v2.1.0.24 and earlier**, not the current node.

| Area | Up to v2.1.0.24 | From v2.1.0.25 | Status |
|---|---|---|---|
| Consensus signatures (votes, timeouts, quorum certificates, frame headers, prover-join proofs) | BLS48-581 | Falcon / FN-DSA-512 | Live |
| Peer identity and p2p attestation | Ed448 | Falcon (libp2p key type 5, mandatory) | Live |
| Transport key exchange (QUIC / Noise) | X448 | sntrup761 (Streamlined NTRU Prime), PQNoise handshake | Live |
| Config read and encryption keys | X448 | sntrup761 | Live |
| State proof trees | 64-ary Verkle tree with KZG vector commitments | Three-tier Merkle forest over Jellyfish Merkle Trees (SHA-256) | Live |
| Storage possession proofs | KZG openings over BLS48-581 | Hash-based proofs: Poseidon2 Merkle commitments plus one Plonky3 STARK per member per epoch | Live from epoch 1314 |
| Global consensus driver | Hand-rolled implementation | Commonware simplex | Live |
| Confidential tokens (commitments, range and membership proofs) | decaf448 Pedersen + Bulletproofs + verifiable encryption | Module-lattice suite "QCT3" (M-LWE / M-SIS, BDLOP-style commitments, lattice range and membership proofs) | Live, default and only path; unaudited |

Not everything classical is gone. See "What Is Still Classical" below, chiefly **Ed448 for legacy coin ownership** and **MetaVM's KZG tooling**.

---

## Timeline

- **2026-07-20:** Cassie announces the `v2.1.0.25` branch and its migration work.
- **2026-10-19:** `.25` is released to operators and archives.
- **2026-10-26:** PR #899 (hash-based storage proofs) and PR #959 (seniority succession) merge. `.25.103` operator notes tell node operators to upgrade every node (master and workers) before GLOBAL frame 943,200; older builds do not follow the switch.
- **2026-10-27, epoch 1311 (GLOBAL frame 943,920):** several consensus rules switch on (stricter peer-info checks, replay guards, anchored issuance, authenticated archive sync) and **legacy coin shielding opens**. Nodes on older builds lose gossip with upgraded ones.
- **2026-10-28:** the first post-quantum coin transaction is processed (a legacy coin shielded into the new format). It triggers a tree-rebuild stall that is fixed the same day.
- **Epoch 1314 (GLOBAL frame 946,080):** hash-based storage proofs and seniority succession activate on mainnet. Epochs 1311 to 1313 are a short "storage attestation pause" with no attestation.
- **Epoch 1321 (frame 951,120, 2026-10-29):** provers without sealed storage are paid issuance again.
- **Epoch 1342 (frame 966,240):** a missing storage epoch proof stops costing the prover its seat.

The official signed release is still `2.1.0.24` as of 2026-11-02; `.25.x` sub-patches are distributed to operators and archives, and the network is running them.

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

On the broader risk, Cassie said on 2026-10-28 that she puts roughly 90% personal probability on elliptic-curve cryptography being broken before large quantum computers arrive, which would hit Bitcoin, Ethereum and Monero hard. Quilibrium's stated advantages are its post-quantum primitives, reduced code complexity after the Go-to-Rust migration, and the ability to swap components. For assets bridged from Ethereum, she noted Quilibrium could freeze the bridge and use zero-knowledge proofs to help users recover assets, though externally owned accounts without a seed phrase cannot produce meaningful proofs.

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

The old `crates/quil-crypto/src/bls.rs` module was **removed** in .25. Some BLS48-581 code remains in the repository for verifying older (pre-epoch-1314) storage proofs and for the MetaVM tooling.

---

## Peer Identity and Transport: Ed448 and X448 to Falcon and NTRU

**As of v2.1.0.25.**

**Peer identity is Falcon.** Quilibrium's libp2p fork defines Falcon as key type 5, and its manifest states plainly that Falcon "is the mandatory network identity". Peer keys are used both for p2p message attestation and for mutual authentication, which is exactly where the load problem showed up. **New peer IDs are expected after moving to .25**: the Rust node reuses the old `.config` folder of the Go node, adds its new 2.1 keys on first start, and operators should back up their old keys first.

**Transport key exchange is sntrup761**, also called Streamlined NTRU Prime, a post-quantum key encapsulation mechanism (KEM). It is used as a PQNoise handshake (non-hybrid, bound to the peer identity by signing the handshake hash) and it also replaced X448 for **config read keys**, the keys a third party encapsulates to when writing data the owner should be able to read. Implementation is PQClean via the `pqcrypto-ntruprime` crate, now behind a dedicated `quil-sntrup761` crate. Its own source notes that no independent audit of it is known.

Sizes:

| Item | Size |
|---|---|
| Public key | 1158 bytes |
| Secret key | 1763 bytes |
| Ciphertext | 1039 bytes |
| Shared secret | 32 bytes |

Note that **Ed448 has not been deleted from the codebase**. It is still used for legacy coin ownership and shield authorization, for prover-seniority merge targets, and for the old key types in `keys.yml` (which also still holds decaf448 and x448 entries). What changed is which primitive the network itself uses for identity and transport.

---

## Proof Trees: Verkle and KZG to a Merkle Forest

**As of v2.1.0.25.** This is the change reported in [issue #114](https://github.com/Quilibrium-Community/quily/issues/114), and it is the one most likely to appear in older documentation.

Quilibrium's state is no longer held in a **64-ary Verkle tree with KZG vector commitments**. It is held in `quil-forest`, described in its own source as "a three-tier authenticated Merkle forest built over a battle-tested Jellyfish Merkle Tree (JMT) primitive". The JMT implementation is the Aptos-origin, Penumbra-forked `jmt` crate, vendored as `crates/jmt`.

The three tiers:

- **Level 1: 256 global trees.** Keyed by app address, indexed by the first address byte (0 to 255). Each leaf holds an app's current tree root, leaf count, total size and intrinsic metadata. **Every node holds all 256.**
- **Level 2: per-app shard-commitment tree.** One leaf per shard, holding that shard's commitment, leaf count and size. It splits and merges as the app subdivides. **Held by any prover under that app.**
- **Level 3: per-shard state trees.** The actual state leaves. The CRDT keeps four *phase* trees per shard (vertex and hyperedge, each with adds and removes) for OR-set merge semantics, so one shard is four JMT instances. Their four roots are the frame header's `state_roots` and roll up into Level 2. **Held by that shard's provers.**

**Archives hold all three levels.** This is why the .25 branch required migration steps of archives, and why `quil-forest-migrate` exists as its own crate.

The point of the swap, in the code's own words: commit uses hash commitments (SHA-256) instead of the KZG/BLS48-581 vector commitment, so "a branch commit becomes a hash, not a G1 multiexp". The node uses a SHA-based inclusion prover. Every tree is an independent JMT instance sharing one RocksDB, namespaced by tree id, so each party stores only the trees its role needs.

**Caveat on the 4,096 logical shard slots figure.** Older community docs derive "4,096 logical shards" from the 64-ary Verkle tree structure. The tree structure it was derived from no longer exists. For scale, Cassie stated on 2026-10-19 that there is no shard-split limit and that the ultimate limit is the number of logical shards on the network, **approximately 121 million**.

---

## Storage Proofs: KZG to Hash-Based STARK Proofs

**As of epoch 1314 (GLOBAL frame 946,080) on mainnet.** Storage possession proofs used to be KZG openings over BLS48-581. PR #899 ("DA proof cutover", merged 2026-10-26) replaced them with hash-based, post-quantum proofs.

How the new scheme works:

- A replica of the stored data is built and sealed. **Poseidon2 over the KoalaBear field** builds three Merkle commitments over it.
- A **seal proof** answers 64 challenges. Per-frame proofs are single-node possession openings.
- **One Plonky3 STARK per member per epoch** proves the seals together with that epoch's openings. Parameters are around 100-bit post-quantum security (FRI blowup 4, 96 queries). The implementation lives in the new `quil-storage-stark` crate.
- GLOBAL tracks a per-shard, per-epoch **storage seat**. If no storage proof arrives for an epoch, rewards for that seat are forfeited (and, until epoch 1342, the member could be kicked).

**Activation date caveat.** The original PR text said epoch 1290, and early operator notes said epoch 1311 (frame 943,920). Both are superseded: the hash-proof epoch was moved to **1314 (frame 946,080)**, and epochs 1311 to 1313 are a pause window during which GLOBAL pays frames without attestation. Epoch 1311 is when the *other* cutovers started, including legacy coin shielding.

Practical consequences seen in October: sealing storage turned out to be too slow for many regular nodes within a two-hour epoch (about 18 hours of labelling per epoch on a 15-seat node, measured before a fix), so epoch 1321 started paying unsealed provers issuance again, epoch 1342 stopped kicking provers for a missing proof, and a stable-replica-key change (PR #1109) was merged but not yet scheduled on mainnet.

---

## Consensus: Hand-Rolled Logic to Commonware

**As of v2.1.0.25.** Alongside the cryptography work, Quilibrium removed most of its hand-rolled generic consensus code. These were implementations the team had written by hand because no suitable library existed at the time, and they have been replaced with established libraries.

The new crate is `quil-cw-consensus`, described as a "Commonware simplex consensus backend for Quilibrium", using a Falcon certificate scheme with simplex engine adapters over the node's `:8340` transport. It is pinned to Commonware release `2026.7.0` and is a declared dependency of both `quil-node` and `quil-engine`.

A design decision worth noting: the migration chose **equal votes**, meaning count-based quorum, so no threshold or BLS crates are needed on this path.

Reported effect of this work: average time-to-confirmation dropped from a 1 to 3 second range to sub-second, and by early November the network was holding consistent **10-second global frames**.

---

## Confidential Tokens: Decaf448 and Bulletproofs to Lattice Cryptography

**As of v2.1.0.25 this is live.** The earlier privacy stack (decaf448 Pedersen commitments, Bulletproofs range proofs, verifiable encryption) has been replaced by `crates/quil-lattice-ct`, a module-lattice confidential-transaction suite called **QCT3**. It is a direct dependency of `quil-node`, `quil-engine`, `quil-execution` and `quil-client`, and the node builds with it by default (a node built without it rejects every confidential token operation). The old decaf448 token types are rejected by the execution engine as retired.

What QCT3 is made of:

- **Commitments:** packed BDLOP-style commitments over the ring Z_q[X]/(X^256+1), secure under the M-LWE and M-SIS lattice assumptions at a 128-bit target.
- **Proofs:** amount, range and membership proofs are LaBRADOR/LNP-style lattice proofs.
- **Accumulator:** a coin-tree accumulator hashed in a proof ring, with ownership via a recipient secret, a per-note nonce, and a key image (nullifier) to prevent double spends.
- **Memos:** SNTRUP761 key exchange with SHAKE256 and AES-256-GCM.
- Escrows, custom mints, reward mints and settlement are also supported.

Privacy consequence, as Tyger and Cassie described on 2026-11-01: a transfer reveals no sender, receiver or amount, only that a transaction occurred, which is why there can be no Etherscan-style public explorer for token movements.

**Audit status.** Nothing in the repository says an external audit has been done. The code itself notes that ring arithmetic is variable-time and that timing resistance and complete secret erasure are not established, and the proof backend's README calls it "not a production-approved verifier" (that README is stale in other respects, as the node does use it). Treat QCT3 as **live but unaudited**. In practice about 1 in 10 proof attempts fail a witness check and are retried.

### Moving legacy coins: `qclient token shield` and `shield-all`

Pre-2.1 (2.0-era) coins were verifiable-encryption blobs under a hard-coded public read key, so they were effectively public. The migration turned them into transparent coins owned by an Ed448 key ("legacy" coins), and shielding moves them into the new lattice format.

- `qclient token legacy` lists the legacy coins held by a key (read-only, nothing is moved). The total is reported in base units; divide by 8,000,000,000 for QUIL.
- `qclient token shield` moves one legacy coin into the confidential accumulator, authorized with its Ed448 owner signature. This is one-way.
- `qclient token shield-all` submits batches of up to 96 legacy coins per shard.
- Shielding is accepted on mainnet from GLOBAL frame 943,920 (epoch 1311).
- Each batch takes about 5 minutes to prove on an ordinary node and archives need tens of seconds to verify it, so since PR #1087 `shield-all` spaces batches at least 300 seconds apart. A wallet with tens of thousands of coins can take days. Large operators were asked to pace their runs after a wave of roughly 500 batch shields stalled about a quarter of the shards on 2026-11-02; a rerun cannot charge the fee twice.
- Pre-.25 coins are not lost as long as the old `.config/` folder and `keys.yml` are kept. Never upload `config.yml` or `keys.yml` anywhere: `config.yml` holds the private key that owns the coins.
- A running `.25` node is needed to read or shield legacy coins, since there is no official signed `.25` qclient release yet; operators use the latest branch build or the Quilscan node console.

---

## What Is Still Classical

Be precise when someone asks "is everything post-quantum". These classical pieces remain:

- **Ed448 and other legacy signature keys.** Legacy coin ownership and shield authorization use Ed448; prover-seniority merges reference Ed448 keys; `keys.yml` still holds ed448, x448, decaf448 and bls48581 key types for older material; some client crates still depend on ed25519 and secp256k1 libraries.
- **Verification code for old proofs.** BLS48-581 and KZG code is kept in the repository so pre-epoch-1314 storage proofs can still be verified.
- **MetaVM tooling.** MetaVM still uses KZG polynomial commitments over BLS48-581 and BLS12-381 in its own proof system and its compute engine still lists classical verifiers (KZG, bulletproof, secp256k1, ed25519, ed448, decaf448). This is a separate subsystem from the node's consensus, state and storage proofs.
- **Anything on Ethereum.** wQUIL is an ERC-20, secured by Ethereum's own elliptic-curve cryptography. The bridge has not reopened, and its cryptographic details have not been confirmed from the repository.

So the accurate summary is: the node's consensus, identity, transport, state, storage proofs and token privacy are post-quantum; wallet legacy ownership, MetaVM tooling and the Ethereum side are not.

---

## Sourcing and Confidence

This document was compiled on 2026-11-03 by reading the Quilibrium monorepo directly at branch `v2.1.0.25` (head `0a08f0e4`): crate manifests (`Cargo.toml`), module-level source documentation and merged pull requests. An earlier version dated 2026-08-23 read the same branch before the October releases; this version supersedes it. Everything is cross-checked against Cassie's public announcement of the .25 branch in Discord on 2026-07-20 and the Discord node-updates and #general recaps of October and early November 2026.

**Confidence by claim:**

- **High** (read directly from code or merged PRs): Falcon for consensus signatures and peer identity, sntrup761 for transport and config keys, the three-tier JMT Merkle forest, the removal of `bls.rs`, Commonware simplex, the hash-based storage proof scheme and its activation at epoch 1314, QCT3 being the default and only token path with decaf448 token types rejected, the shield and shield-all commands and their activation frame.
- **Reported, not independently measured**: all performance figures (order-of-magnitude tree speedups, sub-second confirmation times, NTRU verification collapse). These come from the team's own announcement.
- **Not confirmed**: whether each remaining classical crate is on the consensus path; whether any independent audit of QCT3 exists; bridge cryptography.

**Known documentation lag.** Official documentation on docs.quilibrium.com has not been updated to reflect this migration. The monorepo's own `ARCHITECTURE.md` and the proof-backend README still contain pre-migration statements (for example "Verkle tree structures" and KZG proofs). So a document describing the old primitives is not necessarily a document anyone has reviewed and confirmed; it is more likely one that has not been touched yet.

---

*Last updated: 2026-11-03*
