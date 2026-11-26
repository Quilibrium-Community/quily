---
title: "Do Apps on Quilibrium Wait for Frames? Frame Time vs App Latency"
source: Synthesis of existing knowledge-base docs (Communication Layer, How Fast Is Quilibrium, Epochs and Frames, Mainnet Status, API Credentials) and the 2025-04-04 livestream; written after a Discord Q&A on 2026-11-26 where the bot wrongly said every post must wait for a frame
date: 2026-11-26
type: technical_reference
topics:
  - do apps wait for frames
  - do posts wait for a frame
  - frame delay
  - 10 second frame
  - frame time vs latency
  - is everything published every 10 seconds
  - real-time apps on Quilibrium
  - real-time posts
  - live updates
  - social media app on Quilibrium
  - social network built on Quilibrium
  - social app
  - posts and comments
  - chat app latency
  - are frames necessary without transactions
  - does every message go through consensus
  - what are frames for
  - frames save history or validate
  - ephemeral messages
  - ephemeral messaging
  - not stored on-chain
  - off-frame
  - what goes through frames and what does not
  - does an app have to be peer-to-peer
  - is every Quilibrium app peer-to-peer
  - Quilibrium as a cloud backend
  - QStorage latency
  - application latency
  - finality time
---

# Do Apps on Quilibrium Wait for Frames?

## Short Answer

**No. An app built on Quilibrium does not show content on a 10-second timer.** A frame (about 10 seconds on mainnet at the moment, an observed network condition rather than a fixed constant) is the network's step for **agreeing on and recording shared state**. It is not a refresh clock for what users see.

What waits for a frame depends on what the app does with the data:

| What the app does with the data | Waits for a frame? | Example uses |
|---|---|---|
| Writes it to network state (stored on the hypergraph) | Yes. It settles when a frame covers it. Finality is roughly **200 ms to 10 s** | Posts kept permanently, profiles, follows, ownership records, token moves |
| Sends it as an **ephemeral message** (not stored) | No consensus frame involved | Live chat, typing indicators, live comments, notifications |
| Serves it from a cloud-style service such as **QStorage** | Reads do not wait on a frame. The team targets **tens of milliseconds** response times | Media, static content, files |

Frame interval, transaction finality and application latency measure **different things**. Operations that do not wait for a consensus frame have their own latency. ([How Fast Is Quilibrium](How-Fast-Is-Quilibrium.md))

**Status caveat:** applications from outside developers are not yet open on mainnet (see [Mainnet Status](Mainnet-Status-What-Is-Live.md)). Everything below describes how the network is designed to be used, not a platform you can deploy a social app on today.

---

## What Frames Are For

Frames are how Quilibrium's provers agree on the order and contents of state changes. Each frame is a state transition: `State(n) + Transactions(frame_n) = State(n+1)`. Once a frame reaches consensus it is final, with single-slot finality under normal conditions ([official consensus docs](../quilibrium-official/protocol/consensus.md)).

So frames do two jobs at once: they **validate** state changes and they **record** them. These are not separate purposes. A frame matters for data that needs to become part of the network's shared, agreed state. Data that never needs to be in shared state does not need a frame.

"Transaction" here means any change to network state, not only payments. Storing a post permanently on the hypergraph is a state change, even if no money moves. That is why "my app has no payments" does not on its own mean "my app never touches frames". What matters is whether the app **stores** the data on the network.

---

## Ephemeral Messages: Real-Time Without Frames

Quilibrium's communication layer supports three tiers of data permanence ([Communication Layer](gap-analysis/Communication-Layer-E2EE-Mixnet-P2P.md)):

| Tier | Storage | Use case |
|------|---------|----------|
| **Permanent** | Stored on the hypergraph indefinitely | On-chain state, identity records |
| **Time-limited** | Stored on the hypergraph with an expiration | Temporary data, cached computations |
| **Ephemeral** | Not stored. Propagated through BlossomSub only | Real-time messaging, live communication |

Ephemeral messages travel through the network's messaging layer (BlossomSub, Quilibrium's gossip protocol, optionally through the RPM mixnet for metadata privacy) **without being stored on the hypergraph**. They exist only in transit and in the recipient's memory. This is what makes real-time features like chat possible without waiting for a frame and without leaving a permanent on-chain record.

The mixnet is built to handle millions of messages in real time with no perceptible impact on user experience.

---

## An App Does Not Have to Be Peer-to-Peer

Quorum, Q Inc's messenger, is peer-to-peer: users' devices connect over the libp2p stack with no central server. That is one way to build on Quilibrium, not the only way.

An app can also use Quilibrium **like a cloud backend**. The Q Console services are live today and are designed as drop-in replacements for their AWS equivalents:

- **QStorage** is S3-compatible. Existing S3 clients and SDKs work by changing the endpoint. The team has said it aims for response times in the **tens of milliseconds**, using layered caching (2025-04-04 livestream).
- **QKMS** (key management), **QQ** (SQS-compatible queues) and **QPing** (notifications) follow the same pattern.

Ephemeral messages are also not "peer-to-peer between users" in the sense of devices connecting directly. They are relayed by the network's nodes, so an app's users do not need to connect to each other.

**What the docs do not say:** how long a QStorage *write* takes to settle, or whether writes wait on a frame. The tens-of-milliseconds figure is about serving data. Do not quote it as a write or finality time.

---

## Designing a Social App: What Goes Where

For a social app on Quilibrium, the useful question is **"does this need to be kept in shared network state?"**, not "is this urgent?". Urgency is a product choice; storage decides whether a frame is involved.

| Feature | Likely tier | Frame involved? |
|---|---|---|
| Live chat, DMs, typing indicators, "user is online" | Ephemeral | No |
| Live comments during a stream | Ephemeral (optionally stored later) | No, unless stored |
| Notifications | Ephemeral or QPing | No |
| Posts and comments meant to be kept | Stored on the hypergraph | Yes, settles within about 200 ms to 10 s |
| Profiles, follows, handles (QNS) | Stored | Yes |
| Images and media files | QStorage | Reads served fast; write settlement not documented |

The table above is a design guide built from the documented tiers, not a published Quilibrium recommendation.

Quilibrium's application model is also meant to be as **conflict-free** as possible: independent actions by many users (for example, many people posting at once) can be processed in parallel rather than one after another (2025-04-04 livestream). Many users posting every second does not mean they queue behind each other.

---

## Common Wrong Answers

- **"Posts are published every 10 seconds."** Wrong. The frame is not a display timer. Only stored state settles on frames.
- **"Batching posts into frames gives more time for moderation."** Wrong. Frames are network consensus and have nothing to do with content moderation.
- **"Real-time publishing causes network congestion."** Not supported by the docs. The messaging layer is built for very high real-time volumes.
- **"Frames are necessary for any social app, even without transactions."** Wrong. Ephemeral data skips frames entirely. Only data the app stores in network state uses them.
- **"Hypersnap is a social app built on Quilibrium."** Wrong. Hypersnap is a separate network with its own token ($SNAP). See [Quilibrium, Hypersnap, $QUIL and $SNAP](Quilibrium-Hypersnap-QUIL-SNAP-Relationship.md).

For how frame time and epochs work, see [Epochs and Frames](Epochs-And-Frames.md).

---

*Last updated: 2026-11-26*
