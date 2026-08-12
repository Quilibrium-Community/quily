---
title: "QPing — Dispatch-Based Notification Service (live)"
source: official_docs_synthesis
date: 2026-08-12
type: technical_reference
topics:
  - QPing
  - notifications
  - push notifications
  - SNS
  - Amazon SNS
  - is QPing live
  - dispatch
  - dispatch mechanism
  - pub/sub
  - BlossomSub
  - webhooks
  - Q Console
---

# QPing: Dispatch-Based Notification Service

**Status: live.** QPing is a **Q Console managed service** you can provision and use today. Its AWS equivalent is **Amazon SNS** (partial). See [Quilibrium Service Classification](../Quilibrium-Service-Classification.md).

**Primitives used:** the dispatch mechanism.

## What QPing Does

QPing is Quilibrium's notification and event dispatch service. It is built directly on the **dispatch mechanism** -- the same underlying primitive that powers real-time messaging in Quorum Messenger.

The dispatch mechanism is the protocol-level pub/sub infrastructure that handles asynchronous message delivery between participants on the network. QPing exposes this as a managed service for sending notifications, event alerts, and lightweight signals between services or to end users.

## How QPing Relates to the Network

The dispatch primitive operates at the network layer using Quilibrium's BlossomSub gossip protocol (a modified GossipSub variant) combined with the mixnet for privacy. When an application publishes a notification through QPing, the dispatch mechanism routes it through the network's pubsub infrastructure to the intended recipients.

Key characteristics of QPing:

| Property | Detail |
|----------|--------|
| **Underlying primitive** | Dispatch mechanism |
| **Transport** | BlossomSub gossip protocol + mixnet |
| **Privacy** | Messages are encrypted; only recipients with appropriate keys can read them |
| **Latency** | Near real-time, subject to network routing |
| **Use case** | Push notifications, event alerts, webhooks, system signals |

## QPing Use Cases

- **Application event notifications** -- Alert users or services when a specific event occurs (e.g., a new message, a completed transaction, a storage upload)
- **Webhook-style triggers** -- Trigger downstream processing when upstream events happen
- **System health monitoring** -- Dispatch heartbeat or status signals between services
- **QNS integration** -- The QNS update includes the ability to message the owner of a particular name using the underlying dispatch primitive that powers Quorum, which is the same primitive QPing builds on

QPing is intentionally lightweight. For buffered, ordered, guaranteed-delivery messaging, use QQ instead.

## QPing vs QQ: When to Use Which

Both are live Q Console services. See [QQ](QQ-Message-Queue.md) for its side of this.

| Criterion | QPing | QQ |
|-----------|-------|-----|
| **Delivery model** | Push-based (dispatch to subscribers) | Pull-based (consumers poll or long-poll) |
| **Ordering** | Best-effort ordering | Strict FIFO guaranteed |
| **Persistence** | Transient; fire-and-forget | Messages stored on hypergraph until dequeued |
| **API compatibility** | Quilibrium-native | Amazon SQS (~100%) |
| **Best for** | Real-time alerts, event notifications | Reliable task queues, decoupled microservices |
| **Underlying primitives** | Dispatch only | Hypergraph + dispatch |

In practice the two are complementary. A common pattern is to use QPing to notify a consumer that work is available, then have the consumer pull the actual work item from a QQ queue.

## Accessing QPing

QPing is accessible through **Q Console**, Quilibrium's unified management interface for managed services. Q Console provides a web dashboard for managing notifications, REST APIs, integration with QKMS for secure signing, cross-account asset sharing, and fiat or QUIL/wQUIL payment options.

---

*Last updated: 2026-08-12*
