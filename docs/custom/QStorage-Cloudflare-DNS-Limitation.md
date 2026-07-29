---
title: "QStorage: Cloudflare DNS CNAME Cross-User Limitation"
source: Community Contribution (Issues #40, #97, #98)
date: 2026-07-29
type: technical_reference
topics: [q-storage, DNS, CNAME, Cloudflare, website-hosting, custom-domain, SSL, troubleshooting]
---

# QStorage: Cloudflare DNS CNAME Limitation

Custom domains on QStorage **do work**. The one configuration that reliably fails is pointing a
**Cloudflare-managed domain** at a QStorage bucket. This document explains why, and what to do instead.

## The Problem

When pointing a custom domain to QStorage using a CNAME record (`bucketname.qstorage.quilibrium.com`), domains managed by **Cloudflare DNS** will fail with:

> **Error 1014 - CNAME Cross-User Banned**
>
> "The host is configured as a CNAME across accounts on Cloudflare, which is not allowed by Cloudflare's security policy."

This happens because Cloudflare blocks CNAME records that point to a domain in a different Cloudflare account. Since QStorage's endpoint (`qstorage.quilibrium.com`) sits behind Cloudflare, any other Cloudflare-managed domain trying to CNAME to it is blocked.

## Who Is Affected

Any user whose domain DNS is managed through Cloudflare (free, pro, or business plans).

## Important: "DNS only" (grey cloud) Does NOT Fix This

> **Corrected July 2026.** Earlier versions of this document listed "disable the Cloudflare proxy /
> set the record to DNS only (grey cloud)" as a workaround. **This does not work.** A community
> member confirmed that grey-clouding the CNAME still returns Error 1014.

This is expected behaviour, not a bug. Cloudflare's own documentation states the restriction is
resolved by the **owner of the CNAME target**, not by the person creating the record:

> "Cloudflare prohibits a DNS CNAME record between domains in different Cloudflare accounts."
>
> "...the domain owner of the CNAME target must use Cloudflare for SaaS."
>
> — [Cloudflare, Error 1014 - CNAME Cross-User Banned](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1014/)

Cloudflare does not list DNS-only mode as a resolution anywhere. Toggling the proxy changes nothing
about the cross-account relationship that triggers the ban, so the error persists.

## What Actually Works

**Use a DNS provider other than Cloudflare for the domain you want to point at QStorage.**

Move the domain's nameservers to your registrar's own DNS, or to a provider such as Namecheap DNS,
Google Cloud DNS, or Route 53, then create the CNAME there. This is the standard, working path, and
users have successfully served custom domains from QStorage this way.

QConsole also supports **registering a custom domain and uploading your own SSL certificate**, which
is how the domain gets recognised at the edge. See QConsole for the current procedure (the exact
steps are not yet mirrored into these docs).

> **Allow time for DNS propagation.** Changing nameservers is not instant. Propagation commonly takes
> several hours and can take up to 24-48 hours. Errors seen within the first few hours of a
> nameserver change usually mean propagation is still in progress, not that the setup is wrong.

## Troubleshooting: Which Error Means What

| Error | Most likely cause | What to do |
|---|---|---|
| **1014** — CNAME Cross-User Banned | The domain is still on **Cloudflare DNS**. Grey-clouding will not help. | Move the domain's DNS off Cloudflare entirely. |
| **1001** — DNS resolution error | The hostname is not resolving at the edge yet: nameserver change still propagating, the CNAME record is wrong, or the domain has not been registered in QConsole. | Wait for propagation, verify the CNAME target, and confirm the domain is registered with its certificate uploaded in QConsole. |
| **TLS handshake failure / no certificate served** | The custom domain is not yet provisioned at the edge. | Confirm the domain is registered in QConsole and the certificate upload completed. If it persists well past DNS propagation, report it in Discord. |

## Status History

- **March 2026:** Manual domain setup with SSL certificate upload announced as in progress, no timeline given.
- **July 2026:** Custom domain registration with SSL certificate upload is available in QConsole. Cloudflare-managed source domains remain incompatible for the reason described above; this is a Cloudflare policy constraint, not a QStorage limitation.

## Reference

- [Cloudflare: Error 1014 - CNAME Cross-User Banned](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1014/)

*Last updated: 2026-07-29*
