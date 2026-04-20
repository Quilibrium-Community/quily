---
title: "Quilibrium Dev Talk: Node Rust Rewrite, MetaVM EVM Consensus Proofs, and Industry Security Events"
source: youtube
youtube_url: https://www.youtube.com/watch?v=2752600949
author: Cassandra Heart
date: 2026-04-20
type: livestream_transcript
topics:
  - node-operation
  - architecture
  - security
  - roadmap
  - q-storage
  - mpc
  - quorum
---

## Business Updates

ZapMe is proud to announce that ZapMe Social is now decentralized. Their storage has moved entirely onto Q Inc., and they are also planning on moving other parts of their infrastructure onto Q as different features of the Q Console and associated Q web services are released.

## Development Updates: Releases

As far as releases go, there was a node update. There have also been a few back-and-forth runs with the App Store approval process. It has been a massive pain, but the finish line is finally here. The same update will also be released, begrudgingly, to TestFlight and Google Play beta, and of course the standalone APK for people sideloading.

Updates were also made to three major Q services: Q Storage, Klearu, and MegaRPC.

## Node Update: 2.1.0.22 and 2.1.0.23 (Rust Rewrite)

2.1.0.22 went out earlier this month. It had bug fixes around the TUI, an activity eviction bug fix, a seniority merge bug fix, and some heavy bandwidth bug fixes.

2.1.0.23 is a very interesting release in the 2.1.0 series. It was mostly a big deep dive using pprof and memory profiling outputs to find what was causing some of the issues we were experiencing. The biggest issue was around the GossipSub layer. The PubSub layer was dropping messages because the message processing loop kept hanging at really odd intervals, and it was very hard to trace down until we dove into deep profiling through pprof.

It actually revealed GossipSub wasn't the only thing dropping messages. There were resource access halts on RPCs for the same reason, and also the submission layer from nodes submitting on those RPCs. That led to a conclusion that had been kicked down the road for a while: Go's GC is absolute dogshit. The tricolor mark-and-sweep algorithm they use is very outdated. No other language uses it anymore for a reason -- that stop-the-world behavior causes all sorts of weird behaviors to crop up, especially on lower-resource machines.

Every single time we've tried to fight this, we've fought it through our implementation of BLS48-581, through the implementation of our verifiable delay function, the Wesolowski VDF, and through basically every part of the crypto stack itself. Everything has been moved to Rust. The reason is that these things churn through a lot of memory and have really tight bounds around how much memory is being used. If you're not manually managing the memory, or the language handles it for you, you basically find yourself stuck in deep performance rabbit-holing and lots of weird unsafe code. And inevitably, the conclusion always ends up: Go, stop using Go.

For the longest time this was avoided because the state of some dependencies -- Pebble or libp2p -- had a lot to be desired with respect to compatibility for Rust versus Go. Pebble itself is a Go implementation of RocksDB, at least it was, until they started tacking features on it that made it incompatible. So we were trying to avoid this for the longest time, but every single path kept leading to the same place.

The conclusion was reached that a rewrite in Rust was necessary. This isn't something that just happened spur of the moment from 2.2 to 2.3. A lot of pieces of the protocol have been rewritten in Rust for quite some time. Around .18, when services like QNS were rolling out, special features on Quorum Mobile, and some advanced work with proving and supporting other networks integrating in -- all of those things ended up getting written in Rust anyway. So a lot of the overhead that would have come with such a rewrite was basically already done. The only things really missing were converting the data over to RocksDB (which is trivial) and the overall work of worker management.

An interesting realization comes into view when you think about why things were done the way they were with worker management and having separate processes for non-clustered instances. It was because Go was giving us so much grief. We couldn't pin cores to single threads. The Go GC fought us every step of the way. We had to create a multi-instance model where you would run either the node in master mode (managing all workers and handling global-level proofs) or workers individually capped at certain amounts of memory -- and it still grew grotesquely out of control because once you hit the ceiling set on those workers, they would stop the world to do their own GC.

When we moved to Rust, that actually made it quite simple to relax a lot of those things. At that point, you can have a single process managing all individual worker threads when in non-clustered mode. Of course, all the compatibility considerations are kept in mind for people running clusters, for people using the proxy pubsub mode, and all those things. So the scope is specifically the node. Qclient is still in Go. We're not migrating that just yet. A lot of the corresponding libraries we've created are one-to-one compatible, so people building tooling around Go are completely fine and unaffected. It is strictly just the node.

> **Note (Review Required):** The 2.1.0.23 branch was about to be published as of this stream (2026-04-20). Verify current release status.

The 2.1.0.23 branch is going to be published as soon as humanly possible. Working through basically every deployment scenario that has been seen to make sure it just works. Obviously a full node rewrite sounds insane, but since there wasn't that much to actually move over, it's easy. Nevertheless, easy doesn't mean perfect, so we're trying to preempt a lot of the tester feedback we usually run into by going through all those scenarios ourselves. That doesn't mean we'll get everything, but it means we'll be coming into this testing phase with a lot more confidence.

## MegaRPC

MegaRPC has been released. It's a privacy-preserving RPC. It uses ORAM-based queries for user privacy. We've been talking to some wallet teams about integrating it so that they can ditch some of the public RPC providers that charge a lot and also give no privacy at all -- and in fact cooperate with different government bodies across the world providing user information. MegaRPC can't do that. It's the first RPC service that can't be evil.

We will be opening up Q Console access for teams that want to get API keys and integrate with MegaRPC themselves if they don't wish to run a MegaRPC node. It costs a lot in terms of overall data storage. More on this later in the talk.

## Q also Gets a Bump: Messaging Sellers and Owners

Q is getting a bump with support for messaging sellers and owners, and it will have direct integration with Quorum Mobile.

## Quorum Mobile Update

Quorum Mobile has gone through a serious UI overhaul. It has a space explorer. Every single performance issue has been ground out, so it's significantly faster. Everything around encryption and decryption has been moved into a background native thread -- moved into native code instead of the trampoline (the back and forth with the JavaScript heap). We don't do that anymore. It's strictly native for all cryptography-related things, including talking to the overall network to obtain messages.

A deep dive was also done on the overall performance of React Native apps in general, fixing a lot of things that could have been memoized when they weren't. Quorum Mobile has support for public profiles, so if you want to share your profile publicly with a profile picture and so on, you can now do that. It supports voice and video calls.

One thing that wasn't noted before: some people coming into Quorum Mobile from the Q ecosystem don't have familiarity with Farcaster or don't want to bother with it. We're actually going to add free Farcaster account onboarding. With the update, you'll have the ability to create a new Farcaster account, and it will be pretty seamless. It's not the two split world views that it has been.

Note: a lot of this also changes the nature of how the protocol, the Quorum layer, interacts with the app. There's a little bit of upgrade pain for this update -- if you are on TestFlight and not waiting for the App Store release, you will have to go through two upgrades. Trying to minimize the pain as much as possible so it looks as seamless as it can be, but unfortunately that is the reality.

The calls are actually being routed through the onion routing layer of the network. In standard WebRTC, you're routing through a connection -- sometimes a TURN server routing traffic between two parties, especially when both people are behind residential ISPs. There's a lot of information leakage. With Quorum, the call is routed through the onion routing layer of the Quilibrium network so that users are not revealing where they are in the world, what their IP address is, or anything like that. At the same time, because it's using the key-based authentication that Quorum has baked in, you know you are talking to that user authentically.

The last major feature in this update is the ability to receive offers for QNS names directly on Quorum Mobile.

> **Note (Review Required):** Quorum Mobile was going through App Store approval as of this stream (2026-04-20). App Store approval for social apps is the most intensely scrutinized category due to content policies. Verify whether the app has been approved and released.

## App Store Approval: Context on Social Apps

The App Store approval process is a big pain. Social apps have the most intense amount of scrutiny, involving things like reporting, whether adult content is the focus of the app (which would block approval), and very Byzantine compliance rules. That is not an issue for this app, but those things all have to be kept in mind.

When you have an account on a TestFlight-based app, you have to manually log in to the new App Store app. That same thing comes into play when you're doing crypto wallets or network integrations that store data locally on the app -- that data now has to migrate over. We only wanted to incur that pain once. With this update there is a little bit of upgrade pain, so if you are on TestFlight and not waiting for the App Store release, you will have to go through two upgrades.

## Q Storage: Sub-Account Ownership

One important thing that came up under some companies: what they need is sub-account ownership. When you upload a file to Q Storage into a non-bucket, the write key is owned specifically by your account. The read key is accessible only to your account, and when you make it public, you're essentially revealing the read key for that bucket.

The same thing happens at sub-account levels, but what's really nice about it is that it lets you compartmentalize the ownership such that the policy document you create can be attached to that sub-account so that you don't have root access. This can be really important in a security posture. If you're wanting to create a social app where users are posting images and you only want those to be accessible to people the users have specifically granted permission to -- when you're using AWS-style APIs, that's kind of hard to do. You at least have the risk that the root account owner could view those images. By using sub-accounts with the appropriate policy doc in place, that gives you the optionality to upload files that are explicitly controlled only by the user of that account -- which in this case is the actual account owner on that social media application.

That's a really powerful tool. It gives you the ability to have compartmentalized access controls that are cryptographically enforced without having to write all that code yourself. The value add is immense. It makes it so easy to create a decentralized app with data stored on the Quilibrium network where the only people who can access that data are the people that the user specifically gives permission to.

## QKMS: Sub-Account Ownership and New SDK

QKMS got an update as well with sub-account ownership and a new SDK. If you've ever used a wallet-as-a-service style SDK like Privy, you'll feel right at home, especially because the API surface was made basically drop-in compatible. Instead of a Privy provider, it's a QKMS provider. But it's basically the same thing, except we support a lot more key types.

You're able to create a wallet on the fly, and it's doing the MPC in the background. The DKG takes a couple of seconds, and now you have a split 2-of-2 threshold signing key. It has the full wallet provider in the SDK, so you're able to use all the other integrations you've always used. If you use EVM for Ethereum or any of the wide variety of Solana-based SDKs, you can readily create keys that are 2-of-2 or T-of-N, whatever configuration you want, which is really powerful when you're doing group wallets.

One important thing that no wallet-as-a-service style SDK offers: we have support for other keys like BLS12-381. BLS12-381 is the validator key for Ethereum. If somebody wants to do a group wallet to manage the rewards of an Ethereum validator, you can actually do this programmatically now without having to do multi-sig operations or crazy UIs. You can just bake it in using the QKMS SDK. We also have support for BLS48-581 for Quilibrium, DCAF448 for Quilibrium, and Ed448 for Quilibrium.

The QKMS SDK was published on GitHub at `equilibriumnetwork/qkmssdk`. The examples should give you plenty of easy ways to get started and start building distributed MPC-based wallets.

## Klearu: Expanded Classifier Model Support

Klearu has expanded classifier model support, so it can now do MPC identification of images. For example, if you're building a bird-watching app and you want to verify that users are contributing authentic photos of birds, you can use the expanded classifier model support to actually identify whether or not the photo is of a bird versus anything else, and weed out any submission before any image content has actually been uploaded.

This is also useful in the general context for social media so that you can handle situations where things like strict liability content are being uploaded.

The LLM model has also been expanded to support multimodal modes, so you can submit an image to an LLM and ask it questions about the content of the image.

## MetaVM: FFX (Lambda Equivalent) and EVM-to-Consensus Proofs

MetaVM has gone through a few smaller updates. This week we're going to be launching public access to FFX, which is our equivalent to AWS Lambda. It will support being able to run Node.js applications. The next update will support full EVM-to-consensus proofs.

Currently at layer one, we support execution proofs. The next update is going to take it all the way up to the consensus layer where you can actually have a full proof of finality, where the overall economic security is factored in.

When a transaction is being queried through MetaVM, you will be able to see the full chain-of-custody proof that shows:
- The full zero-knowledge proof that condenses the Merkle-Patricia tree proof of that transaction and all the SLOAD and SSTORE events that happen on the EVM
- All the way up to the actual block produced
- The binding at the consensus layer
- The epoch-level finality guarantees based on the FFG (Casper FFG), which is basically saying two-thirds of total stake or more has attested to this

You'll have a full condensed proof based on the full economic security of Ethereum to confirm that a transaction actually happened. Given the degree of technology that exists today and the ability to do this, doing anything else is absolutely irresponsible.

## Balance: CSP Language

Balance is available on GitHub, free to experiment with. It is the first Communicating Sequential Processes language that actually enforces the constraints of a Communicating Sequential Process language with codified laws as part of its language, which is really helpful for avoiding some of the traps that come into play with building distributed systems.

## Hypersnap Updates

There have been a few releases. Added support for running nightly builds, expanded API compatibility (web hooks and notification support), and released a preview of the Snap Compute and Emulator. This is related to FIP21 in the Hypersnap repo. There is a token coming around with this -- more details are in the Hypersnap dev calls.

---

## Industry Events

### Vercel Account Compromise

Over the past week, Vercel was attacked and had a global account compromised. They're currently trying to play damage control about the level of access. Currently on the dark web, people are trying to broker account information for all the users of Vercel: credentials, API keys. It was one of the worst-case scenarios.

The verdict is that this all could have been prevented with whole-account isolation, which is why FFX is exciting to get out there. We support Node.js applications and don't have the same kinds of problems around egress fees or even the account separation problem that struck Vercel.

### eth.limo DNS Hijack via EasyDNS

eth.limo's DNS account was compromised on EasyDNS. It was redirected to an attacker name server. CoW Swap was also hit by this.

You can really just avoid this. Right now, DNS is kind of a clusterfuck. It's old. It doesn't have quite the same degree of control or proofs that exist in things like QNS. With Quorum Mobile hitting the App Store, users will be able to access clear web resources as well as private resources on Q using QNS, which gives you a much greater degree of proof of what you're accessing and also limits the amount of information you're giving with those resources accessed via QNS.

### Layer Zero / RPC Verification Is Not a "Fundamental Limitation"

Layer Zero gave a rundown of what they currently know with the compromise that happened with a given DAO that basically had consequential damages spanning all the way to Aave. They specifically stated: *"As a result of this manipulation, the Layer Zero Labs-operated distributed validator network instance confirmed transactions that never in fact took place. RPC verification is a fundamental limitation of all off-chain services, including bridges, exchanges, etc."*

That is false. That is 100% false. RPC verification is one way to do things. It is a wrong way to do things.

Here's what actually happened: Layer Zero uses RPCs as part of the DVN in order to confirm transactions. They had a few different RPCs that they essentially load-balanced. Two of their RPCs had been DDoSed offline and one RPC -- which returned the malicious transaction -- was compromised. This one RPC appears to have been compromised by the Lazarus Group, and was actually sophisticated enough that it was giving different answers based on what was querying it.

The sophistication of a Lazarus attack is not surprising -- that's their entire bread and butter. But what is surprising is their claim that "RPC verification is a fundamental limitation of all off-chain services." If you are simply trusting an RPC, even one you're running yourself, and you don't actually have proof of execution, proof of inclusion in the chain, and you don't follow through to that proof and verify it -- that is your fault. That is not a fundamental limitation. That is a fundamental failing.

This is why MetaVM is doing full zero-knowledge proofs. Presently at the execution layer, the next update is EVM-to-consensus. When a transaction is queried through MetaVM, you will have a full chain-of-custody proof with full economic security of Ethereum behind it. Given the technology that exists today, doing anything else is absolutely irresponsible. Layer Zero is blatantly lying to you.

#### Lazarus Group Threat Model

Can Lazarus ever be a threat to QUIL? They most certainly can be a threat. That's the nature of the beast. When you think about security from a protocol perspective, you're assuming that people won't play by the rules. You can build the rules so that they're resilient: verify that data is actually valid, that transactions actually happened, build in rules that confirm double spends can't occur based on the nature of how the protocol works.

When you're talking about threat actors at that level, they're going after the weakest chain in the link. In the Layer Zero case, they attacked an RPC server. In previous cases, they compromised signing front ends for multi-sig signers, compromised the Safe UI by replacing it with a custom one that used a compromised exchange's instance of that Safe front end -- so that the transaction sent to hardware wallets was replaced. They're very sophisticated and will use anything at their disposal: the operating system, zero days, dependencies, vendors, domain hosts.

In order to prevent these styles of attacks, you have to do deep defense in depth. In the case of rBridge, for example: rBridge is an MPC trustless bridge and is being upgraded to use MetaVM as part of that trustless bridge to avoid the problems that come into play with RPCs. Most importantly, it is a T-of-N style confirmation. It cannot be a singular node that is compromised to obtain access to actually minting out ERC20s on the other end or authorizing the dispersal of the token on the Q network side. These are things you just have to build. You have to actually build out the layers of defense in depth. If you don't, you'll get hit.

The degree of threat modeling has now expanded from nation-state to anybody with access to a sophisticated enough model and enough time. You're essentially trading compute for security -- which is kind of funny because that all stems back to the original thesis of proof of work being the only viable model. But that's the reality of it, and we have to constantly stay ahead of the curve.

---

## Q&A Highlights

**Q: What's the rule of thumb for when to use RPC versus GossipSub?**

Part of the reason some things were moved to RPC instead of GossipSub was down to two reasons:

1. We were seeing messages dropping (now we know why).
2. A mesh publication-based network, when you have a limited number of nodes responsible for a given shard of the network, has its faults. People can try to do Eclipse-style attacks. 2.1.0.23 is highlighting peers that are incorrectly reporting themselves as a certain type of peer -- like reporting themselves as archive nodes at the global level -- and there is a lot more alerting in place around it.

The RPC approach essentially cuts off that problem entirely. It moves the problem into protecting the RPC directly. Node operators will have to contend with the fact that people will try to DDoS them, but that's a node management problem instead of an overall network problem.

GossipSub is particularly useful for wide dissemination of content that is basically permissionless and distributed across the entire set -- things like peer info, key registry. These are messages that are easy to route and ensure they land in the right places, which is literally everyone, which solves some of that problem.

**Q: Any new BD calls?**

BD calls are happening constantly. Wallet teams, distributed app builders, Farcaster client developers, teams across all sorts of domains. With Hypersnap, a lot of that will come out all at once. With some other services it will depend. Not everyone is going to want to identify that they're running on Q -- they may just want to say they're now decentralized without much additional information. Everyone has their own threat models and risk profile.

---

## Security Reminders

- If you see a link posted claiming to be from Quilibrium on Twitter, always double-check by going to quilibrium.com directly. Twitter short links can be used to disguise malicious URLs that appear to show the correct domain.
- If you're using Telegram and you've been invited to a group that looks like any known Quilibrium community or node runner group, and they are talking about a wallet migration: there is no wallet migration. Do not follow their links. Report that group. You will lose all of your funds.

---

*Last updated: 2026-04-20*
