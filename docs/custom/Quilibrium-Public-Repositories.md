---
title: "Quilibrium Public Repositories"
source: Community Contribution (Issue #91)
date: 2026-07-29
type: technical_reference
topics: [github, repositories, source-code, open-source, sdk, quorum, qtools, monorepo]
---

# Quilibrium Public Repositories

Where to find Quilibrium source code. All repositories listed here are **public**.

Most core code lives under the [**QuilibriumNetwork**](https://github.com/QuilibriumNetwork) GitHub
organization, with community-run projects under
[**Quilibrium-Community**](https://github.com/Quilibrium-Community).

## Core Protocol

| Repository | What it is |
|---|---|
| [monorepo](https://github.com/QuilibriumNetwork/monorepo) | The main repository — Quilibrium protocol, supporting libraries, and light client (Go) |
| [klearu](https://github.com/QuilibriumNetwork/klearu) | Klearu — end-to-end encrypted ML primitives and runtime (Rust) |
| [metavm](https://github.com/QuilibriumNetwork/metavm) | MetaVM — ZK/MPC flexible VM framework, targeting RISC-V and EVM (Rust) |
| [balance](https://github.com/QuilibriumNetwork/balance) | Balance — the Quilibrium programming language (Rust) |

## Quorum Apps

**Quorum** is a fully private and decentralized group messenger, powered by Quilibrium and the
libp2p stack. It runs over TCP, QUIC, Websockets, or even LoRa, so it works across the traditional
internet, on local networks, or fully off-grid.

- Official website: [quorummessenger.com](https://www.quorummessenger.com/) — [FAQ](https://www.quorummessenger.com/faq)
- Web app (beta): [app.quorummessenger.com](https://app.quorummessenger.com/)

Quorum ships on three platforms, split across three public repositories:

| Repository | What it is |
|---|---|
| [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile) | Mobile client for iOS and Android, built with React Native + Expo |
| [quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) | Desktop client — an Electron wrapper around the web app |
| [quorum-shared](https://github.com/QuilibriumNetwork/quorum-shared) | Shared types, cross-platform UI primitives, hooks, API client, and Wasm-based E2E encryption used by both apps |

## Node Operator Tools

| Repository | What it is |
|---|---|
| [qtools](https://github.com/QuilibriumNetwork/qtools) | CLI toolkit for installing, configuring, managing, and monitoring Quilibrium nodes — service management, clusters, backups, diagnostics, gRPC queries (Shell) |

## SDKs

| Repository | What it is |
|---|---|
| [quilibrium-js-sdk-channels](https://github.com/QuilibriumNetwork/quilibrium-js-sdk-channels) | JavaScript SDK for Quilibrium channels |
| [quilibrium-rs-sdk-verkle](https://github.com/QuilibriumNetwork/quilibrium-rs-sdk-verkle) | Rust BLS48-581 Verkle Tree + RDF structured proofs implementation |
| [quilibrium-names-sdk](https://github.com/QuilibriumNetwork/quilibrium-names-sdk) | Quilibrium Name Service (QNS) SDK (Rust) |
| [qkms-sdk](https://github.com/QuilibriumNetwork/qkms-sdk) | Threshold MPC key management JavaScript SDK, backed by QKMS |

## Documentation

| Repository | What it is |
|---|---|
| [docs](https://github.com/QuilibriumNetwork/docs) | Source of the official documentation site, [docs.quilibrium.com](https://docs.quilibrium.com). Corrections to official docs should be submitted here. |

## Community Projects

| Repository | What it is |
|---|---|
| [quily](https://github.com/Quilibrium-Community/quily) | Quily — the AI chatbot answering questions about Quilibrium |
| [q-stream-recap](https://github.com/Quilibrium-Community/q-stream-recap) | Tooling for livestream recaps (Python) |
| [treasury-governance](https://github.com/Quilibrium-Community/treasury-governance) | Public working draft of governance documents for the Quilibrium Community Treasury |

## Related Projects Outside the Quilibrium Orgs

| Repository | What it is |
|---|---|
| [farcasterorg/hypersnap](https://github.com/farcasterorg/hypersnap) | Hypersnap — "Snapchain, made hyperdimensional" (Rust). Hosted under the `farcasterorg` organization, **not** under a Quilibrium org. |

## Notes

- Several read-only **mirrors** also exist under the QuilibriumNetwork org (mirrors of monorepo
  subfolders and of forked upstream stacks such as go-libp2p). They are not listed here because
  contributions should go to the source repository, not a mirror.
- Not every Quilibrium project is open source; some repositories are private. If a repository is not
  listed here, it may simply not be public.

*Last updated: 2026-07-29*
