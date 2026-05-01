---
title: "Internet Culture Field Notes Ep 1: Cassie on Farcaster History, Hypersnap, and Tokens"
source: youtube
youtube_url: https://www.youtube.com/watch?v=p16Qe1irwSM
author: Cassandra Heart
date: 2026-05-01
type: livestream_transcript
topics:
  - farcaster
  - hypersnap
  - quorum
  - tokenomics
  - decentralization
---

## Background and Journey to Farcaster

A long while ago, I had started an educational series teaching people how to code at the scale of FAANG-caliber companies. This was before the days we had LLM tools that could spit out practically everything. I had a lot of friends who were either just getting started in software engineering or trying to get a foothold in the industry. They always came to me because I love to teach how to code, asking how to ramp up from hello world and basic data structures to massive scale engineering for millions of users.

That was obviously tempered with "most of the time you don't need it, but when you do, here are the types of strategies you would employ." I had this stream going for quite a while. There were rumors that Discord was going to be acquired by Microsoft. I don't know if there was ever any truth to those rumors, but we decided to take that opportunity to rebuild Discord from scratch. That became the primary focus of the stream. We tackled everything from user management to massive databases handling millions of simultaneous users, to even basic things like QR auth flows and how to make them secure — something that Discord still hasn't done.

From there, it started to become real enough that I thought "wow, this is actually turning into a viable competitor to Discord." I was talking about it, blogging about it, posting about it on Twitter and all sorts of places. Along the way, I hit a reality check.

When you build a social media app that reaches any modest kind of scale, you immediately start hitting real-world problems with not systems but people. Some of those get reflected in the way app stores have rules and the way server hosts like AWS dictate how you manage these things. They basically shifted liability from themselves to developers. By consequence, there are a lot of problems you have to solve with content moderation. If you have access to what's being posted, you have to preemptively take action or everything gets blamed on you.

From that, I realized two things. One, Amazon is a problem. Amazon is not a viable substrate to build such a Discord clone on if you want to scale out, not spend a lot of money on infra, and tackle those issues. The other side was that app stores have a loophole: if you encrypt everything, you can bypass a lot of moderation rules because you can't see the content. Instead, you have to rely on a lagged approach where the user provides reports and you react afterwards. It's a lot simpler.

I pivoted to turn it into a decentralized Discord clone, learning lessons from crypto and how to make that work, and also made it end-to-end encrypted. I do a lot of cryptography stuff. I came up with the first constant-size regardless of number of members group messaging encryption scheme. It was basically like double ratchet for Signal, how they do person-to-person communication, but scales up to groups without having to incur the cost of sending an encrypted message to each user individually, while keeping the same security guarantees. There are easier ways to do it, but you lose a lot of the secrecy guarantees.

Through all that, I was blogging about it, posting about it, and then Varun reached out to me. This was the early early days of Farcaster. He said, "Hey, I've been seeing what you're posting and I really like that. Do you want to talk to us about what you're building?" At first I thought maybe this was a recruiting call.

At the time, Farcaster had about 500 users. Varun reached out to me on Twitter. I didn't know what it was going to be about, but it was interesting. At that time I was working at Coinbase. I jumped on a call with him and it became clear it was more of a recruiting call. I said, "I kind of want to build this." We circled back about three or four months later. He said, "Do you just want to do a work trial at the team, see how things work out, and you can start doing some of the stuff you've been doing, but do it on Farcaster?" I said okay.

They had investment. They wanted end-to-end encrypted messaging. That's kind of dope. I really didn't want to continue working for Coinbase because everything was moving onto Base and I hated Base. That was my mental model at the time. Around October 2022 at Coinbase, I gave my two weeks notice and jumped to Farcaster.

## Early Farcaster and Protocol Development

From there, we were building out some of the early stuff. I was user 1,325. I was a huge evangelist bringing on lots of people to join the network, building cool stuff. The early days of Farcaster were really open. It was open protocol development, small team trying to do things on a centralized level and then turn them into decentralized primitives as we figured out how to translate them, without locking ourselves in too early. Ethereum has a lot of architectural debt because these things ossify.

I really liked their approach near the beginning, and they kept it for pretty much the whole history of Merkle. They had a one-week to sometimes two-week work trial. You could actually understand how people work as developers and think through things. You had a lot of autonomy, which was really nice. You had the option to work on what you wanted, ship what you wanted immediately, and it would just be out there.

When we started, hubs did not exist yet, which is the predecessor to Snapchain. We had a very weird quasi-blockchain thing going on on the backend, basically testing out our ideas on how to make this all work. We moved to hubs by 2023, when we really pushed into getting that shipped. I got to work on traditional backend stuff, got to work on scaling problems as things started to pop up. Degen showed up and suddenly we were inundated with airdrop farmers and had to deal with spam controls and prevention, shipping stuff on React Native. I have my own personal opinions about React Native, but to this day it's still the easiest way to do cross-platform mobile development. I basically touched almost every piece of Farcaster's total infrastructure and applications.

## The DEGEN Era and Scaling Crisis

When the DEGEN stuff happened, the DAU shot up. It was a huge moment for the network. We were all working remote. Dan and Varun had their LA office, but everybody was working from different parts of the country. It was sheer pandemonium of trying to deal with the strain it was putting on our backend. We hadn't really worked through the scaling problems yet. We were getting absolutely slammed by people who had reverse-engineished the APIs from using the web app and were just flooding us with spam, constantly posting messages on every single high-impact user they could find to try to get engagement bait and try to get DEGEN.

At one point, about 90% of our traffic was inauthentic and coming from Malaysia. To stem the tide, we actually did a geoblock on Malaysia. It only lasted a few days while we were trying to sort out the scaling issues. It was super funny because we had a Telegram channel at the time for people developing and hacking on Farcaster, a way to get out comms in case Farcaster went down, because at the time it went down quite a bit. The amount of death threats we all got from the Malaysian airdrop farmers was hilarious. Crazy photoshops of Dan in hell, "I'm gonna find you, I'm gonna kill your mother." It was so ridiculous. I've been on the internet my entire life, so that's just normal for me.

DEGEN is a great project, Gasik has done great things, the community has endured. But it was maybe one of the first incentivized distributed denial of service attacks. You have this token being issued to this network of people flooding infrastructure that isn't necessarily fully resilient to this scale yet.

## From Hubs to Snapchain

Nayar actually started out by building a client. They built their own Farcaster client called Nayar. I never used it. I was busy hacking on Farcaster under Merkle, so I just didn't bother.

We started out with basically what was a permissioned protocol. If you wanted to run a hub, you had to be one of the personally vetted hub runners. I ran a hub outside of Farcaster. I'm very much a decentralization maximalist, so I wanted us to get out of this centralized hubs paradigm. To their credit, our goal was to do it permissioned, figure it out, and then once we were confident it could work permissionlessly, open it up so anybody could run a hub. All the nodes would sync with each other poorly, but they synced, and we started to figure out the real problems of how to scale out a CRDT-based synchronization primitive. That was a fun engineering problem, but also very revelatory because social media doesn't have to be strict global consensus like a typical blockchain. You don't usually have to care about which message came first. It's not like a double-spend problem.

But we were hitting intrinsic scaling limits as people were running hubs. We even added a "say yes you're accepting that there's no tokens here if you run a hub" message, but people were still running them. There were YouTube channels in Hindi, YouTube channels in all sorts of other languages, a lot of Eastern European folks saying "if you run a hub, you're gonna get a secret airdrop soon." We were getting absolutely slammed with poorly managed nodes putting the network under a lot more strain than needed.

That forced us to go back to the drawing board. We were thinking, "Okay, well hubs aren't going to scale. We cannot make this scale." Hubs was written in JavaScript originally. We started to move things into Rust, calling into Rust code to do things faster like storage. But ultimately we were coming to the conclusion that even if we rewrote everything in Rust, it still wasn't going to scale.

I had also been working on Quilibrium, so I had a bunch of ideas from the development I was doing there to try to make this actually scale out in a way that could work permissionlessly. They had some consultants from A16Z trying to push their ideas. That's how Snapchain came to be. A16Z was proposing: "You should use basically a variation of Tendermint called Malachite. It's being worked on by the Starkware team. You should use that, do a permissioned validator set, and work your way to permissionless." Because there was the carrot on the stick of "we will eventually become permissionless and decentralized again," I said okay, we'll work through it and figure it out.

Fast forward, lots of things that were "we'll figure it out eventually" kept getting kicked down the road. I was getting really frustrated and ultimately ended up leaving Merkle in July of last year.

I don't fault Dan and Varun for their choices. They have a different philosophy, a more VC-funded Silicon Valley mindset. Sure, that's one way to do it. But the rapid pivoting and smallest change possible to A/B test whether something works — in a traditional startup that's fine, but on decentralized protocols it becomes a nightmare. There are real problems, they do require a long-term mindset, and it was never getting prioritized. Once they started pivoting hard into the casino culture, I was just checked out.

By December of 2025, it was clear that strategy wasn't working. They brought in Zinger, and Zinger was doing the "okay, this is a trading app now, and if you don't like it, it's opportunity for another client." That just really pissed me off. By late 2025, I said "fine, okay, opportunity for another client, let's go."

## Building Quorum and Hypersnap

I had been building an alternative to Discord for all those years, and I finally made it happen in late 2024 with Quorum on web. I was preparing to launch Quorum on mobile, which was going to be a hybrid. It does the end-to-end encrypted DMs and group chats I had been working on all that time ago, but it is also a Farcaster client. It can interact with Farcaster.

I had some lessons learned from trying to build a client myself on top of also building some of the back-end services at Farcaster. I said, "Okay, you say opportunity for another client, but it's kind of a farce because the actual protocol doesn't support building other clients. If you want to run a client, you have to build your own backend, your own ingestion pipeline, your own ML tools to construct feeds, all that stuff."

I forked Snapchain silently while all this chaos was transpiring. I said, "I'm going to solve this problem the easy way. Every client needs NAR. So we're going to make this fork compatible with NAR's APIs." This was before the announcement about NAR buying out.

I thought, "Here's how we can solve the problems for building clients. We have the APIs built into the Snapchain fork. We can solve some of the other pressures. All the money is going to Merkle when you register an account, when you buy Farcaster Pro. So we make the protocol ignore Farcaster Pro. You can just do four embeds, you can do long casts, it doesn't matter if you have Farcaster Pro or not."

From there I thought about identity management. How can we actually decentralize identity management? I had all these different FIP proposals. I also sent a PR in addition to the proposal to decentralize the actual validator set. I sent a PR to add our own node in November of last year. Varun responded, "Yeah, absolutely, we'll add you. It's coming up on the holiday season, a lot of people are going to be out, let's talk about it after the new year." I said that's reasonable. We usually had a week off in December.

Fast forward to January, I'm on GM Farcaster talking to Nesh and Adrian. Middle of the broadcast I hear the news about what that quiet period at Farcaster was all about: NAR was buying them out. They wanted to get a first take from somebody who had worked for the Merkle team.

I had two thoughts primarily. One: Dan and Varun, when you hired me you said "what are we going to work on for the next 10 years and can you commit to that?" I said sure. My first thought is "what happens to the next 10 years, Dan?" The second thought was that NAR has actually been a genuine steward of making client development easier. I can't think of a company that made more sense to become the acquirer. Okay, this makes sense.

Then they started deciding to make changes to the protocol and the app. The very first thing they did on the Twitter account once they got control was start hawking App Studio. I thought, okay, that's a little screwy, but whatever.

When they modified the validator set, they added UNO. No shade intended to Christopher and Erica. But they didn't have a PR out for adding a validator. They didn't have an FIP for adding a validator. They got added because they had a phone call with Ree. That's not decentralized protocol governance. We had a way to do this and you just completely ignored that.

## Validator Set Exclusion

I was asked if Quilibrium or the underlying company is a validator now. No. They said they would add our validator later. Other people, including myself, were like "why did UNO get in when they don't even have a client that's publicly available? If you want in, you have to actually be invited in on top of it being a private beta on TestFlight." Quorum's a private beta on TestFlight too. We're still waiting for Apple to approve our beta. But at the same time, if you want it in, here you go.

A lot of people said "yeah, this is kind of screwed up." The public statement was "okay, fine, we'll add you before the next update goes out." I said "okay, cool." Twelve hours later, I get a DM from Ree. He said "yeah, we're not going to do that." His justification was that because we were running a fork, we weren't running Snapchain proper. We were running Hypersnap. He said it's too much effort to figure out if it's compatible or if it's going to cause issues, and they don't want to have to troubleshoot it.

I said, first off, I helped build Snapchain. I know what will work and what won't work. Second, we're committed to staying compatible. Third, I know how Tendermint works. If our node fails, it's one-third of the validator set that has to be screwed up before it causes problems. One out of seven is not going to mess things up. That's our problem to solve.

After a long amount of back and forth and a call with Ree, ultimately he said "okay, fine, we'll get Manana to talk to you about it, and we'll get you added to the validator set as long as you're committed to staying compatible." I said "great, okay." Then apparently in the last developer talk, they were talking about adding another validator. I don't know who they're talking about, but it's not us.

## Protocol Development Post-Acquisition

Basically every major feature that's been shipped since NAR took over, like fixing the memory leak issue, they pulled from Hypersnap. Fixing the ability to use the contract to add a signer, they literally implemented the FIP that I provided. It's been really funny because outside it sounds like we should be collaborating, and I'm not understanding why Quorum is any different from the UNO perspective. It seems like cherry-picking.

I'm not going to speak for them or suggest any conspiracies. I think conspiracies are generally dumb and reality tends to be more mundane. You got a bunch of different pressures, different priorities, you handle those in whatever order makes sense. But it is funny they've been cherry-picking the changes that benefited Snapchain and benefited Hypersnap, and it's been a one-way direction.

We stopped contributing FIPs to Farcaster XYZ. Everything has been under Farcaster.org on GitHub. I've called out the irony of them positioning themselves as champions of what Farcaster should be when they have none of the original protocol dev team. I know they have the Clanker team, but they weren't the original protocol dev team. They didn't do anything to Hubs or Snapchain. I said "okay, cool, I'll just do this fork since you told me to do the fork anyway, and we're going to continue to grow the protocol."

At the very least we have the same goal in mind: grow the user base. Ree said something about 10x in two years or something like that. We're trying to ramp that up as fast as possible. We talked about the token as part of the proof-of-work decentralization of the protocol so it's actually permissionless. That suddenly got a bunch of old users interested. They returned from three-to-six-month hiatuses. People will try to draw meaning out of that, like they're here for the token or whatever. But the reality is, the moment people actually heard the news that there is a token coming, it instantly ramped up the daily active users. The ratio of quality users to low-quality airdrop farmers actually increased in favor of quality users.

## Token Utility and Network Incentives

If you think about it from first principles of web2 social media and the parasitic relationships platforms have with users, I think we can all agree we want a user-owned network. The way that's defined is unclear. Past attempts have resulted in it getting botted to hell, leaving a negative taste and paving the way for future opportunists. But the underlying frustration with web2 social hasn't changed.

The FIP is for proof-of-work tokenization and covers a lot of ground. Thinking about it from "what problems are we trying to solve," the core problem is we want to grow the network. What do users actually want? One frustration users have expressed is that they have a limited number of casts. Once they breach that, their old ones disappear. Users have a limited number of reactions. Once they've passed that, their old ones disappear. You can go look back at casts that had a lot of engagement and now it shows zero likes when they previously had four to five hundred. I beg to differ that recording a single unsigned int of 64 bits is too much of a burden.

I was thinking: what's wrong with Snapchain other than the decentralization problem? One thing is that we're pruning content. When you look at what it takes to run a Snapchain node, it requires a lot of storage because it keeps all block history. It doesn't prune blocks, which means all those casts and information are still stored on Snapchain nodes. I thought, "What happens if we take the shackles off? We want to stay compatible with Snapchain so we can validate the roots. We store things and prune things on the Snapchain-compatible storage side, but we keep it on the Hypersnap side." That way we can keep the entire history of reactions and casts. Users can use it like they've used any other social media app before.

You have a storage problem, which means to solve it you need a decent amount of data availability. Farcaster is still young. We're dealing with a total of about 500 gigs of total data including the entire block history. Part of that is because we're not hosting image content. A lot of that is stored on Cloudflare. If you're using the Merkle APIs, that's stored on Cloudflare.

On the Q side, we scale out massively. We have a decentralized storage engine spanning across tens of thousands of workers. Data storage isn't an issue for us. We've been solving that by having an S3-compatible API that's decentralized. When you use Quorum, you can store data on Q and it flows in without having to worry about storing it on Farcaster. All you care about is the plain text data of casts and reactions.

The data availability problem isn't intense yet, but when we ramp up to potentially millions of daily active users, that's a lot of data. You have to incentivize actually holding on to that data, proving you're holding on to it, and not cheaply replicating it amongst a bunch of Sybil nodes.

## Comparison to Other Decentralized Networks

I draw a sharp line between federated models and decentralized models. It's a nuanced debate because some people argue federated is decentralized. I disagree. When you run a Mastodon server, you are responsible for hanging on to all the content your server cares about replicating. Other peers can choose to replicate that data, or you can modify your node so it won't replicate data back. There's no shared algorithm ensuring data replicates across the network. You run into censorship problems. If somebody runs a Mastodon server in Germany, they are subject to German social media laws. There's a lot of things completely legal to talk about in the US that in Germany might qualify as hate speech and they have to censor. By consequence, you run into a political problem. People establish fiefdoms in their federated nodes. Some people like that, and that's good for them.

Other networks like Bluesky claim they're decentralized, but when you look under the hood, you can look at the Black Sky team's engineering work because they're trying really hard to decentralize what the Bluesky team is doing. Bluesky centralizes the protocol. I have great appreciation for what Black Sky is doing despite not being sociopolitically aligned with the Bluesky crowd. Mostly because they hate crypto and AI, which I think is a really stupid quasi-religious debate.

They are trying to solve the clear centralization problems: how the content delivery network works, how user authentication works, and porting accounts around. All that is still very centralized in comparison to the intent of Farcaster. Whether they've actually met that intent is a different story. The contracts live on Optimism, which in my opinion is not decentralized because it's literally a single sequencer. It does roll up to the L1. At the end of the day, it lives on a substrate not controlled by NAR, but they have the keys, they collect the revenue, they have control over all those things.

## Farcaster Pro and Centralization Problems

I've long wondered who owns the FID registration proceeds. As far as I'm aware, it's never been put to social use like community incentives. It's never been transparent how that money is handled or how it will be handled.

It got really bad with Farcaster Pro because that was a lot more money, $120 a year. Ultimately, at the time, that went to Merkle. I worked for Merkle. I don't even know if I'm bound under an NDA anymore because the company doesn't exist except in a zombified state. I don't think they would mind me confirming they were telling the truth: they literally applied the proceeds of Farcaster Pro to developer and user leaderboard rewards, and it immediately completely drained all the Farcaster Pro proceeds.

What's tricky is there's no governance, no oversight. They moved all the proceeds from Farcaster Pro to a centralized custodian, Coinbase, to hold those funds. It's understandable because there's high risk having access to that much funds with a single private key. I know they had a multi-sig, but at the end of the day, a few signers get popped and suddenly millions could be exfiltrated. Understandable. Put it on Coinbase if you don't want to deal with that.

But the fact that it even works like that is a problem. Every other client is at a disadvantage. When a user onboards through another client, Merkle got paid. When you're wanting to do feed generation, when you're wanting to do normal client things, either Merkle's getting paid, NAR's getting paid, or you're spending a lot of money yourself to build that infrastructure.

Those were the problems I wanted to tackle with Hypersnap. I wanted to fix the actual centralization critical points, the failure points that exist currently in Snapchain today.

## Hypersnap Reward Mechanism

The snapchain model tries to be politically neutral. The design decision is "let's be neutral." Now we need to add incentives to run this infrastructure, measure whether you're actually providing data availability, and if so, what is the reward?

The reward mechanism, the split between data availability, apps, and user growth, all gets resolved per epoch on Hypersnap. The actual data availability proofs, if you go all the way back, I originally built data availability proofs on Q. That approach is inspired by Filecoin. Filecoin has its own problems. There are other networks like Chia, they have their own problems. People have figured out how to game those, optimize their miners, use VDFs to prevent GPU or ASIC-based speedups. Unfortunately they've fallen short, partly because of the way they use those primitives.

Q did something different. Hypersnap is doing something different that limits the ability of somebody with a massive GPU farm to take advantage of gaps in the protocol's intent.

Where it gets really interesting, and I think this is one of the most powerful primitives — Q doesn't even have this because there's no way to measure it in our case — on a social network you can actually measure the honesty and integrity of a user. The retro rewards are calculated algorithmically. We don't do any special machine learning, there's no human tagging. We use EigenTrust to calculate the set of relationships between users and determine how authentic this user is, how are they behaving.

It doesn't require a lot of compute. You can run it on the lowest grade of hardware even on the entire history of Farcaster protocol data spanning back years, in about two hours to bootstrap the initial set. Every epoch afterwards is instant. From that, not only did we figure out how to properly reward user growth, it gives us the ability to properly assess whether a user is a spammer.

Merkle's spam scoring system, which NAR has taken over, uses these really intense ML-driven regimes to classify users. A lot of users get screwed. For example, Charlie or What Rocks is right now labeled as a spammer, tagged as a zero, and there is no reason for that. Our evaluation metric does not classify them as a bot. It properly classifies them as an authentic user.

Having this approach and a basic transparent algorithm, that score feeds back into how validators get registered. In order to register as a validator, you're limited to three total nodes per FID. There is a bar based on that trust score of whether you can even enroll your validator. It's transparent, trustless, doesn't require approval of some intermediary. It helps mediate against Sybiling the network and overloading it with too many validators while we're trying to scale out the underlying consensus primitives.

Running a validator is tied to an FID, which is tied to a reputation. That reputation isn't purely technical, it has a social element based on this EigenTrust scoring. It's kind of like Google's PageRank.

Instead of having to do these super expensive ML pipelines based on what users are saying, you can lift out from the data directly. One thing we uncovered was a massive spam ring that nobody else had seen. Farcaster marked all the accounts as a two. These users, probably just one actual person, are operating a farm of about 50,000 users, all interacting with each other in a ring. Presumably they're trying to do some airdrop farming. This was back in the era of TVA coming online before they abandoned Farcaster entirely. I assume they were trying to farm the Base airdrop. Even with a simple algorithm, it immediately sticks them out like a red glaring sore thumb.

## Hypersnap Architecture

If you go back to Snapchain itself, with hubs we had scaling problems because we didn't want to do strict global consensus, but ultimately we ran into problems where we kind of did need it. The FID contracts, the key registry, all of that was on Optimism because we didn't have strict global consensus. There was no way to handle user onboarding and registration without something that had it.

Snapchain was created as an answer to the times we did need strict global consensus. For the times we didn't, we could partition the data sets out so they could be replicated by different sets of servers, scaling horizontally without thinking too hard about ramifications because there it didn't matter as much.

They basically copied NEAR's Nightshade algorithm for consensus, except they used a different partitioning scheme. NEAR had adjustable shards that would fan out based on traffic volume. Snapchain had a dedicated set of shards: shard zero, shard one, shard two. Shard one and shard two used the most basic partitioning algorithm you learn in CS 500-level courses: take the FID modulo. That's how you end up in shard one or shard two.

Shard zero contained all the things we did need strict global consensus on. Since we had the strict global consensus primitive, each consecutive block on the network contains the roots of all those individual shards. Whatever kind of sequencing you cared about, anytime something conflicted involving shard one and shard two, you would consult shard zero to have strict global consensus applied.

Hypersnap is not any different. We're still based on that blockchain primitive. The distinction and where we're moving it forward is adopting a much deeper fractionalized sharding mechanism that does not rely on dividing by FIDs. It's partitioned based on the overall size of the underlying data set. Basic Merkle tree structure, you can go down the tree to partition it out, and it basically self-balances based on how much data is under each section of a tree. That's what we did for Q, except we use vertical trees, but the same concept applies.

I think partitioning on FID division is probably not the long-term solution. It was a concession even then. We knew it wasn't going to scale inevitably. We were going to have to figure out another way to repartition. It's not that hard to think a little bit further. We already have the data set structured in such a way we could just keep subdividing. At that point you're basically getting into typical Uber engineer interview territory where the answer to almost every question is "use quad trees." It's not a novel concept.

## Mini Apps and Protocol-Level Features

When you build a mini app or a client, you tend to rely on a third-party service like NAR, but also a few other third-party services. Video streaming, for example. When you're relying on all these third-party services, oftentimes it's because the underlying thing you're building against doesn't have features to support that.

For Quorum, we have end-to-end encrypted group chats, which is based on the original direct casts FIP that I contributed. When we think about how you build a client or mini app, there's a lot of things you need. You need a place to store data about the user, so you end up having your own database using Supabase or something. When you need basic computation, you're usually using AWS Lambda or Vercel or some serverless hosting provider. When you're relying on content delivery, you're having to use some backend to host it: GitHub Pages, S3, Cloudflare R2, whatever.

Some of those problems are generic cloud problems, and that's what I spent the last eight years building with Q. But some are actually a failing of the protocol itself.

When you're authenticating a user on a mini app or client, you have to do something like sign in with Farcaster, which actually calls Merkle or NAR's backend APIs and verifies the integrity of the signature, then gives you a yes or no that the user is legitimate. You're relying on something that's not on the protocol when it could be on the protocol. It doesn't even have to really be on the protocol. You just need something to reference for the keys to make them make sense. Putting the signers on protocol, that's why I wrote the FIP.

Mini apps when you need to store data about the user — why do we need to incur a cost for Supabase when you could make those interactions data that lives on the protocol? You're genericizing the protocol to work with more than just primitive user data. It's actual computational needs, basic computational needs, but it's the same kind almost any mini app that's not just a static page will need.

When you get into the kinds of problems for building clients, there are additional things the protocol should do to serve those building clients. We started thinking about how to represent this data on the protocol, how to make it meaningful, and how to measure it in a way that transparently rewards those building mini apps and clients.

Clients are easy. You create a signer for your client, and that immediately gives you signal when they post a cast or reaction. Those things are signed by the signer key relating to the FID that represents the app. That's easy to measure.

Mini apps, none of that lives on the network at this time. One of the things that's part of the proof-of-work FIP includes embedding mini app interactions. When you click a button on a mini app, you can store the state on Hypersnap. You don't need a backend, don't need to incur the cost of Supabase, don't need the painful egress fees of Vercel. You end up with enough data that you can measure as a signal how much that mini app is meaningfully contributing to user growth.

In the developer rewards days, a good chunk of the top 50 mini apps were stupid things like "what's my NAR score." They were popular because people wanted to know their NAR score, thinking they'd be eligible for airdrops. None of that would be measured as interaction data meaning anything material for whether that mini app is helping users grow.

For mini apps that do Defense of the Agents or hire.zip, things keeping people using Farcaster, keeping them plugged in, wanting to grow and bring more people on — this gives you an actual measurable signal. It benefits the app developer by storing data on Hypersnap instead of somewhere else. You get these cool composability primitives. Mini apps can use other mini apps' data. It turns into a flourishing ecosystem.

All three of those things together create a really unique flywheel applicable to social media networks.

## Token Demand and Fee-Based Spam Prevention

When a user interacts with a mini app and the mini app data is interacting with the protocol, instead of using a separate backend, the users by virtue of using the mini app are paying through fees to store that data. The fees are very minimal, very transparent to the end user. They don't even know they're doing it.

From the perspective of spam prevention, it's got an additional advantage. There is a board on 4chan that the creator of XKCD wrote an algorithm for called Robot 9000. It had a unique feature: if a user has already written this exact same post before, regardless of who that user was, that post would not be accepted. The calculation is based on the entropy of the post, the unique fingerprint. You can do clever tricks with stemming words and deeper analysis. It has to be fast on a protocol level, but you can apply that same technique.

Our fee-based mechanism baked into the protocol works like this: if you're a high-quality user, you get over the bar. You don't have to pay fees for posting. If you're a low-quality user but the content is unique, you can bypass the restriction and not have to pay a fee. But if you're spamming the same stuff on every post, copy-pasting, after the first time they post it it becomes expensive. By doing that, you control the spam problem from a fee basis instead of from an ML basis.

The intention is not to be detrimental to a regular human user. If that happens, the algorithmic approach failed. Strictly from a quality bar, it's about preventing repetitive content. Even if they make small modifications, the algorithmic approach still notices that and raises the bar on the overall fee cost. It's still very small. For somebody sending the same message twice, it's transparent. For somebody spamming it a thousand times as replies under every post, it becomes majorly expensive, intractable to do unless there's some outsized financial gain. The people doing that are usually wallet drainers, and that stuff gets squashed anyway.

It gets into a question of relativity. A lot of people doing airdrop farming are based in countries where potential outsized gains from interactions and rewards have to outweigh costs. Five cents can be a lot for people in that situation. For users not based in those countries, five cents is a rounding error. How that comes into play is variable. It's not meant to be punitive, it's meant to be a meter on the road that says stop going so fast.

## Fork Compatibility and the Split World

We have to remain compatible with Snapchain. If the powers that be over at NAR are not implementing these same changes, a user wanting to engage in spammy behaviors would simply post to Snapchain and it ends up making it over to Hypersnap due to compatibility.

For today, in order for a user to be seen on both Snapchain and Hypersnap, they would have to be registered as an FID under the OP-based contract. From my personal perspective, I can't speak for the rest of the Hypersnap dev team, but from the perspective of a company that has a client, we're going to subsidize users joining by basically doing the registration for them on the FID contract, ID registry, and key registry, until the gasless key registry goes into effect for Snapchain as well.

We are still going to pursue these things anyway, which means there is going to be a split world perspective at times. For example, Farcaster Pro: the NAR team said they don't intend to make any changes around it just yet, even if they disagree with it. Rish has personally said he does not like Farcaster Pro, how it's currently built. Nobody does.

Having a Farcaster Pro subscription lets you post a cast with four embeds instead of two, add a banner to your profile, do long casts. On the Hypersnap side, we allow those posts without Farcaster Pro. When the client is interacting with a Hypersnap-aware SDK, it creates two casts: one that we interpret from the Hypersnap side as a Snapchain-compatible cast, and we'll ignore that and accept the one they submitted to Hypersnap. Any Hypersnap-aware client will show the full post correctly. For the Snapchain side, we'll have an embed that handles those problems. Is it a long cast? Great, it's a picture of text when it renders on a Snapchain-based client. Is it four embeds? Great, we'll compact it into a single photo. Where we hit incompatibilities, we'll do what we can to be meaningfully compatible, but we will have some things that break away from compatibility.

## Rewards Eligibility Across Clients

If you want to earn rewards as a user, you can be in the Snapchain world, use Farcaster, use any of the clients targeting Farcaster. If you're building an app where we can measure it, say your mini app creates a signer — that's a measurable signal for app developer rewards. When that's not the case, an app developer would want to use Hypersnap to make those interactions eligible for rewards.

When a Snapchain-based client built a mini app interacts with Hypersnap and lives in Hypersnap instead of some standard backend, the user on a Snapchain-based client like the Farcaster app is interacting with a proxy backend that interacts with Hypersnap. From the user's perspective, from the app developer's perspective, everything seems consistent between those two worlds.

As a node runner, you have to run Hypersnap to get data availability rewards. If you're building a client, you're probably fine and will get rewards either way. If you're building a mini app, you might have to be more tilted towards Hypersnap. That's the nature of the beast on how we collect data and how that data turns into actionable rewards.

## The Future of Compatibility

Ultimately, those incompatibilities are engineering problems. Yes, in an ideal world there are times where we could say "if you want this, you gotta use Hypersnap," but again, the goal: we're aligned, we want Farcaster as a whole to grow, which means we can't break compatibility with Snapchain. We have to work around those problems, make them work: proxy backends to work with Hypersnap data when you're on Snapchain, rendering casts in a special way to be compatible with Snapchain for users that don't have Farcaster Pro but want to use Farcaster Pro features. These are solvable, tractable problems.

Where things could get weird is when Hypersnap starts to have features that go too far beyond what Snapchain has to support. Near-term, that's not a problem. We're not going to run into that in the near term. Long term, it's entirely possible NAR could simply say "your experiment has succeeded, so we will just be part of this fork and call it a day." That is an entirely possible outcome.

## Why Decentralization Matters for Users

If people are using Farcaster on Farcaster, or on Quorum, or Herocast, or the DEGEN app, that collectively raises all boats. From my perspective, it's not about client adoption. I care about client adoption in the sense that I want users to have a kick-ass experience. For Quorum, we have group chats that are end-to-end encrypted, video and voice calling support, mini app compatibility extended with features to help keep users private.

In the real world, most people don't care about decentralization because they don't understand what it means. With Mastodon, a federated server in Germany has laws they have to comply with. A user based in the US who posts something illegal in Germany finds themselves censored. We can have our philosophical debate about whether that's good, but there will always be rough edges when reality meets law and that law pertains to jurisdictions. NAR servers are based in the US, NAR is incorporated in the US, they are subject to US law. With some of their more centralized behaviors, that puts a lot of responsibility and onus on them to be compliant in ways a truly decentralized protocol doesn't have to be.

Giving users broad latitude and freedom is something that can only come from a decentralized platform. Users don't care about decentralization. They care about what they can do. If you're using a centralized client, centralized server, you're going to hit roadblocks.

There's a very prescient problem a lot of people are facing today. When you look at it, you really feel like there's a conspiracy, and there is, but it's not what you think. A lot of states have added laws requiring identification on social media. A lot of countries are pushing for it too. Greece is wanting to ban anonymity on social media.

Anonymity is a requirement for true freedom. If you cannot be anonymous, there's a chilling effect on users. Sunlight is the greatest disinfectant. I don't mean sunlight as identifying the user, I mean sunlight as being able to have open and broad conversations.

One of my favorite people is Daryl Davis. He's an R&B, jazz, blues musician. His entire shtick is he would go to bars frequented by clansmen. Daryl Davis is black. He would talk to these people, sit down and have a conversation: "How could you hate me when you don't even know me?" Through his efforts using freedom of speech, instead of isolating these people and forcing them into greater depths of extremism, these people had true meaningful authentic conversations that let them see the error of their ways. He created a massive pile of clansmen robes because of it.

That's the one thing I get political about: privacy and freedom of speech. That's what I try to enshrine. Because of these laws coming into force, if you don't have a decentralized protocol behind it all, eventually they will force you to KYC. That is a strong argument for decentralization, even if you don't care about the rest of it.

## Token Utility for Average Users

One great example: a lot of people use a mini app called Emerge, which does AI-generated images that are thematic and grouped in a given theme. It's revealed a style of app that fills a user need other apps on other platforms haven't quite nailed down. It's essentially a coin-operated vending machine. You put in a coin and get your image. It's like the Japanese photo booths where people get Polaroids taken, but with AI. It's very fun, very viral, has amplifying effects that keep people on the platform posting cool stuff.

Right now they rely on USDC as the unit of interchange, but when it's based at the protocol level they could gain more because they're producing transactions on network associated with their mini app and rewarded by users interacting. It gives you something like Roblox with Robux, or Epic with V-Bucks for Fortnite: an ecosystem using something not actual US dollars, materially connected to US dollars, but separate, living in that ecosystem.

From our point of view, the token is filling that niche. I expect a lot of applications to be built using that token primitive because it unlocks things in ways restrictions around Circle, requirements when dealing with fiat — those go away. It's intrinsically linked to the overall flywheel.

## Team and Funding Philosophy

We do have a team. It's a small team, four total, all working on different things. I don't mean the Farcaster.org group. The Farcaster.org group is 13 independent contributors, one of which is from Q, me, and everyone else comes from somewhere else. Quorum is a Q Inc product. Klearu, our ML runtime, is a Q Inc product.

We've actually been able to do a lot with limited resources. We've never taken VC funding, we refuse to entertain any deals with them anymore. They always want a token warrant. Q Inc. has had revenue, actual numbers we can point at when talking to traditional VCs. Even traditional VCs aren't feeling it, partly because we have a user-focused perspective not aligned with VC timelines or expectations. We're not going to strip-mine our users for revenue when it's not warranted. If we have something users want to pay for, they can't live without it and want to pay for it, great, everybody wins. But we're not going to do the shitty things companies under VC regimes end up doing every time.

It's harder for hiring because we have to stay bootstrapped. The answer is not yet.

## Quorum Usage Metrics

Quorum's daily active users have been increasing. Quorum is a privacy-focused app, so we don't have Amplitude or common analytics tools to see exactly what users are doing. When you use the Farcaster app or website, they know everything you're doing. You tap on something, look at a photo, they get a full play-by-play of how long. Probably nobody is going through that, but users should be guaranteed privacy. If you're doing an action you don't expect to be seen by the world, it should not be logged anywhere.

Measuring daily active users, we have to infer. Quorum has had various times of user increases. We have a massive user base in China. We can measure from external signals like traffic on the overall network where messages are being gossiped throughout. Even though it's end-to-end encrypted, we don't know who's sending to whom or what, but we know messages are being sent. We're dealing with hundreds of thousands of messages a day. We have thousands of users right now, peaking to new heights especially because of all the news about Hypersnap. We don't have easily measurable numbers beyond that.

We have thousands of daily active users and that number is increasing. We have hundreds of thousands of messages a day and that number is increasing. It comes down to fulfilling a niche. Users in China are very restrictive about social media. The fact they have access to this app right now is probably eventually going to be terminated through an app store or whatever. We're going to find ways around that to run it as a PWA so users can still use it regardless. I don't care what your laws say, we're encrypting messages.

People yearn for freedom. That's our target demographic for Quorum. That means we're not always going to have crazy amounts of users because sometimes that leads to friction. When you change your user profile, we created a way to unify your Farcaster and Quorum profiles. If you're using the latest version and go to settings, you'll probably see a modal popup telling you about that option. Not everybody wants that option. Unlike Meta where they unified all your profiles for you and people are like "what the hell, I didn't want my Instagram linked to my Facebook," we make that a choice you have to make.

That leads to things your average product manager would say is friction for the user. Yes, it's intentional friction. We're not always going to have the easiest to use product, not always going to have the flashiest product. Our care is privacy.

## Token Generation Event and Retroactive Rewards

Has the community landed on a TGE date? I'll put it this way: yes. But we won't say it because every time there is one, you get a flood of scammers targeting that timeframe, picking a token with the same name, tricking people into buying a scam token. When you hear about it, you'll hear about it from my account on Farcaster. It will be immediate, boom, it's here, rather than "here's when to expect it." I have said it will be before Farcon, and Farcon's just a few days away. So I guess you have your answer there.

Airdrops: when you look at the history of tokens that have done airdrops, they're generally based on weird criteria. You've casted or tweeted or retweeted posts X number of times, been whatever kind of thing to help the hype wheel but not actually help the product. They also have half-assed hackathons where people build the lamest stuff nobody will ever use, thrown away after the hackathon just to get their cash prize.

We don't do that. The notion of token rewards is literally the same rules the protocol will continue doing after this change on Hypersnap takes effect, but applied to the history of data on Farcaster. You can kind of think of it as a premine, but it's not really a premine because it's the same rules. There's no special "were you a developer, did you contribute to the protocol?" None of that. It's "did you help the network grow in the same way you continue helping the network grow?"

We have six months of tranches. Every month, when the token comes out, one-sixth of the tokens are released of the retroactive scoring. Every month thereafter it's the remaining sixths until it's done. Part of that is to encourage users to keep posting on the platform. You have to keep engaging in the same way to remain eligible. It's not "boom, suddenly you got a bunch of tokens, go do whatever." It's intrinsically bound to how the protocol is expected to continue growing.

When MVR posted the snap, he was always the first on tip and allocation campaigns, creating interfaces. Absolute legend. Users looked at the retroactive score and said "oh, this is an airdrop." It's not really an airdrop. An airdrop is one-time retroactive, specifically based on some arbitrary criteria the dev team set. They also have an allocation for their VC, an allocation for themselves. None of that. It is strictly based on the protocol. It's only five months. Six, starting from zero. Month five is the sixth month. After five full months have transpired, that sixth tranche is released.

Our goal is to increase Farcaster's user base at least a hundredfold over the course of a year. The idea of 10x in two years, that's not an aggressive growth strategy. That's a maintenance plan for something on life support. We don't want to increase a thousand users to 10,000 quality users. We want to increase the user base to millions of users daily active. The hope is after that period, some number of people who came will have enjoyed the vibes and stay on.

There was a massive amount of tokens released early on, and that massive release kept going, causing conflict and drop-off. People became disinterested. The tokenomics were designed in a way — no discredit to Yasik, he did an amazing job handling crises — but it wasn't aligned to something you can measure, something you can improve and influence. If you can keep at this for six months, users continue earning tokens alongside the original retroactive tranche. You end up continuing to grow the user base, getting more people on board, people get excited and share and spread the word.

The total pool is 2 billion tokens. The retroactive pool is 200 million tokens, 10% of total supply. It fits into the halving of the actual protocol token issuance. It's basically applying the halving in reverse for the period where Farcaster did not have a token before.

The max supply target is 2 billion, but that's continual halving, think closer to Bitcoin. Technically this goes on indefinitely. You're going to get into fractional units. Eventually you'll hit the precision limits of your overall decimals. For the time being, it's being halved with every halving period. It asymptotically approaches the 2 billion.

## Philosophy and Closing Thoughts

I live, sleep, eat, and breathe this. It probably drives my spouse insane. I know it does because I'm chronically online. The philosophy of ikigai: something you're good at, something the world needs, something you get paid for, something that brings you inner peace. You found your reason for living. I was in crypto in the early days and got disillusioned, walked away. That itch never stopped being itchy. I had to scratch it again. I've been full tilt on this and can't think or do anything else.

If there is something directionally that could be improved, we're very open. That's why we had Farcaster Improvement Proposals in the first place at Merkle. It fell by the wayside. Clients, protocol, mini app support, new features — we have a streaming primitive in Quorum, but if that needs to be at the protocol level, things like that. We're always open and receptive to feedback.

Please stop sending AI-generated slop posts. I'm losing my mind having to trudge through thousand-page dissertations of nonsense.

Outside of me, who else is on the team? GitHub membership: when you see who's a member of an org, they have to identify themselves. I'm retaining that same philosophy. If somebody wants to choose and modify their GitHub profile to show they're a member of the org, great. I can understand why they wouldn't want to. I'm in the middle of nowhere, I have a lot of guns, I can defend myself. Not everybody has that luxury by country, creed, or where they are.

You can infer it based on who's interacting, who's posting FIPs, who's submitting PRs, who can approve them. I'd still rather leave it to them to personally identify. There are 13 different people, all long-standing members of Farcaster. We all have the same goal: grow Farcaster overall.

I'm not afraid of death threats. Some people have reason to be.

