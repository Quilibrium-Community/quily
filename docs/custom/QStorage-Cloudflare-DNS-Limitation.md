---
title: "QStorage: Cloudflare DNS CNAME Cross-User Limitation"
source: Community Contribution (Issue #40)
date: 2026-03-28
type: technical_reference
topics: [q-storage, DNS, CNAME, Cloudflare, website-hosting, troubleshooting]
---

# QStorage: Cloudflare DNS CNAME Limitation

## The Problem

When pointing a custom domain to QStorage using a CNAME record (`bucketname.qstorage.quilibrium.com`), domains managed by **Cloudflare DNS** will fail with:

> **Error 1014 - CNAME Cross-User Banned**
>
> "The host is configured as a CNAME across accounts on Cloudflare, which is not allowed by Cloudflare's security policy."

This happens because Cloudflare blocks proxied CNAME records that point to a different Cloudflare account's domain. Since QStorage's proxy (`qstorage.quilibrium.com`) is behind Cloudflare, any other Cloudflare-managed domain trying to CNAME to it is blocked.

## Who Is Affected

Any user whose domain DNS is managed through Cloudflare (free, pro, or business plans). Cloudflare only allows cross-account CNAME resolution on their Enterprise plan, which they treat as an upsell feature.

## Current Status

> **As of March 2026:** The Quilibrium team is working on a workaround that will allow manual domain setup on the QStorage service. This requires an SSL certificate upload. No timeline has been announced yet.

## Workarounds

1. **Use a non-Cloudflare DNS provider** for the domain you want to point to QStorage. Many registrars offer free DNS management, or you can use providers like Namecheap DNS, Google Cloud DNS, or Route 53.

2. **Disable Cloudflare proxy (orange cloud)** for the specific CNAME record. Set it to "DNS only" (grey cloud). This bypasses Cloudflare's proxy and avoids the cross-user ban, but you lose Cloudflare's CDN and DDoS protection for that subdomain.

3. **Wait for the official workaround** from the Quilibrium team (manual domain binding with SSL cert upload).

## Reference

- Cloudflare documentation: [Error 1014 - CNAME Cross-User Banned](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1014/)
