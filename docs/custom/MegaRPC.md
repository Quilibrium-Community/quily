---
title: "MegaRPC: Privacy-Preserving RPC Service"
source: livestream + discord
author: Cassandra Heart
date: 2026-11-27
type: technical_reference
topics:
  - MegaRPC
  - RPC
  - privacy
  - ORAM
  - oblivious RAM
  - Ethereum RPC
  - Solana RPC
  - wallet privacy
  - IP address
  - metadata leakage
  - Alchemy alternative
  - Infura alternative
  - Q Console
  - not a Q Console service
  - service classification
  - private RPC
  - censorship resistance
---

# MegaRPC: Privacy-Preserving RPC Service

## Availability

MegaRPC is Quilibrium's privacy-preserving blockchain indexing and query service. In March 2026, Cassandra Heart reported that an instance was running, Quorum Mobile was already using it and the Quilibrium Name Service (QNS) had switched to it. The April update described MegaRPC as released and said developer access through Q Console would open later. These reports describe earlier operation and integrations. As of the November 21, 2026 roadmap, the broader public launch for wallets and developers, an SDK shim and Q Console integration were still upcoming. [March State of the Union](https://x.com/QuilibriumInc/status/2038497013600563487). [November roadmap livestream](https://www.youtube.com/watch?v=OppCHV3tsHw)

The November update says QNS depends on MegaRPC. Quorum Mobile and QNS web call the QNS API. That client integration leaves the current MegaRPC routing behind QNS and the coverage of individual wallet operations unconfirmed. [Quorum Mobile QNS client](https://github.com/QuilibriumNetwork/quorum-mobile/blob/d70c7cf/services/api/qnsClient.ts)

## How MegaRPC queries work

A wallet that queries a conventional RPC directly can expose a wallet address in the request along with the requesting IP address. MegaRPC's design uses oblivious RAM (ORAM) lookups to conceal which indexed data the client requests. Quilibrium indexes and formats chain data for those lookups. This privacy property applies to the supported lookup path. Network observers may still see connection metadata, and separate app or transaction flows have their own privacy properties.

MegaRPC speaks an ORAM query format. The planned SDK shim presents familiar interfaces to existing wallet and Web3 libraries and translates supported calls into ORAM queries. The shim is the compatibility layer for developers migrating from ordinary RPC providers such as Alchemy or Infura. The announcement leaves exact method coverage and developer access details open.

## Planned public launch networks

The March announcement discussed Ethereum and Solana. The November public launch plan includes Quilibrium mainnet, most standard EVM chains, Bitcoin, Solana, Bittensor and Kaspa. The list describes planned launch coverage. Current public endpoints and per-network method support remain unconfirmed. The November roadmap also describes the bidirectional QUIL/wQUIL bridge opening as independent of the MegaRPC release.

*Last updated: 2026-11-27*
