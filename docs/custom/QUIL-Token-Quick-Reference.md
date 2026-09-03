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

> **⚠️ Status (2026-08-12).** Two halves, both true:
>
> **Live:** **wQUIL** on Ethereum is live and tradeable right now. The contract, DEX and CEX listings and market trackers below are all accurate and usable today.
>
> **Not live:** **native QUIL** is still locked. The token shard-out has not completed, so mining reward payouts, token transactions and bridging are switched off. Nodes prove and accrue coverage, but operators are not being paid out, and native QUIL cannot currently be moved or bridged.
>
> In short: wQUIL trades, but the route to convert native QUIL into it is not open yet. See [Mainnet Status](Mainnet-Status-What-Is-Live.md).

- **Native token**: $QUIL — earned by running nodes on the Quilibrium network (reward payouts not yet enabled, see above). $QUIL lives on the Quilibrium chain and is not directly tradeable on Ethereum exchanges.
- **Wrapped token**: $wQUIL — ERC-20 on Ethereum, created by bridging native $QUIL via the Quilibrium Bridge (**bridge not currently live**; the bridge page has not been published yet). Bridging is a lock-and-mint operation run through `qclient`, with the commands documented under [bridging](https://docs.quilibrium.com/docs/run-node/qclient/commands/bridging). $wQUIL is the tradeable form on Ethereum DEXs and CEXs.
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
*Last updated: 2026-09-03*
