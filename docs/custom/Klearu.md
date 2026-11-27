---
title: "Klearu: E2EE ML Primitives and Runtime"
source: github_readme + discord
author: Cassandra Heart
date: 2026-11-27
type: technical_reference
topics:
  - Klearu
  - private inference
  - two-party computation
  - 2PC
  - SLIDE
  - LLM
  - machine learning
  - E2EE
  - CPU inference
  - quantization
  - distributed inference
  - MPC
  - FHE
  - privacy
  - run AI on Quilibrium
  - AI on Q
  - train LLM
  - AI inference
  - current status
---

# Klearu: E2EE ML Primitives and Runtime

## Availability

Klearu is Quilibrium's publicly available Rust toolkit for machine learning. Developers can build it from source and experiment with local text, image and video workloads and a separate two-party private LLM inference path. Quilibrium's November 21, 2026 roadmap targets Klearu as a mainnet intrinsic in 2.1.1. That target describes future protocol integration. The repository provides a standalone runtime today, with mainnet deployment and managed Q Console access unconfirmed. [November roadmap livestream](https://www.youtube.com/watch?v=OppCHV3tsHw)

## Models and local tools

Klearu started with the SLIDE family of sparse learning methods and grew to include transformer inference, vision encoders and generative media. The LLM runtime includes LLaMA-compatible models and additional architecture-specific support such as Qwen3.5. Model loading depends on the architecture and checkpoint format. The CPU runtime includes AVX2 and NEON acceleration, BF16 support and optional transformer sparsity. Parts of the media stack also have Apple Metal GPU paths.

The public diffusion code includes FLUX and HiDream image generation. The October 30 update adds Krea 2 image generation, Wan 2.2 video generation and corresponding desktop paths. Upstream includes model-specific tests, some requiring local model weights. A supported local runner does not establish that the same model can run over private two-party computation or on mainnet. [October upstream changes](https://github.com/QuilibriumNetwork/klearu/commit/0dde9f6)

The November 15 update adds a `token_similarity` CLI and library support for comparing cosine similarity between a model's input embeddings. It accepts text or token IDs, loads embeddings from local safetensors and averages the vectors when an input contains multiple tokens. This measures similarity in the model's input embedding table. [Token similarity implementation and tests](https://github.com/QuilibriumNetwork/klearu/commit/11cfacd)

## Training and private inference

Klearu includes SLIDE sparse-network training and an experimental image-transformer training and sampling toolkit in `klearu-image`. Its data-parallel trainer runs worker threads on one machine. The module also describes a multi-machine design. Quilibrium reported training and experimenting with an internal image model in November. General LLM training as a service and distributed private image training on mainnet remain outside the demonstrated public capabilities.

Klearu's private LLM inference crate implements a client-server two-party computation (2PC) protocol using Ferret oblivious transfer and an oblivious pseudorandom function (OPRF). The aim is to keep the client's inputs and outputs private from the evaluating server under the protocol's assumptions. The repository documents different leakage and communication costs by mode. Its lower mode description includes a plaintext forward pass after revealing the client embedding. The high mode description lists exposure of norms, queries and gate values. Performance depends on model, mode and hardware. Local inference, including the desktop app's media features, does not automatically use this protocol.

## Building and licensing

The Cargo workspace manifest lists 17 members, including the Tauri app. Major components include `klearu-llm` for text inference, `klearu-vision` for vision models, `klearu-diffusion` for media generation, `klearu-image` for image-transformer training, `klearu-private` and `klearu-mpc` for private computation, and desktop, server and WebAssembly components. Klearu uses AGPL-3.0 with additional terms, including a restriction on commercial use outside Quilibrium mainnet. [Klearu repository and build instructions](https://github.com/QuilibriumNetwork/klearu)

To run the macOS desktop app from source, install Xcode, Rust and Node.js with npm. Clone `QuilibriumNetwork/klearu` and `QuilibriumNetwork/monorepo` as sibling directories so Cargo can resolve the Ferret dependency. From the Klearu checkout, run:

```bash
cd web
npm install
npm run tauri:dev
```

The desktop script starts Tauri in release mode. Download the weights and other files required by the model you want to run.

*Last updated: 2026-11-27*
