---
title: "Cassie on Farcaster History, Hypersnap Fork, and Token Incentives"
source: youtube
youtube_url: https://www.youtube.com/watch?v=p16Qe1irwSM
author: Cassandra Heart
date: 2026-05-01
type: livestream_transcript
topics:
  - farcaster
  - hypersnap
  - tokenomics
  - decentralization
  - quorum
---

> **Time-Bounded Notice:** The following information was discussed on May 1, 2026. Farcaster, Hypersnap, and Quorum are rapidly evolving projects. Specific timelines, statuses, token details, and governance structures described below may have changed since this date. Always verify current status against the latest official announcements and documentation.

## Background and Joining Farcaster

A long while ago, Cassie (Cassandra Heart) had started an educational series teaching people how to code at the scale of FAANG-caliber companies. There were rumors that Discord was going to be acquired by Microsoft. She and her stream community decided to take that opportunity to rebuild Discord from scratch. That became the primary focus. They tackled everything from user management to massive databases, to even basic things like QR auth flows and how to make them secure.

When you build a social media app that reaches any modest kind of scale, you immediately start hitting real-world problems with people. App stores and server hosts like AWS shifted liability to developers. You have to solve content moderation problems. If you have access to what's being posted, you have to preemptively take action.

Cassie realized two things. One, Amazon is not a viable substrate to build a Discord clone on if you want to scale out without spending a lot of money. Two, app stores have a loophole: if you encrypt everything, you bypass moderation rules. Cassie pivoted to a decentralized Discord clone, made it end-to-end encrypted, and came up with the first constant-size group messaging encryption scheme regardless of number of members.

Through all that, Varun reached out to Cassie in the early days of Farcaster. At the time, Farcaster had about 500 users. He reached out on Twitter. Cassie was working at Coinbase. It became clear it was a recruiting call. They circled back three or four months later. They wanted end-to-end encrypted messaging. Cassie really didn't want to continue working for Coinbase because everything was moving onto Base. Around October 2022, Cassie gave her two weeks notice and jumped to Farcaster.

> **Note (May 1, 2026):** Cassie describes her start date at Farcaster as October 2022 and departure from Merkle as July 2025. These historical facts are fixed, but the characterization of current team dynamics may have evolved since this interview.

## Early Farcaster Development

Cassie was user 1,325. She was a huge evangelist bringing on lots of people. The early days were really open, small team trying to do things centrally and turn them into decentralized primitives without locking themselves in too early. Cassie really liked their approach. They had a one-week to sometimes two-week work trial. You had a lot of autonomy: work on what you wanted, ship what you wanted immediately.

When the Farcaster team started, hubs did not exist yet. They had a very weird quasi-blockchain thing on the backend. They moved to hubs by 2023. DEGEN showed up and suddenly they were inundated with airdrop farmers. Cassie basically touched almost every piece of Farcaster's total infrastructure and applications.

## The DEGEN Era and Scaling Crisis

When DEGEN happened, the DAU shot up. The team was all working remote. It was sheer pandemonium trying to deal with the strain on the Farcaster backend. They hadn't worked through scaling problems yet. They were getting absolutely slammed by people who reverse-engineered the APIs and were flooding them with spam.

At one point, about 90% of Farcaster's traffic was inauthentic and coming from Malaysia. The team did a geoblock on Malaysia that lasted a few days. The amount of death threats they got from Malaysian airdrop farmers was hilarious. DEGEN was maybe one of the first incentivized distributed denial of service attacks.

## From Hubs to Snapchain

Neynar started out by building their own Farcaster client. Cassie never used it; she was busy hacking on Farcaster under Merkle. The team started with a permissioned protocol. If you wanted to run a hub, you had to be personally vetted. Cassie ran a hub outside of Farcaster. She is a decentralization maximalist. The team's goal was to do it permissioned, figure it out, then open it up.

They were hitting intrinsic scaling limits. Even when they added a message saying "there's no tokens here if you run a hub," people still ran them. There were YouTube channels in Hindi and Eastern European languages saying "if you run a hub, you're gonna get a secret airdrop." They were getting slammed with poorly managed nodes.

That forced the team back to the drawing board. Hubs was written in JavaScript. They started moving things into Rust. But ultimately, even a full Rust rewrite wouldn't scale. Cassie had been working on Quilibrium and had ideas to make it scale permissionlessly. A16Z consultants pushed their ideas. That's how Snapchain came to be: A16Z proposed using Malachite, a variation of Tendermint, with a permissioned validator set for Snapchain, working toward permissionless.

Fast forward, lots of "we'll figure it out eventually" got kicked down the road. Cassie was getting frustrated and left Merkle in July of last year.

> **Note (May 1, 2026):** Cassie left Merkle in July 2025. The characterization of A16Z's involvement and Merkle's pivot toward "casino culture" reflects her perspective at the time of this interview.

## Building Quorum and Hypersnap

Cassie had been building an alternative to Discord and finally launched Quorum on web in late 2024. She was preparing to launch Quorum on mobile as a hybrid: end-to-end encrypted DMs and group chats, plus a Farcaster client.

The Farcaster protocol didn't support building other clients. You had to build your own backend, ingestion pipeline, ML tools for feeds. Cassie forked Snapchain silently while chaos was transpiring. Every client needs Neynar, so she and the team made the fork compatible with Neynar's APIs. This was before the Neynar buyout announcement.

Cassie and the Hypersnap team built the APIs into the Snapchain fork. All the money was going to Merkle when users registered or bought Farcaster Pro, so they made the Farcaster protocol ignore Farcaster Pro. You can do four embeds, long casts, regardless of Pro status. Cassie also thought about decentralizing identity management and wrote FIP proposals. She sent a PR to add the Hypersnap node to the Farcaster validator set in November of last year. Varun responded positively and said they'd talk after the new year.

> **Note (May 1, 2026):** The status of Farcaster Pro, Neynar's API compatibility, and validator set inclusion were described as of this interview date and may have changed.

## Neynar Acquisition and Validator Set Controversy

In January, on GM Farcaster, Cassie heard Neynar was buying out Merkle. Her first thought: Dan and Varun hired her asking for a 10-year commitment — what happens to the next 10 years? Her second thought: Neynar had been a genuine steward of client development. She couldn't think of a better acquirer.

Then they started making changes. The first thing they did on Twitter was hawk App Studio. When they modified the Farcaster validator set, they added UNO. They didn't have a PR or FIP for adding a validator. They got added because of a phone call with Ree. That's not decentralized protocol governance. They had a way to do this and it was ignored.

Cassie was asked if Quilibrium is a Hypersnap validator now. No. They said they'd add Quorum later. People asked why UNO got in when they don't have a publicly available client — you have to be invited to a private TestFlight beta. Quorum is also a private TestFlight beta, waiting for Apple approval. If you want in, here you go.

People said this was screwed up. The public statement was "we'll add you before the next update." Twelve hours later, Ree DM'd Cassie: "We're not going to do that." His justification was that they were running a fork, Hypersnap, not Snapchain proper. He said it was too much effort to figure out compatibility.

Cassie responded: she helped build Snapchain, she knows what works. The team is committed to staying compatible. She knows how Tendermint works. One out of seven Hypersnap validators failing won't mess things up. After back and forth and a call with Ree, he said "okay, we'll get Manana to talk to you and add you as long as you stay compatible." Then in the last dev talk, they were talking about adding another validator. Cassie doesn't know who, but it's not them.

> **Note (May 1, 2026):** Quorum was not yet in the Farcaster validator set at the time of this interview. The status of validator inclusion and the relationship between Hypersnap and Neynar may have evolved since then.

## Protocol Development Post-Acquisition

Every major feature shipped since Neynar took over, like fixing the memory leak and the contract signer addition, they pulled from Hypersnap. They literally implemented the FIP Cassie provided. It sounds like they should be collaborating. Cassie is not understanding why Quorum is treated differently from UNO. It seems like cherry-picking.

Cassie is not suggesting conspiracies. Different pressures, different priorities. But it is funny they've been cherry-picking changes that benefited Snapchain and Hypersnap in a one-way direction.

Cassie and the Farcaster.org team stopped contributing FIPs to Farcaster XYZ. Everything is under Farcaster.org on GitHub. Cassie has called out the irony of them positioning themselves as champions of Farcaster when they have none of the original protocol dev team. The Clanker team did some work but weren't the original protocol team. They didn't build Hubs or Snapchain.

Cassie said "I'll just do this fork since you told me to anyway, and continue growing the protocol." At least they share the same goal: grow the user base. Ree mentioned something about 10x in two years. The team is trying to ramp faster. They talked about the Farcaster token as part of proof-of-work decentralization on Hypersnap. That got old users interested. The moment people heard a Farcaster token was coming, daily active users instantly ramped up, and the ratio of quality users to airdrop farmers increased in favor of quality users.

> **Note (May 1, 2026):** The governance split between Farcaster XYZ and Farcaster.org, and the feature-sharing relationship between Snapchain and Hypersnap, reflects the situation as of this date.

## Token Utility and Network Incentives

The FIP is for proof-of-work tokenization on Hypersnap. The core problem is growing the Farcaster network. Users are frustrated that they have limited casts and reactions, and old ones disappear. Cassie begs to differ that recording a single unsigned int of 64 bits is too much of a burden.

What's wrong with Snapchain? They're pruning content. Running a Snapchain node requires a lot of storage because it keeps all block history. It doesn't prune blocks, so all that data is still stored. Cassie thought: what if the Hypersnap team takes the shackles off? Stay compatible with Snapchain, validate the roots, store and prune on the Snapchain-compatible side, but keep everything on the Hypersnap side. Keep the entire history of reactions and casts.

Farcaster is still young: about 500 gigs of total data including block history. Part of that is because they're not hosting images; they're on Cloudflare via Merkle APIs. On the Quilibrium (Q) side, Cassie and her team scale out massively with a decentralized storage engine across tens of thousands of workers. When you use Quorum, you can store data on Q instead of Farcaster. The Farcaster data availability problem isn't intense yet, but with millions of daily active users, that's a lot of data. You have to incentivize holding that data and proving you're holding it.

## Comparison to Other Decentralized Networks

Cassie draws a sharp line between federated and decentralized models. Mastodon is federated: when you run a server, you're responsible for content. Other peers can choose whether to replicate. There's no shared algorithm ensuring replication. You run into censorship problems — a server in Germany must comply with German laws and censor things legal in the US.

Bluesky claims decentralization but under the hood it's centralized. The Black Sky team is trying hard to decentralize what Bluesky is doing, and Cassie appreciates that. Bluesky centralizes the content delivery network, user authentication, and account portability.

Cassie notes that, in comparison to Bluesky, Farcaster also has not met its decentralization intent. Farcaster's contracts live on Optimism, which in Cassie's opinion is not decentralized — it's a single sequencer. Neynar has the keys, collects revenue, has control.

> **Note (May 1, 2026):** Technical comparisons to Mastodon, Bluesky, and Optimism reflect Cassie's analysis at this time. Competitor architectures may have changed.

## Farcaster Pro and Centralization Revenue

FID registration proceeds have never been transparently handled or put to social use. Farcaster Pro was worse at $120 a year. At the time, proceeds went to Merkle. They applied proceeds to developer and user leaderboard rewards, which immediately drained all Farcaster Pro revenue.

There's no governance, no oversight. Funds were moved to Coinbase as a centralized custodian. Understandable given the risk, but the fact it works like that is a problem. Every other client is at a disadvantage. When a user onboards through another client, Merkle got paid. For feed generation and normal client functions, either Merkle or Neynar gets paid, or you spend a lot building your own infrastructure.

Those are the problems Cassie wanted to tackle with Hypersnap: fixing centralization failure points in Snapchain.

## Hypersnap Reward Mechanism and Data Availability

The Hypersnap reward mechanism — data availability, apps, and user growth — all resolves per epoch on Hypersnap. Data availability proofs on Hypersnap are inspired by Filecoin. Filecoin has problems. Chia has problems. People game them, optimize miners, use VDFs to prevent GPU/ASIC speedups. They've fallen short partly because of how they use those primitives.

Quilibrium did something different. Hypersnap does something different that limits the ability of a massive GPU farm to take advantage of protocol gaps.

On a social network, you can actually measure user honesty and integrity. Hypersnap retro rewards are calculated algorithmically using EigenTrust. No special ML, no human tagging. It calculates relationships between users to determine authenticity. It doesn't require much compute. You can bootstrap the entire history of Farcaster protocol data in about two hours on the lowest-grade hardware. Every epoch afterwards is instant.

Not only did Cassie and the team figure out how to reward user growth on Hypersnap, it lets them assess whether a user is a spammer. Merkle's spam scoring, which Neynar took over, uses intense ML-driven regimes. A lot of users get screwed. For example, What Rocks is labeled as spam, tagged zero, with no reason. Cassie's metric properly classifies them as authentic.

This score feeds into Hypersnap validator registration. You're limited to three nodes per FID. There's a bar based on trust score for whether you can enroll. It's transparent, trustless, no intermediary approval. It mediates against Sybiling and overloading with too many validators while scaling Farcaster consensus primitives.

Instead of expensive ML pipelines, you lift out from data directly. Cassie and the team uncovered a massive spam ring nobody else saw. Farcaster marked all accounts as authentic. Probably one person operating 50,000 users in an interaction ring, presumably airdrop farming back in the TVA era. Even a simple algorithm sticks them out immediately.

> **Note (May 1, 2026):** Specific numbers regarding token pools, reward calculations, and spam detection capabilities were described as of this interview. Tokenomics details and protocol parameters may have been adjusted since.

## Hypersnap Architecture

Snapchain copied NEAR's Nightshade algorithm for consensus, but with a different partitioning scheme. NEAR had adjustable shards fanning out based on traffic. Snapchain had dedicated shards: shard zero, one, two. Shards one and two used the most basic partitioning: FID modulo. Shard zero contained things needing strict global consensus. Each block contains roots of all shards. When data conflicted across shards, you consulted shard zero.

Hypersnap is still based on that blockchain primitive. Where Cassie and the team are moving forward is adopting deeper fractionalized sharding on Hypersnap not based on FIDs. It's partitioned by overall data set size. Using a basic Merkle tree structure, you go down the tree to partition and it self-balances based on data under each section. That's what they did for Q with vertical trees; same concept.

Partitioning by FID division is probably not the long-term solution. It was a concession even then. Cassie knew it wouldn't scale inevitably. It's not hard to think further — they have the data structured to keep subdividing. At that point you're in typical Uber interview territory where the answer to everything is "use quadtrees."

## Mini Apps and Protocol-Level Features

When you build a mini app or client, you rely on third-party services like Neynar. When the underlying protocol lacks features, you need these crutches. For Quorum, Cassie and her team have end-to-end encrypted group chats based on the original direct casts FIP she contributed.

You need a place to store user data — usually Supabase. You need computation — AWS Lambda, Vercel. You need content delivery — GitHub Pages, S3, R2. Some are generic cloud problems, which Cassie has spent eight years building with Q. Some are failings of the Farcaster protocol.

When authenticating a user, you do sign in with Farcaster, calling Merkle or Neynar's backend APIs to verify signatures. You're relying on something not on the protocol when it could be. That's why Cassie wrote the FIP for signers on protocol.

Mini apps storing user data — why incur Supabase costs when interactions could live on the Farcaster protocol? You're genericizing the protocol beyond primitive user data to basic computational needs almost any mini app requires.

Clients are easy: create a signer, get signal from casts and reactions signed by the app's FID. Mini apps have none of that on the network. The proof-of-work FIP includes embedding mini app interactions. When you click a button, store state on Hypersnap. No backend, no Supabase, no Vercel egress fees. You get enough data to measure how much the mini app contributes to user growth.

In the developer rewards days, top mini apps were things like "what's my Neynar score" — popular because people thought it meant airdrop eligibility. None of that measures material contribution to user growth. For mini apps like Defense of the Agents or hire.zip, things keeping people on Farcaster, this gives actual measurable signal. It benefits developers by storing data on Hypersnap. You get composability primitives: mini apps using other mini apps' data, a flourishing ecosystem.

All three create a unique flywheel applicable to social media networks.

> **Note (May 1, 2026):** The specific mini apps mentioned (Emerge, Defense of the Agents, hire.zip) and the developer rewards program structure were current as of this date.

## Token Demand and Fee-Based Spam Prevention

When users interact with a mini app and data hits the Farcaster protocol, they're paying fees to store that data. Fees are minimal and transparent. Users don't even know.

For spam prevention, there's an additional advantage. 4chan has a board with an algorithm called Robot 9000 by the creator of XKCD. If a user already wrote the exact same post before, it's not accepted, regardless of who. Based on entropy, unique fingerprint. You can do clever tricks with stemming and analysis at protocol speed.

The Hypersnap fee mechanism: high-quality users get over the bar, no fees. Low-quality users with unique content bypass restrictions without fees. If you're spamming copy-pasted content, after the first post it becomes expensive. You control spam from a fee basis, not an ML basis.

It's not meant to be detrimental to regular humans. If that happens, the algorithm failed. It prevents repetitive content. Even small modifications get noticed, raising fee cost. It's still tiny for someone posting the same thing twice. For someone spamming a thousand replies, it becomes majorly expensive and intractable unless there's outsized financial gain. Those people are usually wallet drainers anyway.

It gets into relativity. Many airdrop farmers are in countries where five cents matters. For others, it's a rounding error. It's not punitive; it's a meter on the road saying stop going so fast.

## Fork Compatibility and the Split World

Hypersnap must remain compatible with Snapchain. If Neynar doesn't implement the same changes, a spammy user posts to Snapchain and it propagates to Hypersnap. Today, to be seen on both networks, users must be registered as FIDs under the OP-based contract.

Cassie and the team are going to subsidize user registrations on the FID contract, ID registry, and key registry until gasless key registry goes into effect for Snapchain. They'll still pursue their changes, meaning there will be a split world at times.

Farcaster Pro: Neynar said they don't intend changes yet, even if they disagree. Rish personally said he doesn't like Farcaster Pro. Nobody does. Pro gives four embeds instead of two, banners, long casts. On Hypersnap, the team allows those without Pro. When a client uses a Hypersnap-aware SDK, it creates two casts: one Snapchain-compatible the team ignores, and one for Hypersnap they accept. Hypersnap-aware clients show the full post. On Snapchain, long casts render as pictures of text; four embeds compact into a single photo. The team will be meaningfully compatible where possible, but some things will break away.

> **Note (May 1, 2026):** The compatibility strategy between Hypersnap and Snapchain, including Farcaster Pro handling and dual-cast creation, reflects the technical approach as of this date.

## Rewards Eligibility Across the Ecosystem

Farcaster users can earn Hypersnap rewards from any client in the Snapchain world: Farcaster, Herocast, any client. If your mini app creates a signer, that's measurable for app developer rewards. Otherwise, app developers may need to use Hypersnap for interactions to be eligible.

When a Snapchain-based mini app interacts with Hypersnap, users on Snapchain clients interact with a proxy backend talking to Hypersnap. Everything seems consistent. Node runners must run Hypersnap for data availability rewards. Client builders probably get rewards either way. Mini app builders may need to tilt toward Hypersnap. That's the nature of how Cassie and the team collect data and turn it into rewards.

## Future of Compatibility

Hypersnap-Snapchain incompatibilities are engineering problems. In an ideal world, sometimes Cassie and the team would say "use Hypersnap for this." But Cassie wants Farcaster to grow, so the team can't break Snapchain compatibility. The team will work around problems: proxy backends, special rendering for non-Pro users wanting Pro features. These are solvable.

Where it gets weird is when Hypersnap has features too far beyond Snapchain. Near-term, not a problem. Long-term, Neynar could say "your experiment succeeded, we'll join the fork." Entirely possible.

## Why Decentralization Matters

If people use Farcaster on Farcaster, Quorum, Herocast, or DEGEN app, that raises all boats. It's not about client adoption; Cassie wants users to have a kick-ass experience. Quorum has end-to-end encrypted group chats, video and voice calling, extended mini app features for privacy.

Most people don't care about decentralization because they don't understand it. Mastodon servers in Germany must comply with German laws and censor things legal in the US. Neynar servers are in the US, Neynar is a US corporation, subject to US law. Their centralized behaviors put responsibility on them to comply in ways a truly decentralized protocol doesn't.

Broad latitude and freedom only come from decentralized platforms. Users care about what they can do. Centralized clients and servers hit roadblocks.

A lot of states and countries are pushing laws requiring identification on social media. Greece wants to ban anonymity. Anonymity is required for true freedom. Without it, there's a chilling effect. Sunlight is the greatest disinfectant — not identifying users, but having open and broad conversations.

Because of these laws, without a decentralized protocol, eventually they'll force you to KYC. That's a strong argument for decentralization even if you don't care about the rest.

## Token Utility for Users

A good example is Emerge, a mini app doing AI-generated thematic images. It's a coin-operated vending machine. Right now they use USDC, but at the Farcaster protocol level they could gain more because transactions are on network associated with their mini app. It's like Roblox with Robux or Fortnite with V-Bucks: an ecosystem using something not actual dollars, materially connected but separate, living in that ecosystem.

The Farcaster token fills that niche. Cassie expects a lot of applications built using the Farcaster token primitive because it unlocks things in ways fiat restrictions don't. It's intrinsically linked to the overall flywheel.

## Team and Funding

The Farcaster.org group is 13 independent contributors, one from Q (Cassie), others from elsewhere. Quorum is a Q Inc product. Klearu, the ML runtime, is a Q Inc product.

Cassie and Q Inc. have never taken VC funding and refuse to entertain deals. VCs always want token warrants. Q Inc. has revenue, actual numbers. Even traditional VCs aren't feeling it because Cassie's user-focused perspective isn't aligned with VC timelines. They're not strip-mining users for revenue. If users want to pay for something they can't live without, great. But they won't do the shitty things VC-backed companies do.

They're bootstrapped, so not hiring yet.

> **Note (May 1, 2026):** Team size, funding status, and hiring availability were current as of this interview.

## Quorum Metrics

Quorum's daily active users are increasing. It's privacy-focused, so Cassie and the team don't use Amplitude or standard analytics. They infer from external signals like network gossip traffic. Even end-to-end encrypted, they know messages are being sent. They're dealing with hundreds of thousands of messages a day. They have thousands of users, peaking to new heights because of Hypersnap news.

They have a massive user base in China. China is very restrictive about social media. They probably will terminate access through app stores eventually. They'll find ways around it as a PWA. People yearn for freedom. That's Quorum's target demographic.

> **Note (May 1, 2026):** User metrics (thousands of DAU, hundreds of thousands of messages daily) and geographic distribution were described as of this date and may have grown significantly since.

## Farcaster Token: Generation Event and Retroactive Rewards

> **Important:** This section discusses the **Farcaster token** (the utility token being introduced via Hypersnap's proof-of-work protocol changes), not Quilibrium's QUIL token. These are entirely separate tokens on separate networks.

Has the community landed on a TGE date for the Farcaster token? Yes, but Cassie won't announce it because scammers target announced dates. When it happens, you'll hear it from Cassie's Farcaster account immediately. She said it will be before Farcon, and Farcon is just a few days away.

> **Note (May 1, 2026):** The Farcaster token TGE was anticipated before an upcoming Farcon event. The actual TGE timing and token launch details should be verified against current official announcements.

Airdrop history is based on weird criteria: retweet counts, hackathons with throwaway projects. Cassie doesn't do that. Farcaster token rewards use the same rules the Farcaster protocol will continue using after Hypersnap changes, but applied to Farcaster history. Think of it as a premine, but it's not, because it's the same rules. No special developer or contributor allocations. No VC allocation. No team allocation. Strictly protocol-based.

There are six months of tranches. Every month, one-sixth of retroactive Farcaster tokens release. Users must keep engaging to remain eligible. It's intrinsically bound to continued protocol growth.

The total Farcaster token pool is 2 billion tokens. The retroactive pool is 200 million, 10% of supply. It fits into the halving of the Farcaster protocol token issuance. It's applying the halving in reverse for the period before Farcaster had a token.

The Farcaster token max supply target is 2 billion with continual halving, like Bitcoin. It goes on indefinitely, asymptotically approaching 2 billion. Check the FIP for Farcaster token halving period details.

> **Note (May 1, 2026):** Farcaster token supply figures (2B max, 200M retroactive), tranche schedule (6 months), and halving mechanics were described as of this interview. Always verify current tokenomics against the latest FIP and official documentation.

## Closing

Cassie and the team are open to feedback. That's why FIPs exist. Clients, protocol, mini app support, new features — they're receptive. Cassie asks people to stop sending AI-generated slop posts.

For team contact, check GitHub. Members identify themselves if they choose. There are 13 independent contributors, all long-standing Farcaster members. They share the same goal: grow Farcaster.

