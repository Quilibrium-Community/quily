---
title: "State of the Union: MegaRPC, MetaVM, HyperSnap, and the Road Ahead"
source: youtube
youtube_url: https://www.youtube.com/watch?v=2735398195
author: Cassandra Heart
date: 2026-03-30
type: livestream_transcript
topics:
  - roadmap
  - mpc
  - security
  - architecture
  - node-operation
  - q-console
  - q-storage
  - qns
  - quorum
  - qkms
  - tokenomics
---

## Business Updates Overview

> **Historical context (March 2026):** This stream covers the state of the protocol, business development progress, and newly released tools as of late March 2026.

Today is a State of the Union for the protocol, covering the larger objectives being pursued as a company and as the protocol, and the development that has happened. There have been some good business development wins in recent history. The themes have been around key management, specifically multiparty key management. Companies working on various wallets, crypto wallets, digital asset management in general across a couple of different categories including gaming. There is also the Farcaster fork, and on the web hosting front, there are stats to share as part of the dev updates.

The two big obstacles, both as a company and as a development team, have been: one, the Quorum Mobile beta hasn't received an update in a while because the latest update is going through Apple's App Store approval. That process is very nitpicky, and they will reject your update based on one small thing. There have been a few cycles of those small rejections, and the hope is to be on the other side of it and see the update appear in App Stores as soon as possible.

The other obstacle, related to the protocol, is completing the shard-out process that unlocks all of the primitives of the network and releasing applications directly on the network instead of on an alt-fee basis. Discord also announced rolling out age verification, which has been relevant to the Quorum Mobile timeline.

## Development Updates: Node Releases

> **Historical context (March 2026):** Versions 2.1.0.18 through 2.1.0.21 had already shipped by the time of this stream. Version 2.1.0.22 was in progress. For current node version status, see the Monorepo Release Notes and dev-updates Discord channel.

Since the last stream, there have been four node updates, with a fifth on the way. Quorum Mobile has been sent off for App Store approval and has had two rounds of rejections.

A rejection from Apple doesn't mean they don't want the product on their App Store. It means there's a specific subsection of their policies that needs to be followed. In this case, it's been around user-generated content. Quorum Mobile, at its core, is a decentralized and encrypted chat service, similar to Signal. Signal doesn't have things like user reporting because they don't collect data about users besides phone numbers, so it's not easy for them to handle reporting. Similarly, for direct message support or private group chat support, there isn't the ability to handle reporting in the same way. But the update includes a Space Explorer where users can look at public spaces for chats they could join, and that's where user-generated content reporting becomes necessary. If somebody has a public space on the Space Explorer and they violate the App Store's policies, that has to be addressed, otherwise Apple will remove the app from the store.

Alongside the App Store process, there has been the fork in the Farcaster community. Klearu was also released, which is the MPC machine learning framework, runtime, and inference library. And MetaVM was released, which is the zero-knowledge and MPC-in-the-head proof runtime for virtual machines.

## Version 2.1.0.18 Release

Since the last call, 2.1.0.18 was on the precipice of a release and has since been released. It had a lot of useful features, and some were really important to rolling out other services. The first is the alt-fee-basis app shards. That's how services can be launched while the shard-out process for the QUIL token itself is still being resolved.

There were also bug improvements to the proxy pub-sub support. If a node is in a specific configuration where all the workers can't listen on individual ports, for example behind a residential ISP that provides maybe one to four port forwards on a router, there's a proxy layer that can run on the master process. It dispatches all the messages to the worker processes through that proxy instead of having independent listeners.

There were also changes around how seniority merge and how seniority itself was calculated and updated on the network. The update included two really important things for subsequent services:

**Direct mode for Ferret.** Ferret was previously set up to spin up an RPC listener and then delegate traffic to it. But for some tools it's much better and faster to have exposed buffer access to memory instead of going through the RPC layer. Direct mode was added for that purpose. Ferret is a library for providing multiparty computation. It provides one of the fastest ways to create garbled circuits, which is a way for multiple computers to work together and calculate things securely. The inputs going into the functions are private to the people providing them, and despite the computation being shared between multiple parties, those inputs are not revealed.

**DKLS23 support.** DKLS23 is an extension of DKLS18 and DKLS19. Those were two-of-n threshold MPC implementations of the ECDSA signing algorithm, which is what Bitcoin, Ethereum, and many other networks use for public key signing. DKLS23 makes it much faster and more efficient to do multiparty threshold signing.

## Version 2.1.0.19 Release

There were some bootstrapping issues found around this time, specifically in how the pub-sub layer reaches out to peers that maintain a distributed hash table of all other peers in the network, functioning as a phone book. External tools were added to understand and interpret the state of the network.

## Version 2.1.0.20 Release

This included faster build tricks on Docker images. Huge thanks to Hamoud. Builds were taking between one and two hours, and this dropped them down to about 15 minutes. It also had additional logic around the proposers, the automated shard selection algorithm for nodes. Support was added for calculating leaves so that workers will choose to leave shards that are less advantageous than others. This is less important now but will be very important as shards are added to the network. Smaller bug fixes were also included.

## Version 2.1.0.21 Release

This included the release of QClient because all the protocol messages were set in stone. It also added support for immediate rejections: instead of having to wait the full 360 frames, a shard can be proposed, joined, and then immediately rejected if it's not the right one. Same with leaves. Smaller bug fixes were also included.

## Version 2.1.0.22 In Progress

The release currently in progress includes bug fixes to the prover management as part of QClient. It also covers some eviction-related bugs around coverage halt timeframes, and a bug fix for seniority mergers themselves. If a node had joined a bunch of shards and wasn't planning on leaving them, the seniority merge message, if one needed to be emitted, was sometimes not actually getting incorporated.

### Bandwidth Reduction

The most important item in 2.1.0.22 is cutting down on bandwidth. One of the protocol dev team's goals is to make sure nodes can run in a residential environment. Some people reported a 90% reduction in global level traffic, which is great. But once provers were up and running, bandwidth consumption was very high, around 300 to 400 megabits per second, essentially breaking routers and preventing any other internet use while the node runs. That's not acceptable; bandwidth behavior needs to be much more predictable.

On the global side, the change was in how messages were sent to provers at the global level and how much traffic actually needs to go on the PubSub layer versus just RPC calls. Frame data, message data for global level messages, all of that was converted into RPC calls, which cut traffic by about 90%. The same optimization will be applied to workers. That will be in the next update to the 2.1.0.22 branch and should in theory be the last thing needed before the release is out the door.

## Network State

> **Historical context (March 2026):** Network state snapshot from March 30, 2026. These numbers change frequently. For current shard coverage and node counts, check the latest dev updates or Discord announcements.

About 256 shards are currently in halt risk, meaning they have less than three active provers on them. Needs coverage has improved quite a bit, at 536 shards with less than six active provers. That doesn't cause a network halt, it just means more coverage is needed. Healthy shards are at 2,306.

## Running Nodes Without a Public IP

Currently, running a node requires a public IP. The reason for this requirement is that there are around 408 active addressable public nodes. If too many people run with inaccessible nodes where ports are not accessible, and the proportion of private-addressed traffic becomes too high, there will be painful issues around consensus halts and getting messages to pass through the network.

One planned improvement, though not in the 2.1.0.22 release, is leveraging the libp2p relay functionality. If somebody wants to run a relay node, they run a node with a special flag that tells the network bootstraps: "I have a public IP, I'm willing to transport traffic on behalf of others." Then people who want to run on a private IP address behind a residential ISP can transport traffic through the relay. Technically, this is available today and someone could run a relay right now. But it's not being promoted as the common approach because in the early 2.0 days, private IPs were causing huge problems. That's why connectivity tests were added, to cut down on improperly configured nodes.

## MegaRPC: Privacy-Preserving RPC Service

MegaRPC is a privacy-preserving RPC, specifically in the context of other networks like Ethereum and Solana. When users interact with public RPC services, there are basically three major providers on the Ethereum side and they are all centralized. These centralized RPC providers make it easy for someone developing a wallet or an app to query balances, transaction history, and similar data without running a full node.

Running an Ethereum node requires about a terabyte of storage using the snap method. Most people won't run one since it doesn't make financial sense if they only need to query a few addresses and tokens.

Similar to public RPC providers like Alchemy and Infura, MegaRPC is a managed service being exposed on Q Console. It's not on Q Console yet, but the actual RPC is running live and is already being used in Quorum Mobile.

The key difference is how these RPC behaviors work. When tooling calls out to an RPC, there are standard calls like `eth_getFilterLogs`. Those calls get translated into oblivious RAM-based queries. When talking to MegaRPC, the communication is not in the standard RPC format but in an ORAM-based query format.

The privacy implication is significant. Take Alchemy or Infura: when connecting to those RPCs, two important things are provided from a privacy standpoint: an IP address and a wallet address. That links those two things together. Wallets like MetaMask and Rainbow, when being used, tell the provider who you are and what addresses you're using.

MegaRPC doesn't collect IP addresses and doesn't know what was queried. Even though running a web service technically allows logging IP addresses (and if you don't, someone else along the path could), MegaRPC uses ORAM-based queries. The approach is: "here's a thousand different things I could possibly be querying, and I'm going to give this in a cryptographically secure format that tells you what I want without you knowing what I want."

Some wallet teams have been approached about adopting MegaRPC. Some are not interested because they actually want the analytics. Nevertheless, it is the first RPC service that can't be evil.

> **Historical context (March 2026):** MegaRPC Q Console access was expected to launch the week of March 30, 2026. For current availability, check Q Console directly.

### Censorship Resistance and Alternative Transports

A question was raised about hiding IP addresses across the entire network for censorship-resistant communication in countries like Iran. The problem in Iran right now is that they are blackholing internet traffic and have shut off internet access.

One of the strengths of libp2p as a library is its pluggable transports. This means unconventional transports can be supported, including LoRa (long-range radio, not to be confused with the machine learning term). LoRa works at significant distances with low bandwidth, and there is a way to plug it into libp2p.

If somebody wants to run a broker node that utilizes the onion routing feature, people with long-range radios in Iran could connect through it to broker traffic. People suffering under oppressive regimes could freely communicate without creating a digital trail since it happens over radio waves. Radio waves can be triangulated, but if one person creates that radio brokerage point and it's spread out across other forms of hardline connectivity, that eliminates the gap. One or a few choke points might be of concern, but it becomes much harder with the actual sprawl and connectivity of a mesh network.

Traffic brokering through alternative routing schemes like radios or Bluetooth is possible, and there are already plugins for libp2p. PlanQ wrote a test that used libp2p's WebSocket adapter to see if the WebSocket feature would work without any additional changes to the node software, and it did. That demonstrates how the abstractions of libp2p can lead to useful extensions with minimal effort.

## QNS Updates

The Quilibrium Name Service has had some smaller bug fixes. There were issues around auctions and offers, and some people tried to take advantage of that functionality. Transactions that should not have occurred will be reprocessed.

QNS has switched to the new privacy-preserving MegaRPC. There was also a UI redesign, with major credit to Lamat for his design work on QNS and Q Console.

## Quorum Mobile Update

> **Historical context (March 2026):** Quorum Mobile was pending App Store approval at the time of this stream. For current app availability and features, check the App Store or recent Discord announcements.

Quorum Mobile is going through App Store approval. Apple has been the main problem, and every time an update is required for the Apple release, the same update is made for the Android release, which resets the clock each time.

Key features and improvements include:

**Space Explorer.** This lets users find other public spaces to join.

**Performance improvements.** The app is significantly faster. The entire JavaScript/React Native trampoline that provided access to the cryptography primitives for encryption and decryption of messages was moved to the native side. The native side is now completely responsible for handling messages, which eliminated the worst performance gap. Changes were also made to how lists are represented in the application. Memoization was added throughout so that UI components don't re-render every time a new message comes in.

**Public profile support.** Users can have a public profile with a public profile picture and expose wallet addresses so others can find how to pay them easily. The approach is to never assume anything about what users want to expose. Users are never opted in to anything automatically; everything requires manual opt-in. This sometimes means the UI won't be the simplest, but privacy is always the default.

**Notification support.** The App Store release includes proper notification support.

## HyperSnap: The Farcaster Fork

> **Historical context (March 2026):** This describes events from January 2026 onward regarding the Farcaster ecosystem fork.

Around January, the company that was primarily responsible for the development of Farcaster and the client, which was also named Farcaster (which helps nobody), announced they were shutting down and selling all of their resources to Neynar. Neynar was, at the time, a service provider for API access to Farcaster data. They had an AI integration with Farcaster, webhooks, and an app studio tool that made it easy for developers building mini apps on Farcaster.

### Quorum as a Farcaster Client

Quorum is also a Farcaster client. The feed feature uses the Farcaster protocol. If you're plugging in your Farcaster wallet, you will have access to your wallet's funds as a secondary address on your wallet. Quorum also added support for direct messages that exist only on the Merkle/Neynar Farcaster API. They're not actually part of the protocol. Farcaster was added because even while it has dramatically decreased in daily active users, it remains one of the most powerful decentralized social media protocols in terms of gaining traction with developers. They're a very special group, almost like a club, where a lot of people are early adopters, they're naturally curious, and they're exceedingly kind, which is also why Q kind of got the "Christian rap" moniker associated with it.

### The Proof of Authority Problem

One of the problems was in the early development of Snapchain, which is the protocol of Farcaster. It uses proof of authority, meaning only the explicitly noted nodes in the authority set are allowed to be validators in the network. At the time, Cassandra was on the Merkle team, and that was an objection she had. There were the same objections when they used hubs. With hubs, it was moved to permissionless. The argument was that proof of authority would be used as training wheels and then they'd move on to something that's actually decentralized as the consensus model.

### The Validator Dispute

When Farcaster sold, Neynar decided that they were not going to prioritize decentralizing the validator set. The Q team had been running a node as a validator, but not a public one; it wasn't part of the authority set. There was a longstanding PR, dating back to late November or possibly early December, offering to be a validator to help decentralize the set at least somewhat more than at the time was just Merkle and Neynar. The Merkle team said they would discuss it in the new year since everyone was out for the holidays.

January rolled around and the news came out while Cassandra was on Good Morning Farcaster. Neynar was taking over for Farcaster. There was a genuine belief that it was a good fit because they'd already been building tools that helped people use Farcaster. But subsequent actions forced a reevaluation of that position.

The open PR to add a validator was not accepted. Instead, they explicitly chose a private company with a private beta Farcaster client. Not as open as Quorum was able to be accessed; there was no public client. They ran their own validator. They were funded by VCs. And it felt really suspicious that a single phone call was all it took to add them when Q had an outstanding PR.

That was called out as unacceptable. That's not how things should work with a process for integrating PRs or making improvement proposals. Initially, the reaction was not super positive on either side, and Cassandra admits that herself.

At the end of that altercation, they agreed to add Q to the validator set. Q announced it would be part of the validator set and help steward the Farcaster ecosystem as peers of the network. The argument was also raised: their decision to centralize Farcaster contradicts the original vision. If it's centralized, why don't we just use Twitter?

On the concept of "sufficiently decentralized": that's a terrible term, and it should have never existed. It's just a buzzword that makes people feel good about the fact that it's still centralized.

Regardless, Q got that agreement. Literally less than 12 hours later, a message came early in the morning saying they had changed course: "Go ahead and fork."

### The Fork and HyperSnap Governance

So Q forked. Since then, there have been a couple of HyperSnap releases. One about to be released makes the setup process for running a HyperSnap node just as easy as it was for Snapchain, with a dedicated Docker organization.

It's important to understand that while Quorum uses HyperSnap and Q Managed Services tap into it in ways that are useful for writing software, HyperSnap itself is not just Q. There is explicitly one person from Q Inc. in the HyperSnap organization; the rest are other members of the Farcaster community. That setup is very important because Farcaster does not succeed with a single corporate benefactor. It does not succeed with a single corporate steward. It requires multiple people congregating on that front. That's the way the fork is organized and the way it's moving forward.

### HyperSnap and Q Network Integration

HyperSnap runs as an alt-fee basis shard so that proofs can be incorporated onto the Q network. If somebody uses Q Storage to host files for images, an embed can be created that works on Farcaster. There are many mutually beneficial things from HyperSnap being adjacent to the Q ecosystem.

## MetaVM: Zero-Knowledge Virtual Machine

MetaVM is the first full hardware 64-bit RISC-V VM that works in zero-knowledge. There are other 64-bit RISC-V CPU VMs that run in zero-knowledge, like Jolt from a]16z, which uses a slightly different approach with strictly MPC lookup tables. But architecturally, the end goal is the same: to run a VM in zero-knowledge.

What differentiates MetaVM is that it allows proving execution at the hardware level of the entire OS stack. If running Linux with a web server, or running Doom on Linux (which has already been demonstrated), it allows proving from the initial boot all the way to the chosen stop point of execution that everything was done correctly and followed the exact explicit steps of compute required. The output of proving the full OS and hardware execution is less than approximately 1.5 kilobytes for the total proof size.

MetaVM also supports the Ethereum Virtual Machine and Solana's eBPF extensions. The proof outputs are supported by both Q and Ethereum.

The Ethereum ecosystem is discussing their roadmap and wants to move to a RISC-V virtual machine. They're talking about a 32-bit RISC-V VM. But this is still theoretical for them. Companies like Succinct have worked on these problems and are promoting their solutions. What Q has achieved is more in-depth: full hardware virtualization with full support of proving it all the way through running an OS. No one else has done that.

If the Ethereum ecosystem does want to move to RISC-V, they could adopt MetaVM. It's completely compatible with the proof system that already exists in Ethereum today. A smart contract could be launched on Ethereum that uses the BLS12-381 point evaluation and pairing functions, and the proof can be evaluated on a smart contract today, supported out of the box.

For Q's managed services, MetaVM enables AWS-compatible services like Lambda (FFX), EC2, ECS, and EKS. The aim is general compute and web services provisioning, with the flexibility for much more.

## Klearu: MPC Machine Learning Framework

Klearu is the MPC machine learning framework, runtime, and inference library. It has been released since the last stream.

## Tech Tree and Roadmap

The tech tree visualization shows all nodes that have been developed and released in some format. "Released" doesn't mean done or that there's no more development to do, but that it's already available and people can use it.

The center set of nodes covers a few categories: Quorum (the messaging and social platform), the node software and protocol, the crypto intrinsics shared by practically everything Q builds, and recently lit-up nodes including Klearu, MetaVM, the EVM shard (which is part of MetaVM), and HyperSnap.

Nodes that are not lit up are things that haven't been released yet, and those represent where Q is going and what's being built. The tech tree is the easiest way to understand the scope of what Q is aiming for.

### Quorum Roadmap

For Quorum, there is support for many apps, notifications (included in the App Store release), and the basic functionalities the application and protocol need. The items in development are video calls, voice calls, and group wallets.

### QKMS and Web Services

QKMS is the distributed key management service. Web services is the biggest hub on the tech tree, with all the spokes pointing to it. If you're familiar with Amazon Web Services, the categories are the same: machine learning, network and content delivery, compute, application integrations, storage, and more. Every grayed-out dot on the tree represents a target. Every single day, work continues to light up the entire chart. When that's complete, that represents the first generational version of the network.

In terms of what's already released, there's QNZM (the equivalent to IAM), QKMS (key management), QNS (essentially Route 53), QQ (SQS-compatible), QPING (SNS-compatible), and Q Storage (S3-compatible). The scope is extensive.

### QNS and Q Storage Linking

QNS and Q Storage linking technically already exists on the back end. The front end needs to be updated to allow users to set up those relationships, but it has been baked into QNS from the very beginning. QNS can resolve to anything, though the current UI shows resolving Quorum public keys. It can absolutely resolve to Q Storage content.

When QNS resolves to Q Storage content and the content is in a public bucket, Quorum's browser uses onion routing when navigating to a .Q name. Traffic is routed through the network so it never passes through clearnet. Nobody can identify what was requested or the size of what was requested. Multiple safeguards protect privacy and ensure there's no linkability. This is crucial to user privacy, especially as service providers continue to prove why it's dangerous to trust data with centralized entities.

## Q&A: Mainnet Status and Shard-Out

> **Historical context (March 2026):** This describes the mainnet and shard-out status as of March 30, 2026. The token shard coverage halt was still active at this time. For current mainnet status, check recent Discord announcements.

> **Shard coverage thresholds:** The network has three shard coverage levels. **Halt risk** = fewer than 3 active provers (network halts, token shards locked). **Needs coverage** = 3–5 active provers (network continues, transactions can proceed). **Healthy** = 6+ active provers (ideal, maximum resilience). The network activates when all shards are out of halt risk (≥3 provers); it does NOT require all shards to be healthy.

A question was asked about whether the mainnet could still go down after the shard-out phase is complete.

Technically, mainnet is running right now. The rules applying for coverage halts are the same rules that get enforced later on. The token shards are what's blocking everything else because everything else relies on fee-based transactions. However, alt-fee-based transactions are completely valid right now, and that's why Q services can already be launched.

The difference is that when the coverage halt is resolved, if one of the shards counted for coverage loses its coverage, there is a period of time where the network will not halt immediately but will warn, so that people can add coverage to those shards.

## Vision and Mission

The goal of Quilibrium is to protect every single bit of traffic on the internet. The targets are very public and transparent. Q is pursuing a decentralized, secure web services platform. It's building an everything app that enables people to do all the things possible in something like WeChat, but privately. The aim is to make it so that every person with even slight development skills can make really powerful private tools that can help everybody with whatever the aims of those products are.
