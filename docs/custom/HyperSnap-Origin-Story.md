---
title: "HyperSnap: Why Quilibrium Forked Farcaster"
source: livestream (2026-03-30) + discord
author: Cassandra Heart
date: 2026-03-30
type: technical_reference
topics:
  - HyperSnap
  - Farcaster
  - Snapchain
  - fork
  - Neynar
  - Merkle Manufactory
  - decentralization
  - proof of authority
  - validator
  - governance
  - sufficiently decentralized
  - Quorum
  - why did Q fork Farcaster
  - HyperSnap history
  - Farcaster fork reason
---

# HyperSnap: Why Quilibrium Forked Farcaster

HyperSnap is Quilibrium's fork of Farcaster's Snapchain protocol. This document covers the full story behind the fork: who was involved, what happened, and why it matters for decentralized social media.

For technical details on HyperSnap's architecture, Hyper Mode, dual pipeline, and CLI tools, see the [HyperSnap technical reference](../gap-analysis/Hypersnap.md).

---

## Background: Cassie's Involvement with Farcaster

Cassandra Heart (Quilibrium's founder) was on the Merkle team and was one of the original Snapchain developers. She has deep familiarity with both the Farcaster protocol and its governance history. This context is important for understanding the fork.

---

## The Proof of Authority Problem

Farcaster's protocol has gone through multiple architectures:

1. **Hubs** (earlier architecture) - Initially used proof of authority, then moved to permissionless after objections from Cassie and others.
2. **Snapchain** (current protocol) - Returned to proof of authority, meaning only explicitly noted nodes in the authority set are allowed to be validators.

Cassie objected to proof of authority in Snapchain, just as she had objected during the hubs era. The argument from the Farcaster team was that proof of authority would be used as "training wheels" and they'd move on to something actually decentralized as the consensus model.

---

## The Merkle Manufactory Shutdown

Around January 2026, Merkle Manufactory, the company primarily responsible for the development of Farcaster and the client (which was also named Farcaster, "which helps nobody"), announced they were shutting down and selling all of their resources to Neynar.

Neynar was, at the time, a service provider for API access to Farcaster data. They had an AI integration with Farcaster, webhooks, and an app studio tool that made it easy for developers building mini apps on Farcaster.

The news broke while Cassie was on Good Morning Farcaster (a Farcaster community show).

---

## The Validator Dispute

The Q team had been running a Snapchain validator node, but not a public one -- it wasn't part of the authority set. They had a longstanding pull request, dating back to late November or possibly early December 2025, offering to be added to the validator set to help decentralize it beyond just Merkle and Neynar.

The Merkle team said they would discuss it in the new year since everyone was out for the holidays.

### Neynar Takes Over

January rolled around and Neynar took over. There was a genuine belief that it was a good fit because they'd already been building tools that helped people use Farcaster. But subsequent actions forced a reevaluation.

### The Phone Call vs. the PR

Neynar did not accept Q's open PR to add a validator. Instead, they explicitly chose a different company: a private company with a private beta Farcaster client. Not as open as Quorum was able to be accessed; there was no public client. They ran their own validator. They were funded by VCs.

It felt suspicious that a single phone call was all it took to add them when Q had an outstanding PR that had been open for months.

### The Confrontation

Q called this out as unacceptable. That's not how things should work with a process for integrating PRs or making improvement proposals. Initially, the reaction was not super positive on either side, and Cassie admits that herself.

### The Agreement and the 12-Hour Reversal

At the end of that altercation, Neynar agreed to add Q to the validator set. Q announced it would be part of the validator set and help steward the Farcaster ecosystem as peers of the network.

The argument was also raised: Neynar's decision to centralize Farcaster contradicts the original vision. If it's centralized, why don't we just use Twitter?

Literally less than 12 hours later, a message came early in the morning saying they had changed course: "Go ahead and fork."

---

## On "Sufficiently Decentralized"

Cassie's stance on the concept of "sufficiently decentralized":

> That's a terrible term, and it should have never existed. It's just a buzzword that makes people feel good about the fact that it's still centralized.

---

## The Fork: HyperSnap

So Q forked. Since then, there have been multiple HyperSnap releases. Setup is designed to be just as easy as running a Snapchain node, with a dedicated Docker organization.

### Governance: Not Just Q

It's important to understand that HyperSnap is **not** just a Q project. There is explicitly one person from Q Inc. in the HyperSnap organization; the rest are other members of the Farcaster community.

This structure is intentional and deeply held: Farcaster does not succeed with a single corporate benefactor. It does not succeed with a single corporate steward. It requires multiple people congregating on that front. That's the way the fork is organized and the way it's moving forward.

---

## Integration with the Q Network

HyperSnap runs as an alt-fee basis shard on Quilibrium, enabling proofs to be incorporated onto the Q network. This creates several integration points:

- **Q Storage embeds on Farcaster**: If somebody uses Q Storage to host files for images, an embed can be created that works on Farcaster.
- **Q Managed Services**: Q's managed services tap into HyperSnap in ways that are useful for writing software.
- **Quorum as a Farcaster client**: Quorum's feed feature uses the Farcaster protocol, and Quorum integrates with HyperSnap directly.

For details on how Quorum integrates with Farcaster, see [Quorum Farcaster Integration](Quorum-Farcaster-Integration.md).

---

## Why Farcaster Still Matters

Despite dramatically decreasing in daily active users, Farcaster remains one of the most powerful decentralized social media protocols for gaining traction with developers. As Cassie describes the community: they're a very special group, almost like a club, where a lot of people are early adopters, they're naturally curious, and they're exceedingly kind. This developer community quality is why Q invested in Farcaster integration through Quorum.

---

## Timeline

| Date | Event |
|------|-------|
| Late Nov / Early Dec 2025 | Q opens PR to join Snapchain validator set |
| Dec 2025 | Merkle team says "discuss in new year" |
| ~January 2026 | Merkle Manufactory announces shutdown, sells to Neynar |
| January 2026 | Neynar declines Q's validator PR; adds a different VC-funded company instead |
| January 2026 | Q calls out the decision; Neynar agrees to add Q |
| <12 hours later | Neynar reverses: "Go ahead and fork" |
| February 2026 | Community meeting (Feb 15); Neynar briefly reverses again, then reverses back |
| Feb-March 2026 | Multiple HyperSnap releases |
| March 2026 | HyperSnap Docker organization; running as alt-fee basis shard on Q |

---

*Last updated: 2026-03-30*
