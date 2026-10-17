---
title: "HyperSnap: Why Quilibrium Forked Farcaster"
source: livestream (2026-03-30) + Discord recaps (2026-08-19, 2026-10-16) + Community Contribution (Issue #113) + The Block (2026-10-15)
author: Cassandra Heart
date: 2026-10-17
type: technical_reference
topics:
  - HyperSnap
  - Farcaster
  - Snapchain
  - fork
  - Neynar
  - Balaji Srinivasan
  - Network School
  - Farcaster acquisition
  - retroactive bans
  - AI moderation
  - full fork
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
  - who owns HyperSnap
  - who runs HyperSnap
  - who builds HyperSnap
  - who leads HyperSnap
  - HyperSnap team
  - HyperSnap contributors
  - HyperSnap ownership
  - Farcaster.org
  - is HyperSnap a Quilibrium product
  - is HyperSnap a Q Inc product
  - is HyperSnap open source
  - is HyperSnap Cassie's project
---

# HyperSnap: Why Quilibrium Forked Farcaster

HyperSnap is a fork of Farcaster's Snapchain protocol. Quilibrium **triggered** the fork after a validator dispute, but HyperSnap itself is **not a Quilibrium Inc. product**: it is maintained by an independent open-source group of roughly 15 contributors, only one of whom is from Q. See [Governance: Not Just Q](#governance-not-just-q) below.

The initial fork followed a validator dispute in early 2026. A second rupture followed Network School's October 2026 acquisition of Farcaster: new app rules were applied to old posts, accounts were restricted, and community members moved toward Quorum and HyperSnap. The acquisition and its moderation fallout are part of the story, not a successful conclusion to the earlier merger proposal.

For technical details on HyperSnap's architecture, Hyper Mode, dual pipeline, and CLI tools, see the [HyperSnap technical reference](../gap-analysis/Hypersnap.md).

---

## Why HyperSnap Started: The Validator Dispute

Cassandra Heart was on the Merkle team and helped develop the original Snapchain. She objected to Snapchain's proof-of-authority validator set: participation required approval by its operators, despite an earlier move away from that model in Farcaster's hubs era. Q had offered to join the validator set through a pull request in late 2025. After Neynar took over Farcaster from Merkle in January 2026, it added a different company while Q's request remained open. Neynar then agreed to add Q, reversed that decision less than 12 hours later, and told Q to fork. After a further reversal around a February community meeting, Q proceeded with HyperSnap. The concern was not merely one rejected validator: an open social protocol depended on decisions by a small authority set.

## The Fork: HyperSnap

HyperSnap began as a fork of Snapchain and subsequently had multiple releases. Its setup was designed to be as straightforward as running a Snapchain node, with a dedicated Docker organization. The October 2026 acquisition and bans made continuing toward a **full fork away from Neynar's Snapchain** more urgent; an August 2026 discussion had already described that direction. Do not conflate the original early-2026 fork with a claim that every Farcaster dependency had already been removed: as of October 16, Cassie said Quorum posted to HyperSnap while still making some Farcaster API calls.

### Governance: Not Just Q

**HyperSnap is an open-source project, not a company product, and not Cassie's personal project.**

Q Inc. triggered the fork, but it does not own or control what came out of it:

- HyperSnap is built and maintained by an independent open-source group of **roughly 15 contributors**, all long-standing members of the Farcaster community. Cassie calls them "the **Farcaster.org** group"; the code lives in the [`farcasterorg`](https://github.com/farcasterorg/hypersnap) GitHub organization, not a Quilibrium one. It is a contributor group, not an incorporated company or foundation.
- There is explicitly **one person from Q Inc.** in the HyperSnap organization: Cassandra Heart. The rest come from elsewhere in the Farcaster community.
- **Cassie is a contributor, not the owner, CEO or singular leader.** Her role is technical history (she was one of the original Snapchain developers), not authority over the project.
- Protocol changes go through **FIPs** (Farcaster Improvement Proposals), not through Q.

This structure is intentional and deeply held: Farcaster does not succeed with a single corporate benefactor. It does not succeed with a single corporate steward. It requires multiple people congregating on that front. That's the way the fork is organized and the way it's moving forward.

> **Do not describe HyperSnap as "a Quilibrium product", "a Q Inc service" or "Cassie's project".** The accurate phrasing is that Quilibrium initiated the fork and one Q person contributes to it, while the project is run by an independent open-source group.

---

## Integration with the Q Network

HyperSnap runs as an alt-fee basis shard on Quilibrium, enabling proofs to be incorporated onto the Q network. This creates several integration points:

- **Q Storage embeds on Farcaster**: If somebody uses Q Storage to host files for images, an embed can be created that works on Farcaster.
- **Q Managed Services**: Q's managed services tap into HyperSnap in ways that are useful for writing software.
- **Quorum as a Farcaster client**: Quorum's feed feature uses the Farcaster protocol, and Quorum integrates with HyperSnap directly.

For details on how Quorum integrates with Farcaster, see [Quorum Farcaster Integration](Quorum-Farcaster-Integration.md).

---

## August Proposal, Then the October Acquisition

In an August 19, 2026 [town-hall recap](../../discord/announcements/2026-08-19.md), Neynar was described as seeking a new steward because its Farcaster operating costs were unsustainable. Cassie proposed a funded transition that would use HyperSnap and QStorage to cut costs and potentially combine the Farcaster and Quorum clients. **This was a proposal, not an agreed merger.** Quorum was to continue regardless.

On October 15, **Balaji Srinivasan's Network School acquired Farcaster from Neynar**, including the app, protocol repositories, and related products. Its new direction for the main client, presented as a Network State Protocol, introduced a "social smart contract" and a Network Code enforced by the new operator. This was not the community-led transition described in August. From the perspective of HyperSnap contributors and users who wanted an open, independently governed social network, it was an aggressive takeover of the project's direction. Ownership of an app and repositories is not ownership of every user's keys or all possible clients built on the protocol. The acquisition and new app rules were reported by [The Block](https://www.theblock.co/news/ecosystems/2026-10-15-network-school-acquires-farcaster-from-neynar-418720).

### Retroactive bans and the moderation backlash

Network School **applied its new rules to posts made before the acquisition**. Balaji said humans and AI reviewed millions of historical posts to select accounts for restrictions, and described an appeals process. The planned moderation system also uses an AI model with manual oversight. Reports described users receiving read-only restrictions over months-old posts, including posts that users disputed as harmless. The publicly available reporting does **not** establish a verified total of banned users, a measured false-positive rate, or that every decision was made autonomously by an AI bot. It does establish that automated review was part of a retroactive enforcement process and that the resulting restrictions provoked substantial backlash. The [contemporaneous report in The Block](https://www.theblock.co/news/ecosystems/2026-10-15-network-school-acquires-farcaster-from-neynar-418720) describes reported restrictions and explicitly says it could not independently verify individual bans.

Cassie said [on October 16](../../discord/general-recap/2026-10-16.md) that **she herself had been banned** for her posts. Long-standing community members also described restrictions, but available sources do not provide a reliable count or a complete audit of individual cases. The distinction matters: a ban from Network School's main app does not necessarily remove a user's keys, posts, or ability to use another Farcaster-compatible client. It does, however, show how much power a single client operator can exercise over access and visibility, even when the underlying protocol remains open.

### Community response and the full-fork direction

The acquisition and retroactive bans accelerated interest in HyperSnap and Quorum rather than resolving the Farcaster split. In the [October 16 Discord recap](../../discord/general-recap/2026-10-16.md), Cassie estimated that roughly two-thirds of the remaining users of the original purple app had migrated to Quorum/HyperSnap; treat this as her estimate, **not an independently measured platform statistic**. She also described heightened activity in the HyperSnap group and new contributors working on Quorum and a HyperSnap web app. Quorum was already posting to HyperSnap but still used some Farcaster APIs. The full fork is a direction and ongoing effort, not proof that migration or technical separation is complete.

The people and developer culture that made Farcaster valuable have not vanished because its reference app changed hands. HyperSnap's independent governance and Quorum's alternative client are attempts to preserve that community without depending on one company's moderation or validator decisions.

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
| August 2026 | Full-fork direction discussed; August 19 town hall proposes a Neynar-to-Quorum/HyperSnap transition, not a completed agreement |
| October 15, 2026 | Network School acquires Farcaster from Neynar; new rules applied retroactively to old posts and accounts restricted |
| October 16, 2026 | Cassie reports her own ban, a migration toward Quorum/HyperSnap, and remaining Farcaster API dependencies |

---

*Last updated: 2026-10-17*
