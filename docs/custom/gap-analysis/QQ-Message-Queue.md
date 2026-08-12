---
title: "QQ — SQS-Compatible Message Queue (live)"
source: official_docs_synthesis
date: 2026-08-12
type: technical_reference
topics:
  - QQ
  - message queue
  - queue
  - SQS
  - Amazon SQS
  - FIFO
  - is QQ live
  - visibility timeout
  - Q Console
  - dispatch
  - hypergraph
---

# QQ: SQS-Compatible Message Queue

**Status: live.** QQ is a **Q Console managed service** you can provision and use today. It launched as part of Q Console in February 2026 alongside Q Storage, QKMS, and the Quark SDK. See [Quilibrium Service Classification](../Quilibrium-Service-Classification.md).

**Primitives used:** hypergraph + dispatch mechanism.

## What QQ Does

QQ is Quilibrium's managed message queue service, providing approximately **100% API compatibility with Amazon SQS**. A few minor differences exist due to architectural differences between Quilibrium and AWS, but the vast majority of SQS use cases are supported unless the application requires something extremely bespoke.

## How QQ Maps to Quilibrium Primitives

QQ is built from two core Quilibrium primitives:

| Primitive | Role |
|-----------|------|
| **Hypergraph** | Stores queue structure and messages as RDF graph data |
| **Dispatch mechanism** | Handles message delivery notifications to consumers |

Under the hood, QQ implements queues as **linked-list FIFO data structures** with parent references, stored as RDF schemas on the hypergraph. The core components are:

| Component | Description |
|-----------|-------------|
| Queue | The queue container with a reference to its head node |
| QueueNode | A single entry in the queue |
| HeadNode | Points from the Queue to its first QueueNode |
| NextNode | Links one QueueNode to the next (forming the linked list) |
| QueueMessage | The actual message payload attached to a QueueNode |

Messages are enqueued at the tail and dequeued from the head, maintaining strict FIFO ordering. Because queues are stored as RDF graph data on the hypergraph, they are persistent -- messages remain in the queue until dequeued. The QQ product provides standard visibility timeout and retention semantics on top of the underlying primitives, matching the SQS behavioral model.

## SQS API Compatibility

QQ maps standard SQS API calls to operations on the underlying queue primitives. Developers using existing AWS SDKs and tooling can point them at QQ's endpoint and operate as they would with Amazon SQS. The compatibility layer covers:

- Queue creation and deletion
- Sending and receiving messages
- Message visibility timeout management
- Message retention policies
- Batch operations
- Standard queue attributes and metadata

## QQ Use Cases

- **Microservice communication** -- Decouple producers and consumers across distributed services
- **Event-driven architectures** -- Trigger processing when messages arrive in the queue
- **Work distribution** -- Distribute tasks across multiple consumers for parallel processing
- **Notification pipelines** -- Buffer and order notifications (QPing uses QQ for ordered notification delivery)

## QQ vs QPing: When to Use Which

Both are live Q Console services. See [QPing](QPing-Notifications.md) for its side of this.

| Criterion | QQ | QPing |
|-----------|-----|-------|
| **Delivery model** | Pull-based (consumers poll or long-poll) | Push-based (dispatch to subscribers) |
| **Ordering** | Strict FIFO guaranteed | Best-effort ordering |
| **Persistence** | Messages stored on hypergraph until dequeued | Transient; fire-and-forget |
| **API compatibility** | Amazon SQS (~100%) | Quilibrium-native |
| **Best for** | Reliable task queues, decoupled microservices | Real-time alerts, event notifications |
| **Underlying primitives** | Hypergraph + dispatch | Dispatch only |

In practice, QPing and QQ are complementary. A common pattern is to use QPing to notify a consumer that work is available, then have the consumer pull the actual work item from a QQ queue.

## Accessing QQ

QQ is accessible through **Q Console**, Quilibrium's unified management interface for managed services. Q Console provides a web dashboard for managing queues, full SQS API compatibility, integration with QKMS for secure signing, cross-account asset sharing, and fiat or QUIL/wQUIL payment options.

QQ is part of Quilibrium's broader strategy to provide AWS API-compatible services, first outlined in the September 2024 roadmap. Its AWS equivalent is **Amazon SQS**, and it is **launched**. For the full service list and status, see [Quilibrium Service Classification](../Quilibrium-Service-Classification.md).

---

*Last updated: 2026-08-12*
