---
title: "QUIL Token — Quick Reference"
source: official
date: 2026-08-12
type: technical_reference
topics:
  - QUIL
  - wQUIL
  - token
  - contract address
  - exchanges
  - Uniswap
  - MEXC
  - CoinGecko
  - CoinMarketCap
  - DexTools
  - trading
  - where to buy
---

# QUIL Token — Quick Reference

$QUIL fuels the Quilibrium network — enabling access, participation, and rewards. It is your key to engaging with the protocol and its community.

$QUIL is a utility token. It is not intended for speculation, investment, or financial gain. Quilibrium Inc. does not endorse or facilitate any trading activities related to $QUIL or $wQUIL.

## Key Facts

> **Status (2026-11-02).** Mainnet is live and the token is running:
>
> **Live:** native **QUIL** is earned by provers (mining rewards are being issued), and QUIL transfers work on the Quilibrium network, including confidential "shielded" coins. Legacy 2.0-era coins are moved into the new format with `qclient token shield-all`. **wQUIL** on Ethereum is also live and tradeable; the contract, DEX and CEX listings and market trackers below are accurate.
>
> **Still to come:** the **bridge** between native QUIL and wQUIL is not open yet (it will support transfers in both directions from the start), and token applications and apps from other developers follow after network stabilisation. Native QUIL cannot yet be bridged out to Ethereum.
>
> See [Mainnet Status](Mainnet-Status-What-Is-Live.md).

- **Native token**: $QUIL — earned by running nodes on the Quilibrium network (rewards are being issued). $QUIL lives on the Quilibrium chain and is not directly tradeable on Ethereum exchanges.
- **Wrapped token**: $wQUIL — ERC-20 on Ethereum, created by bridging native $QUIL via the Quilibrium Bridge (**bridge not open yet**; it is expected to return once the network has settled). Bridging is a lock-and-mint operation run through `qclient`, with the commands documented under [bridging](https://docs.quilibrium.com/docs/run-node/qclient/commands/bridging). $wQUIL is the tradeable form on Ethereum DEXs and CEXs.
- **Fair launch**: No VC allocation, no premine, no airdrops — $QUIL can only be mined. The emissions schedule is generational: each generational milestone temporarily increases emissions before they taper off again, as described on the [Quilibrium Tokenomics](https://docs.quilibrium.com/docs/discover/quilibrium-tokenomics) page.

## wQUIL on Ethereum

All contract addresses, exchange listings, and market trackers below refer to **wQUIL** (wrapped QUIL), the ERC-20 representation on Ethereum — not native $QUIL.

- **wQUIL contract address**: `0x8143182a775C54578c8B7b3Ef77982498866945D`

### Market Trackers

Circulating supply changes continuously as nodes are rewarded, so any figure written into a document
is stale by the time it is read; the live number is on the
[Quilibrium dashboard](https://dashboard.quilibrium.com/).

- **CoinGecko**: https://www.coingecko.com/en/coins/wrapped-quil
- **CoinMarketCap**: https://coinmarketcap.com/currencies/wrapped-quil/#Markets
- **DexTools chart**: https://www.dextools.io/app/en/ether/pair-explorer/0x43e7ade137b86798654d8e78c36d5a556a647224

### Exchanges

#### DEX (Decentralized)

- **Uniswap (ETH/wQUIL)**: https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=0x8143182a775c54578c8b7b3ef77982498866945d

#### CEX (Centralized)

- **MEXC (wQUIL/USDT)**: https://www.mexc.com/exchange/WQUIL_USDT

---

*Last updated: 2026-11-05*
