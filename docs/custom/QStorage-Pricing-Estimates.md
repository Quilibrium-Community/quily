---
title: "QConsole Pricing and Website Hosting Cost Estimates"
source: Community Contribution (Issue #93)
date: 2026-07-29
type: technical_reference
topics: [q-storage, qconsole, pricing, cost, website-hosting, qkms, relational, fx, aws-comparison]
---

# QConsole Pricing and Website Hosting Cost Estimates

Rates for Quilibrium's QConsole services, plus worked examples for estimating what it costs to host
a website on QStorage.

> **These are estimates, not quotes, and the rates below may be out of date.** Pricing changes and
> this document is not updated automatically. Always check the live site,
> [quilibrium.com](https://quilibrium.com), for current pricing before committing to a budget.

## Free Tier

**5 GB free.** No surprise fees. You can pay in fiat or crypto ($QUIL, $wQUIL, or $USDC, with USDC
converted to the network's $QUIL). All pricing is denominated in USD, with crypto conversion at the
market rate at time of billing.

## Rate Card

| Service | What it is | Unit | Quilibrium | AWS equivalent |
|---|---|---|---|---|
| **QStorage** | S3-compatible object storage | Upload | **$0.02** / GB | $0.023 |
| | | API calls | **$0.0005** / 1k calls | $0.005 |
| **QKMS** | Non-custodial key management (MPC) | API calls | $0.02 / 1k calls | $0.03 |
| | | Keys | **Free** | $1.00 each |
| **Relational** | SQL/CQL-compatible databases | Storage | $0.05 / GB | $0.10 |
| | | Requests | $0.05 / million | $0.20 |
| **F(x)** | Confidential function compute | Execution | $0.00001 / GB·s | $0.0000133334 |
| | | Requests | **Free** | $0.20 / million |

Notes:

- AWS figures are list pricing at base tier for the most equivalent offering, and do not apply
  AWS's own free tier.
- QKMS is non-custodial per NYDFS regulations covering key custody operations for cryptocurrencies.

## How to Calculate a Cost Estimate

The cost is simply the sum of each unit of usage multiplied by its rate:

```
total = (billable GB x $0.02) + (thousands of API calls x $0.0005)
```

For website hosting on QStorage, the two inputs that matter are:

1. **How much you upload** (GB): the total size of the site's files, i.e. HTML, CSS, JS, images,
   video, and downloadable assets. Subtract the 5 GB free tier to get billable GB.
2. **How many API calls you serve** (in thousands): roughly `monthly visits x requests per page`.
   Every file the browser fetches is one request, so a page loading 25 assets is about 25 requests.

## Worked Examples

The three examples below use the method above. Substitute your own numbers to estimate any site.
Traffic assumptions are illustrative, and real request counts vary a lot with caching and page
design.

### Personal site or blog

Small static site, light traffic.

| Input | Assumption |
|---|---|
| Site assets | 1 GB |
| Monthly visits | 5,000 |
| Requests per page | 25 |

- Upload: 1 GB is inside the 5 GB free tier, so **$0.00**
- API calls: 5,000 x 25 = 125,000 calls = 125 units of 1k, so 125 x $0.0005 = **$0.06**

**Estimated total: about $0.06 per month.** The same usage on AWS would be roughly $0.65, so about
90% less.

### Business or corporate site

Larger marketing site with images, PDFs, and some video.

| Input | Assumption |
|---|---|
| Site assets | 20 GB |
| Monthly visits | 50,000 |
| Requests per page | 30 |

- Upload: 20 GB minus 5 GB free = 15 GB billable, so 15 x $0.02 = **$0.30**
- API calls: 50,000 x 30 = 1,500,000 calls = 1,500 units of 1k, so 1,500 x $0.0005 = **$0.75**

**Estimated total: about $1.05 per month.** The same usage on AWS would be roughly $7.96, so about
87% less.

### Ecommerce site

Media-heavy catalogue with high traffic.

| Input | Assumption |
|---|---|
| Site assets | 100 GB |
| Monthly visits | 200,000 |
| Requests per page | 40 |

- Upload: 100 GB minus 5 GB free = 95 GB billable, so 95 x $0.02 = **$1.90**
- API calls: 200,000 x 40 = 8,000,000 calls = 8,000 units of 1k, so 8,000 x $0.0005 = **$4.00**

**Estimated total: about $5.90 per month.** The same usage on AWS would be roughly $42.30, so about
86% less.

## Caveats

- **Billing model.** The QConsole pricing calculator bills QStorage per GB **uploaded** with a
  single blended API rate. The QStorage user manual describes the model slightly differently, as
  per-GB stored with separate rates for PUT/COPY/POST/LIST versus GET requests, and mentions
  possible data transfer charges. Where the two differ, check the live pricing on
  [quilibrium.com](https://quilibrium.com), which reflects what actually bills you.
- **Data transfer** is not a line item in the public rate card. If your workload moves large volumes
  out of QStorage, confirm whether transfer is billed separately before budgeting for it.
- **Request counts are the hard part to estimate.** Storage size is easy to measure; request volume
  depends on traffic, caching, and how many assets each page loads. When in doubt, estimate high.

## Cost Management Tips

- Implement lifecycle policies to automatically transition or expire objects.
- Use object tagging for detailed cost allocation and tracking.
- Reduce per-page requests (bundle assets, use sprites, enable caching) since API calls dominate the
  bill for high-traffic sites.

*Last updated: 2026-07-29*
