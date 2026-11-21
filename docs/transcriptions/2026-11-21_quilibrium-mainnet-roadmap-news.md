---
title: "Quilibrium Livestream: Mainnet Status, Post-Quantum Release 2.1.0.25, MegaRPC, Coppice and Roadmap"
source: youtube
youtube_url: https://www.youtube.com/watch?v=OppCHV3tsHw
author: Cassandra Heart
date: 2026-11-21
type: livestream_transcript
topics:
  - roadmap
  - architecture
  - mainnet
  - security
  - mpc
  - quorum
  - q-console
---

## Stream Agenda and Context

This livestream took place on 2026-11-21, on Twitter and Twitch. Cassie opened by saying it had been a while since the last livestream, because the Quilibrium team had been working hard. The agenda covered a recap of the 2.1.0.25 release, the status of mainnet (to clear up confusion about it), recent industry events that apply to the Quilibrium ecosystem, and the roadmap with an update on builders and partners.

The stream was split in two because Cassie had another business call to take, about 51 minutes after she mentioned it early in the stream. The second part, planned for a few days later, was to cover QConsole and launching tokens live.

## Release 2.1.0.25: The Post-Quantum Era

Version 2.1.0.25 is a substantial release for Quilibrium for multiple reasons. It was a massive update to the way Quilibrium is developed, and it significantly changed Quilibrium architecturally and changed the security assumptions under which the protocol operates. Quilibrium has fully entered the post-quantum era.

On a foundational level, the Quilibrium team changed consensus, peer-to-peer communication, the way onion routing works, the way proofs work, and the storage that nodes use. The entire toolchain was rebuilt from the ground up in Rust, and the way confidential tokens work also changed in important ways.

## Consensus: From HotStuff to Commonware

In version 2.1.0.24 and before, Quilibrium used a customized version of the HotStuff BFT consensus algorithm. It was better than what Quilibrium had before, but it did not work great and caused the team a lot of headaches. The team stripped it out and used an open implementation that has been heavily vetted and battle-tested. This was done in multiple places inside the protocol architecture: anything that could be swapped for an off-the-shelf, battle-tested component was switched out, to be pragmatic and finally solve the headaches of mainnet.

Quilibrium switched from HotStuff to Commonware. A small modification was needed to get Commonware to support Falcon, because entering the post-quantum era also meant that many things were not ready for it. The same applies to libraries such as Commonware and libp2p: they are much more straightforward to understand if one is familiar with those libraries, and the changes are additions rather than re-implementations.

## Frames and Epochs

The legacy network had a constantly moving state that caused difficulties, especially around sync, and it showed up in many different ways. Quilibrium moved to an epoch-aligned approach. The network has frames at the global level and frames at the app shard level, and through them overall consensus is reached around the entire state of the protocol.

The global level manages the provers that register for app shards, and handles the entrance and exit of those provers. The target is roughly a 10-second frame time, because that is the best balance between responsiveness and durability under a very large volume of peers. A frame can be thought of as a 10-second tick, so 360 frames make an hour. Epochs are set to roughly two hours, which is exactly 720 frames.

This approach makes things easier both from a debugging level and from a node operator level, because it gives some predictability about when new shards will appear and when shards will split or merge to handle changes in prover numbers. That matters more and more as more things get deployed to the network, which the team is watching with eager and cautious eyes. Conceptually most of it stayed the same; what changed is the primitives that power it.

## Question: Is Falcon-512 Related to Falcon 9?

No. Falcon-512 is a signature scheme. Specifically, it is a post-quantum signature scheme that uses lattices.

## Networking and Post-Quantum Onion Routing

The previous transport architecture used a variation of libp2p GossipSub that used bloom filters in place of topics to distribute data through the network. There was also a separate streaming gRPC layer, so that individual connections for things like synchronization would not need to go over a pub/sub mesh, which would be very slow and expensive in bandwidth.

This was simplified a lot. Quilibrium still retains a pub/sub mesh layer and a gRPC streaming layer, but they now use off-the-shelf parts with some post-quantum additions tacked on.

Cassie tried to check whether Tor has made the leap to post-quantum yet. It turns out it has a little, but not really: the majority of Tor traffic still uses non-post-quantum cryptography. Cassie found this surprising. As of 2026-11-21, Cassie said Quilibrium is the first onion routing network that is post-quantum. She called that cool but also a little terrifying for Tor's sake, because if the goal is to be resilient against very persistent adversaries, one has to assume that store-now-decrypt-later attacks will be relevant to them. She hoped Tor will catch up.

## Stored State, Recovery and Sync

Quilibrium moved from KZG and Verkle trees to a hash-based Merkle forest. It is technically the Jellyfish Merkle forest; for those not familiar with it, it can be thought of as a bunch of Merkle trees. It is a bit more efficient and makes proofs smaller. The hierarchy has not changed: there is still the global layer, then the application layer, then the app shard layer, which culminates in global frames and app shard frames.

Because everything is now a Merkle forest, sync is a lot simpler to do and a lot easier to reason about. Anyone familiar with anything that uses Merkle trees for stored state in replication will feel right at home.

On the recovery side, archive nodes continue to be archive nodes and hold the entirety of the data on the network. In addition, there are now authenticated checkpoints that make it much easier to pick up and go, and a replay-based restoration that follows from those authenticated checkpoints.

## Provers and Proofs

Things changed a bit on the prover side. There is a new data availability proof model. It feels really similar to WindowPoSt for anyone who has used or researched Filecoin. Quilibrium now uses STARKs instead of ZK-SNARKs, which is an obvious choice when going post-quantum.

There is also some leeway in how provers can get their proofs to the network. If there are interruptions in traffic, or something gets in the way (which happens with mesh networks), there is more flexibility to ensure that people are appropriately rewarded.

## What Changed for Node Operators

As of 2.1.0.25, everything, even QClient, is in Rust. Building is much simpler, which makes life a lot easier for people who are rolling this out. There are new reachability checks and new diagnostics, covering everything from shard prover status to very detailed peer diagnostics for those who want to opt in. The philosophy with Quilibrium is that anything potentially sensitive, even just logs, is always opt-in rather than opt-out.

The Explorer was also improved: it is now shard-aware and there is a lot more data to work with. More developers have been coming on and adding things to the protocol, including on the Explorer side. Cassie said it was really exciting to see how quickly development ramped up in the past couple of months.

## What Changed for Wallet and Developer Tooling

There is better tooling for wallet transaction history. The confidential token proofs are now lattice-based, which wallet developers need to be aware of for key management purposes. State sync is a lot simpler and also more targeted to the data that a wallet developer cares about. Finally, everything is now under a unified toolchain.

## Mainnet Status

There has been some back and forth about the status of mainnet, mostly from detractors, and people who troll on Twitter will always troll on Twitter. But many people were not even aware that mainnet was fully live under any reasonable definition of liveness. Cassie stated that mainnet has been fully live for a while.

For version 2.1.0.25 specifically, stability of the network was achieved in late October 2026. As of that point all primitives are unlocked. The network already completed shard-out, and the actual splitting and merging of shards works without interruption. New things are deployed to the network all the time.

As of 2026-11-21, a couple of hours before the stream, there were 322 dedicated provers on the network. That number was growing: it had basically doubled in the previous couple of days, and Cassie expected that to continue as people learn. At the time of the stream, the frame rate was a little slow, at about 16 seconds per frame, against a 10-second target. Cassie said there are good reasons for that and that she would get into them (see the 2.1.0.26 section). The Quilibrium team continues to work on improving the frame rate. Throughput itself increases over time as more and more provers are dedicated to more and more shards of the network.

## Industry News: The Binance Hack and Hot Wallet Operations

Cassie discussed the Binance hack at the end of October 2026. According to her, about 6.3 billion dollars of crypto assets were exfiltrated from Binance. What she found more striking was a single line in Binance's initial investigation noting that a compromised DevOps engineer's laptop is what enabled the attack.

Cassie said this matters for Quilibrium because it gets into the things Quilibrium is solving, why the network is important, and what people can use from it to get a greater degree of security posture in terms of privacy, secrecy and safety. She wrote an article that she posted on Twitter explaining how to do hot wallet operations correctly. In Cassie's view it is very clear that Binance did not do this correctly: if they had, a single DevOps engineer's laptop being compromised would not be sufficient to take 6.3 billion dollars of assets.

The article includes a diagram detailing how operations are compartmentalized across people, DevOps, and the different verticals of exchange management, giving a good degree of separation. Cassie said this comes from her experience working on the core cryptography team at Coinbase. It is not exactly what Coinbase does, and she would not describe exactly how they do it, but it is pretty close, and probably a little more paranoid, for good reason: when dealing with billions of dollars in assets one cannot help but be extremely paranoid.

## QKMS: Multi-Party Computation Key Management

The Quilibrium team builds services that run on the Quilibrium network and provide both traditional cloud services and things that cloud services could not offer, or could not offer without complication. One of these is key management. Amazon Web Services offers KMS, which is a hardware security module, essentially a plug-and-play rack that gives HSM capabilities. Cassie described that as just hot keys on a single device (maybe with a backup).

Quilibrium has an equivalent called QKMS, the Quilibrium Key Management Service. What is different is that QKMS not only lets developers do key management the way they always have with a service like AWS KMS, it does so through multi-party computation (MPC). MPC is a process that enables multiple computers to collectively calculate something, generally in a way that uses cryptography so that each party's input is never revealed. For key management, that means the cryptographic keys are split across multiple instances.

An institutional MPC system holds all the key shards itself, on the services it deploys, and tries to structure them so that they are split across different clouds, different geographies, or both. QKMS extends this to the nth degree. A key shard can sit within the Quilibrium network, activated by the user's request and stored encrypted so that nobody else can access it, and the user can also be a participant. The QKMS SDK lets users hold a key shard.

For example, in a simple wallet app installed on a user's phone, one key shard can live on Quilibrium mainnet while the other lives on the user's device. The wallet provider holds none of it. According to Cassie, this gives regular users, in the palm of their hands, the additional security profile that large billion-dollar exchanges have or should have (she named Coinbase, and Binance as the one that should have it).

The transaction service and chain indexer service from the same hot wallet architecture diagram will be released in the form of MegaRPC. MegaRPC can essentially be thought of as wallet indexing services, but in a way that makes requests to those services private to the requester (see the MegaRPC section below).

## Industry News: Farcaster, Network School and Hypersnap

Cassie said she ended up on Cointelegraph for the first time, because Farcaster was acquired by Network School, which then did a mass purge of basically any user it considered undesirable. Cassie looked into the details, because they exposed their API on what actually caused users to get banned, which they called a "rap sheet". According to Cassie, most of her own "digital felonies" were arguing with the previous team about how they were doing things wrong. She believed they were motivated more by vindictiveness over her pointing out the ways in which they were not behaving honestly, and she said she was punished for it by being banned.

Hypersnap had been launched quite a while earlier, and it culminated in a full hard fork. According to Cassie, the broader Farcaster network now lives on Hypersnap, while the Network School app's very limited silo is on the Snapchain from which Hypersnap was forked. This led to many events in the span of one month. Cassie and a few others brainstormed how to inform users that they could move off of the Network School app and onto the broader ecosystem, such as Quorum or any of the other apps being developed. At the time there were not many apps, but within a month people came together. There were protests at DevCon during Vitalik's keynote speech (a "protect the protocol" protest), and the Quilibrium team made its own video to spread the word. According to Cassie, Network School tried very poorly to stop the dissemination of the message that there is another option, and that users should consider what happened to their friends: the feed went quiet because they were silenced.

Cassie tied this to what Quilibrium is about. Quilibrium is a staunch advocate for freedom of speech and for freedom of cryptography, both in the traditional sense where cryptography was once regulated as arms, and in the sense of how it enables people to have self-sovereignty over their data. The Quilibrium team encouraged people to move, and they did. According to Cassie, as of 2026-11-21 over half of the Farcaster network had moved over to Quorum and other apps. She said that techno-optimists who truly are such, rather than by label, see censorship and retroactive punishment as damage, and as the old saying goes, the internet sees censorship as damage and routes around it.

## Question: How Can QUIL Be Acquired Without an Ethereum DEX?

Cassie said that buying QUIL falls under crypto asset speculation, which is not discussed on the stream. She described the two ways people primarily go about acquiring QUIL: one is to get wrapped QUIL (wQUIL) through a DEX; the other, which has been available off and on, is OTC deals for mainnet QUIL.

## Roadmap: Version 2.1.0.26

> **Note (Review Required):** This roadmap information was accurate as of 2026-11-21. Verify current status in the official documentation.

The big three focuses for the 2.1.0.26 sub-patch are improving frame time and helping node operators who have fallen into edge cases. The biggest items are lowering bandwidth use and improving memory usage, especially on Macs.

Cassie explained that macOS has, since around macOS 10.12 or 10.13, done a lot of tricks with RAM and moves things onto disk seamlessly, so that a Mac with 8 GB of RAM can feel as responsive as a Windows workstation with 64 GB. This works because of complete vertical integration of hardware and software, and because Apple has very good engineers on the OS side who optimize for standard use cases. A Quilibrium node is not a standard use case. The general recommendation is one core to two gigabytes of RAM to four gigabytes of storage. Since 2.1.0.25 there are many memory-intensive processes, and, for a reason Cassie said she did not know, Macs hit an endemic edge case with how their memory management works. Adding more memory solves it, but the team is trying to work better with how macOS handles memory management, since modern macOS is not built for servers.

The last item, specifically around frame times, is something the team is working on: a recursive STARK. It is meant to compress the amount of validation work that provers have to handle, so that the overall frame rate can go back to 10 seconds, and maybe faster in the future.

## Roadmap: MegaRPC

> **Note (Review Required):** This roadmap information was accurate as of 2026-11-21. Verify current status in the official documentation.

MegaRPC will launch both as a public service that wallets can use and as a public service for people who build against it. Almost always, a wallet developer or Web3 app developer ends up relying on a provider such as Alchemy or Infura. Cassie pointed out that these services log everything. A simple wallet that makes calls directly to Alchemy gives away its users' wallet addresses and IP addresses. A backend integration at least gives away the wallet addresses of its users. That can be very bad for privacy.

MegaRPC is built differently. It performs oblivious RAM (ORAM) lookups for data on all of the supported networks. The Quilibrium team does all of the indexing and all of the formatting of the data so that ORAM queries work well. The second layer is the SDK that integrates with an app. It is a shim that sits in front of the standard libraries developers already use. MegaRPC itself does not have a standard RPC interface for wallets, but the shim provides that standard interface and translates the actual RPC calls into oblivious RAM queries that MegaRPC can service.

The launch is planned to support Quilibrium mainnet and basically any standard EVM chain (some oddball EVM chains cannot be supported), plus Bitcoin, Solana, Bittensor and Kaspa.

## Roadmap: Coppice

> **Note (Review Required):** This roadmap information was accurate as of 2026-11-21. Verify current status in the official documentation.

As of 2026-11-21, Cassie said Coppice would be released pretty shortly. It replaces the Channels SDK, the end-to-end encrypted channels SDK, which not many people used. Coppice gives two things. First, a significantly simpler interface to implement. Cassie said that anyone who was frustrated with the Channels SDK (she knew nobody, herself included, who was not) will find it much more natural when building any kind of messenger-oriented app. Second, it is post-quantum: Quilibrium now does true post-quantum cryptography instead of the arithmetic with elliptic curves used with the triple ratchet. Cassie said it is coming to Quorum and other Farcaster clients very soon, and is generic enough for anybody to use.

Coppice is also much more amenable to low-bandwidth situations. With the Channels SDK, providing history synchronization or catch-up was very expensive. It required a lot of back-and-forth messages at the application layer, developers had to build all of those services themselves, and they then had to rely on clients being honest with each other to share data properly, or further process and vet it intensively. Coppice addresses the synchronization problem directly within the implementation of the end-to-end encrypted channels.

## Question: Does a Faster-Than-10-Second Frame Time Affect Node Resource Usage?

As of 2026-11-21, the VDF (verifiable delay function) is only at the global level. The team removed it from the application level, because at this point the time it takes to produce the data availability proofs is plenty long enough, and the VDF did not fit in that well. The frame time targets 10 seconds, and moving away from it by increasing the speed would require changing the difficulty. Difficulty scaling is something every proof-of-work protocol has. Bitcoin, for example, uses a hashcash basis, and changes the number of leading zero bits that dictate how much work on average must go into producing a valid hash. In Quilibrium's case, it is a raw number, from zero toward infinity, that dictates the number of squaring steps the VDF performs. The 10-second target is part of the logic that scales the difficulty back and forth.

## Question: When Will the Bridge Open?

Cassie said the Quilibrium team does not give ETAs anymore, having learned its lesson, so there is no date. In the context of the roadmap, the bridge is in parallel to the other items. The bridge opening is not related to the release of MegaRPC, Coppice, QNS, or any of the other roadmap items. It is something independent, and it is probably going to happen before 2.1.0.26. Cassie said that as of 2026-11-21, she expected 2.1.0.26 to take a little longer than the bridge. Network stability was the primary concern for the bridge, and that stability has now been achieved.

## The Bidirectional Bridge: Any ERC-20, Dark Pools and Post-Quantum Safety

> **Note (Review Required):** This roadmap information was accurate as of 2026-11-21. Verify current status in the official documentation.

The new bidirectional bridge allows QUIL and wQUIL to be brought back and forth, but it is not limited to that ERC-20 token. It lets people bring in any other ERC-20 token, or ETH itself, onto Quilibrium. This is helpful for people building things like DEXs on Quilibrium. The network has native token applications, so anybody can launch a token, but a bidirectional bridge that uses a trustless proof to perform the bridging enables phenomena specific to DEXs and to tokens generally.

Because all tokens on Quilibrium are private, a type of DEX that does not really exist anywhere else becomes possible: a dark pool. In traditional finance, a dark pool is where two parties, a buyer and a seller, negotiate terms and exchange privately, and the trade does not land on the public exchange. A significant purchase of a stock would otherwise have large price swing ramifications on the public market; done privately in a dark pool, people can make larger movements without causing large price action. This is valuable, and crypto has not had a good solution for it, which is ironic given that everybody is trying to bring traditional finance into crypto. It is one of the largest sources of cash flow, and it does not exist yet in crypto.

The second thing is important because of Quilibrium's post-quantum stance. Cassie described a scenario in which quantum computers have a surprise breakthrough and are available at scale and cheaply. In Cassie's view most of crypto would be dead overnight, because most of crypto is not quantum safe. Cassie said that, despite what some teams say about their quantum proofing, some teams are dishonest in how they represent their post-quantum status, and are relatively heavily promoted by key opinion leaders (KOLs). In her view, if a quantum computer existed today, those chains would be completely broken, with, in one case, unbounded issuance. On the rest of the networks, she said, there is the general problem of being able to forge signatures and steal funds.

Even if quantum computers take a long time, or turn out not to work, Cassie pointed to the recent advent of AI research and accelerated mathematics. She said that on the day of the stream there were two different findings: a proof of the generalized Riemann hypothesis, and what she believed was a finite-time blow-up proof for the Navier-Stokes problem. With mathematics advancing at that pace, Cassie said one also has to worry that a break in elliptic curve cryptography, or in the discrete logarithm itself, may be found. Being able to bridge assets from chains that are vulnerable gives a new degree of safety that those chains cannot natively afford.

In such a nightmare scenario all of those chains would need emergency halts. Even for a substantially decentralized chain like Ethereum, where Cassie noted that by the stats about two thirds of the network is run by two parties, there are still thousands and thousands of nodes that would need to be stopped immediately, an update would then have to be rolled out. In addition, every externally owned account (EOA) on Ethereum has a corresponding public key and private key. If a user has ever moved funds, that is, signed anything with the key that corresponds to the address, then in a post-quantum or ECC-broken world a signature could be forged for it. Vitalik has talked about doing a zero-knowledge proof that a seed phrase produces the derived private key for an address. But not every EOA is produced from a seed phrase: plenty of people, including institutions with billions of dollars in crypto assets, generate raw private keys and not seed phrases, and so they would not be able to do this.

A bidirectional bridge means there is a safe harbor, a Schelling point, where people can bring assets into a post-quantum state and not have to worry. The proof construction in the bridge is zero-knowledge and STARK-based, and does not rely on elliptic curve cryptography assumptions. According to Cassie, it is a much harder proof to break no matter what, and a much safer way to store assets. Cassie noted that people are not talking about this yet, because the bridge has not been released. Regarding the question of when: she would not say when, but the timing is somewhere between 2026-11-21 and the 2.1.0.26 release.

## Roadmap: QNS

> **Note (Review Required):** This roadmap information was accurate as of 2026-11-21. Verify current status in the official documentation.

QNS (the Quilibrium Name Service) will undergo many quality-of-life improvements, including a post-quantum upgrade. It appears together with MegaRPC on the roadmap because QNS depends on MegaRPC.

## Roadmap: Klearu

> **Note (Review Required):** This roadmap information was accurate as of 2026-11-21. Verify current status in the official documentation.

Klearu and MetaVM are intrinsics that are going to be added to Quilibrium mainnet. They already exist, and anyone can pull either repository and experiment with them now.

Klearu provides private AI and is pretty extensive. Other than tooling such as ComfyUI, Cassie had not seen many tools that are as broad a toolkit for training and inference. Klearu does it differently: the focus is on providing it privately. It has additional constructs for the MPC arithmetic required to do inference and training in a distributed context. The team recently added support for Flux, Krea 2, HiDream and a fourth model that was heard as "WENTU" (spelling unverified) as its other flagship models.

The Quilibrium team has also created a transformer-based image model internally. The target was a model comparable to ChatGPT Images, which has stayed at the top of the Artificial Analysis leaderboard for image generation. Cassie called it a really amazing image generation model, and said the team thinks it has cracked the code on how it was done. The new model is being trained and experimented with, and it fits nicely into Klearu's MPC execution model. It is intended to be distributable across the Quilibrium network and processed on regular CPUs instead of GPUs, while giving approximately the same speed, performance and quality as ChatGPT Images.

## Question: Can Klearu Run Models With 30 Billion Parameters or More?

A viewer asked whether Klearu could in the future do private inference for models with 30 billion parameters or more, such as DeepSeek 4.1 Flash, noting that CPU private inference is nice but pointless on Quilibrium if most computers can run these models locally.

Cassie answered that there are always trade-offs depending on the type of model. Local inference is great, but most people do not care for it and will not do it. Right now there is a sea of developers willing to do it, but the average consumer is not going to, and the average application is not going to embed those models in the app. As applications are built they rely on models as a third-party service. Klearu provides a way on Quilibrium to host these models, execute them for inference, and return the results to end users as with any third-party integration, but with full privacy. It is not like a TEE-based model, which Cassie described as a CPU's way of saying "just trust me". It is a provably secure model, where the data the user supplies as input and the output that results can only be seen by the user. She called it a significant step forward for privacy.

## Roadmap: MetaVM

> **Note (Review Required):** This roadmap information was accurate as of 2026-11-21. Verify current status in the official documentation.

MetaVM is Quilibrium's zero-knowledge and MPC-based virtualization library. The primary targets have been RISC-V, EVM, and the Solana runtime (eBPF, or SVM). The purpose of MetaVM is to provide generalized, confidential and verifiable compute, and it is what will enable the release of FFX on the QWeb services side. The team has been running MetaVM for RISC-V purposes for a while, and it is very stable. Cassie said it is also really cool to be able to run multi-party Doom as a demo, but the goal is to turn it into practical usage and bring it to the network. Klearu and MetaVM are both targeted for the 2.1.1 release.

## Roadmap: QConsole, Relational and Quorum Mobile

> **Note (Review Required):** This roadmap information was accurate as of 2026-11-21. Verify current status in the official documentation.

For the future QConsole and QWeb services, MetaVM is going to be required for FFX. Relational will come out alongside it. Relational provides RDS-style and Keyspaces-style shims that interact with the hypergraph. It gives the ability to perform normal queries, but in a way that keeps the data private and the queries private to the querier.

MegaRPC will be embedded in QConsole. Most importantly (and this was announced as the topic of the next stream) there will be integration for QClient: things like launching tokens or putting raw data on the network directly. Any interaction that would be done through the QClient command-line tool will be operational inside QConsole itself, which makes it easier to manage things without opening a terminal.

Last on the upcoming releases side is Quorum Mobile. The team did a huge rework, and everything is now fully native: Kotlin for Android and mostly Swift for iOS. It was previously in React Native, and the UI was kept looking exactly the same, with some improvements for things people were annoyed with. It will also include free Farcaster account onboarding, which was released in a Hypersnap release (Cassie said "I want to say 017"; she was not certain of the number), and Hypersnap has gone through a number of releases. There are 16 people on the Hypersnap organization alone, so the team moves very fast. Quorum Mobile will also have deeper Quilibrium integration and support for Snap Compute, which is basically like having a little virtual machine inside the feed.

## Farcaster and Turing-Complete Social

Cassie said Snap Compute will be a true test of the original ambition of Farcaster, which was a Turing-complete social network. People have asked for a long time why they should care about Farcaster when they are already on Twitter. If Farcaster were just a raw social network, a town square like Twitter, there would be no point.

But every successful social network has done something innovative that made users see a new social primitive: Twitter was the first town square, TikTok is social video, Snapchat was social image sharing and messaging. Each has its own unique quality. The unique quality of Farcaster was never realized: the idea of an interactable surface for Turing completeness. If people want to make a game, remix a game, or create interactive applications that they can share with others, this is where Cassie believes Farcaster will shine. This is shown by the number of people who participated in the fork and in all of the events around Farcaster over the years. Cassie described it as truly a network for builders, free thinkers and artists, and said Quilibrium wants to make it a home for those people and for everybody who wants to share in what they create.

## Builders and Partners on Quilibrium

In the month before the stream there was a huge upsurge in things being built in the ecosystem. Many relate to Hypersnap, but they use Quilibrium services in various ways:

- Quilcast is a very big Farcaster client, surprisingly not made by Quilibrium, Inc. It does a lot of image hosting and uses some of the back-end services of QWeb services.
- Terminus is, according to Cassie, one of the most beautiful Farcaster clients she has ever seen. It supports the sticker primitive that was created on the fly by MVR, the creator of VibeShift, which uses QWeb services for hosting the sticker packs.
- GenyCaster is created by Compez, one of the coolest developers Cassie had seen in the Farcaster ecosystem, in terms of how he deals with the circumstances of where he is developing from. It is, again, a very beautiful client.
- Homie House, Juke, LinkCast and OpenCaster are clients targeting their own unique verticals and experimenting to see what is possible under this new idea of how Farcaster can exist.
- Imagine AI is a partner of Quilibrium. They have been contributing heavily to Quorum, including the website, which Cassie said she could not wait to release. Imagine AI is a platform for image generation, video generation and access to LLMs, and was one of the first to get 4K image models. Cassie expected Quilibrium and Imagine AI to work closely together as Klearu gets more and more features.

## Closing

Cassie closed by saying the next part would come later that week, with the exact time to be posted. It would dive into QClient and more of the roadmap items being built, and show how to use them.
