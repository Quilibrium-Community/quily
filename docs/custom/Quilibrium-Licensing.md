---
title: "Quilibrium Licensing — AGPL and Per-Project License Details"
source: Community Contribution (Issue #108)
date: 2026-08-11
type: technical_reference
topics:
  - license
  - licensing
  - AGPL
  - AGPL-3.0
  - GPL
  - GPL-3.0
  - MIT
  - copyleft
  - open source
  - fork
  - commercial use
  - Affero clause
  - SaaS loophole
  - license interpretation
  - can I build on Quilibrium
  - closed source app
  - alternative network
  - fork Quilibrium
  - status monitor
  - container deployment
  - cloud provider
  - vendored dependencies
  - Klearu license
  - MetaVM license
  - Quorum license
  - SDK license
  - source code
---

# Quilibrium Licensing

Quilibrium's core protocol is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
Individual projects in the ecosystem vary: most are AGPL-3.0, Klearu carries AGPL-3.0 plus additional
non-commercial terms, and the SDKs are MIT.

> **Not legal advice.** This is a summary of what the license files in the public repositories say.
> For anything with real consequences (shipping a product, a commercial deployment, a fork), read the
> LICENSE file in the repository you are actually using and consult a lawyer.

## What AGPL-3.0 Means in Practice

The AGPL is the strongest of the common copyleft licenses. In practical terms:

- **You can use, modify, and redistribute the code**, including for commercial purposes. AGPL is not
  a non-commercial license. Selling services built on AGPL software is explicitly allowed.
- **Derivatives stay AGPL.** If you fork the code or build a derivative work, that work must also be
  released under the AGPL. You cannot take the code, close the source, and ship it as proprietary
  software.
- **You must preserve copyright and license notices**, and state the changes you made.
- **You must provide the corresponding source** to anyone who receives the binary.
- **The Affero clause (Section 13) closes the "SaaS loophole."** This is the one thing that separates
  AGPL from plain GPL. Under GPL, if you modify software and run it on your own servers as a network
  service, you never "distribute" it, so you never have to publish your changes. AGPL removes that
  escape: if users interact with your modified version **over a network**, you must offer them the
  corresponding source of your modified version.

There is no contributor license agreement carve-out, no dual-licensing exception, and no "open core"
proprietary tier documented for the core protocol.

## Quilibrium's Own Interpretation of the AGPL

**This is the most important section for anyone building on Quilibrium, and it is easy to miss because
it lives in the monorepo README rather than in the LICENSE file.** Quilibrium publishes an explicit
interpretation of how far the copyleft obligation reaches:

> "Significant portions of Quilibrium's codebase depends on GPL-licensed code, mandating a minimum
> license of GPL, however Quilibrium is licensed as AGPL to accomodate the scenario in which a cloud
> provider may wish to coopt the network software. The AGPL allows such providers to do so, provided
> they are willing to contribute back the management code that interacts with the protocol and node
> software. **To provide clarity, our interpretation is with respect to node provisioning and management
> tooling for deploying alternative networks, and not applications which are deployed to the network,
> mainnet status monitors, or container deployments of mainnet nodes from the public codebase.**"
> — [monorepo README](https://github.com/QuilibriumNetwork/monorepo#license--interpretation)

Two things follow from this.

**Why AGPL at all.** The codebase depends on GPL-licensed components, so GPL is the floor; AGPL was
chosen on top of that to cover the specific case of a cloud provider running the network software as a
service. The target of the Affero clause is a provider who coopts the network, and the thing they owe
back is the management code that interacts with the protocol and node software.

**Where the obligation is understood to bite.** By Quilibrium's own reading, the copyleft obligation is
aimed at **node provisioning and management tooling used to deploy alternative networks**. They
explicitly state it is *not* aimed at:

- **applications deployed to the network** — building an app on Quilibrium does not pull your app into AGPL
- **mainnet status monitors** — dashboards and monitoring tools
- **container deployments of mainnet nodes** from the public codebase — packaging a mainnet node in a container

> **Caveat worth understanding.** This is a statement of the copyright holder's interpretation published
> in a README, not an additional permission formally granted under Section 7 of the AGPL in the LICENSE
> file. In practice it tells you how Quilibrium intends to read its own license, which matters a great
> deal. If you are relying on it for something commercially significant, get it confirmed in writing
> rather than depending on a README line.

Note that this is **not** a restriction on where you may deploy. It is the opposite: a narrowing of when
the copyleft obligation applies. The one project that genuinely restricts deployment to the Quilibrium
mainnet is Klearu, via its additional terms (see below).

### Why Quilibrium uses it

The official documentation frames AGPL as a governance mechanism rather than a legal formality:

> "Open Source Governance: The project is licensed under AGPL which ensures its principles cannot be
> compromised." — [The Illusion of Decentralization in Crypto](https://docs.quilibrium.com/docs/discover/the-illusion-of-decentralization-in-crypto-and-quilibriums-radical-alternative)

It also has a direct effect on node operators. Because the client is AGPL, operators who modify the
client to optimize their own rewards are obligated to contribute those modifications back:

> "due to the project's license being AGPL, node-runners who make direct alterations to the client are
> legally obligated to share their changes back upstream to the project's code-base."
> — [How does Quilibrium maintain decentralization?](https://docs.quilibrium.com/docs/discover/how-does-quilibrium-maintain-decentralization)

## Per-Project Licenses

Verified directly from the LICENSE files in each public repository on **2026-08-11**. Licenses change;
if this matters to you, check the repository itself.

**This list covers the repositories that carry a license file.** Quilibrium has more public
repositories than the ones below (see [Quilibrium Public Repositories](https://github.com/Quilibrium-Community/quily/blob/main/docs/custom/Quilibrium-Public-Repositories.md)
for the full list). A repository's absence from this table is not a statement about its licensing, only
that it is not covered here yet. Ask the maintainers if you need certainty about a specific repository.

### Core Protocol

| Project | Repository | License |
|---|---|---|
| Quilibrium protocol, libraries, light client | [monorepo](https://github.com/QuilibriumNetwork/monorepo) | AGPL-3.0 (unmodified) + [published interpretation](#quilibriums-own-interpretation-of-the-agpl) |
| MetaVM (ZK/MPC VM framework) | [metavm](https://github.com/QuilibriumNetwork/metavm) | AGPL-3.0 (unmodified) |
| Klearu (encrypted ML runtime) | [klearu](https://github.com/QuilibriumNetwork/klearu) | AGPL-3.0 **with additional non-commercial terms** (see below) |

The monorepo, metavm, and quorum-desktop LICENSE files are **byte-identical to each other** (34,522
bytes, blob `bae94e1`): the stock, unmodified AGPL-3.0 text with no Quilibrium-specific clauses added.
Klearu's is the only one with terms appended. Any Quilibrium-specific reading of the license comes from
the interpretation section above, not from modified license text.

### Quorum Messenger

| Project | Repository | License |
|---|---|---|
| Desktop client | [quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) | AGPL-3.0 |
| Mobile client (iOS / Android) | [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile) | GPL-3.0 |

> **Note on quorum-mobile.** Its LICENSE file is the plain GPL-3.0 text rather than AGPL-3.0, unlike the
> desktop client. The two are distinguishable by Section 13: AGPL-3.0's Section 13 is titled *"Remote
> Network Interaction; Use with the GNU General Public License"* (the network-service clause), while
> GPL-3.0's Section 13 is titled *"Use with the GNU Affero General Public License"* (merely a
> compatibility pointer). quorum-mobile has the latter.
>
> Since quilibrium.com describes Quorum as "fully open source under AGPL," this may be an oversight in
> the repository rather than a deliberate choice, and community maintainers are checking with the
> Quilibrium lead dev. Until that is confirmed, quorum-mobile is GPL-3.0 as published. Do not read this
> as a statement that Quilibrium intends the mobile client to be non-AGPL.

### SDKs

| Project | Repository | License |
|---|---|---|
| JS SDK for channels | [quilibrium-js-sdk-channels](https://github.com/QuilibriumNetwork/quilibrium-js-sdk-channels) | MIT |
| Rust Verkle tree SDK | [quilibrium-rs-sdk-verkle](https://github.com/QuilibriumNetwork/quilibrium-rs-sdk-verkle) | MIT |
| QNS names SDK | [quilibrium-names-sdk](https://github.com/QuilibriumNetwork/quilibrium-names-sdk) | MIT |

The SDKs being MIT is deliberate and useful: MIT is permissive, so you can build **closed-source**
applications on top of these SDKs without your application inheriting copyleft obligations. The
copyleft applies to the protocol implementation, not to what you build against its client libraries.

### Vendored third-party components

The monorepo contains around 25 nested LICENSE files. Most cover **vendored third-party dependencies**
that keep their original, more permissive licenses rather than being relicensed under AGPL. For example:

| Component | License |
|---|---|
| `crates/bls48581` | Apache-2.0 |
| `nekryptology` | Apache-2.0 |
| `bedlam` | MIT |
| `crates/ed448-rust`, `crates/dkls23`, `go-libp2p-blossomsub` | dual MIT / Apache-2.0 |
| `go-libp2p`, `go-libp2p-kad-dht`, `go-multiaddr`, `go-multiaddr-dns`, `pebble`, `emp-ot`, `emp-tool` | own upstream licenses |

If you are extracting a specific component rather than the protocol as a whole, check that component's
own LICENSE file: it may be considerably more permissive than the repository-level AGPL.

## Klearu's Additional Terms

Klearu (described in the official docs under
[network intrinsics](https://docs.quilibrium.com/docs/learn/network-intrinsics/klearu)) is the one
project that departs meaningfully from standard AGPL. It is AGPL-3.0 **plus additional terms under
Section 7 of the AGPL**, which the license states shall prevail in the event of conflict. The
repository's own README summarises it as:

> "AGPL-3.0 with additional terms. Commercial use is restricted to the Quilibrium mainnet. Automated
> reproduction (including LLM-assisted 'clean room' reimplementation) for commercial substitutes is
> expressly prohibited."

Cassie's summary:

> "Went with AGPL + non-commercial outside of Q mainnet for now."

The two substantive additions:

**1. Restriction on commercial use.** You may not use, distribute, or exploit Klearu for "Commercial
Purposes" — defined as use primarily directed toward commercial advantage or monetary compensation,
including incorporating it into a commercial product, offering it as part of a paid service or hosted
platform, or using it to provide services to third parties for a fee.

**The Quilibrium mainnet exception:** that restriction does **not** apply when use occurs exclusively
through, on, or in direct connection with the Quilibrium mainnet. Running Klearu as a node operator,
service provider, or application developer on mainnet, including earning protocol rewards and fees, is
expressly permitted. So Klearu is commercially usable **on Quilibrium** and non-commercial everywhere
else.

**2. Prohibition on automated reproduction for commercial substitutes.** You may not use LLMs, ML
systems, or other automated tooling to analyze, decompose, or reverse-engineer Klearu in order to
produce a "Competing Work" — software with substantially similar functionality intended for commercial
purposes — regardless of whether it is framed as a clean-room implementation. This explicitly covers
automated analysis of documentation and summaries derived from the code, not just the source itself.

It does *not* prohibit using AI tools to contribute to Klearu itself, to study it non-commercially, or
to build unrelated software.

Violating the additional terms terminates your license rights under AGPL Section 8.

## Common Questions

**Can I fork Quilibrium and launch my own network?** Yes, that is what AGPL permits. Your fork must
also be AGPL, with source available to anyone who uses it over a network. Note that this is precisely
the case Quilibrium's published interpretation points at: node provisioning and management tooling for
deploying **alternative networks** is where they read the copyleft obligation as applying, so expect to
contribute that tooling back. You would not be entitled to use Quilibrium's trademarks or claim
affiliation.

**Can I run a business on Quilibrium?** Yes. AGPL does not restrict commercial use. Running nodes,
selling services, and building products on the network are all permitted. Note that Klearu specifically
requires that commercial use happen on the Quilibrium mainnet.

**Can I build a closed-source app on Quilibrium?** Yes. You can build against the MIT-licensed SDKs or
interact with the network over its APIs, and copyleft attaches to derivative works of the AGPL code
rather than to independent applications that talk to the network. Quilibrium also states this directly:
their interpretation excludes "applications which are deployed to the network" from the obligation.

**Can I run a mainnet status monitor or ship mainnet nodes in containers?** Yes. Quilibrium's published
interpretation explicitly names "mainnet status monitors" and "container deployments of mainnet nodes
from the public codebase" as outside what they read the copyleft obligation to cover.

**Do I have to publish my node configuration or private keys?** No. AGPL covers the source code of the
program, not your data, keys, or configuration.

**I modified the node client and run it privately. Do I owe anything?** If nobody else interacts with
it over a network and you do not distribute it, AGPL imposes no publication obligation. In practice a
Quilibrium node participates in the network by definition, and the official docs treat client
modifications by node operators as carrying an upstream contribution obligation.

---
*Last updated: 2026-09-03*
