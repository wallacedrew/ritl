# 0015. Migrate primary domain to refactorplug.com

- **Status**: accepted
- **Date**: 2026-06-27
- **Deciders**: project owner, agent

## Context

The site shipped under `refactoringintheloop.com`. The owner acquired the shorter `refactorplug.com` and wants it to be the canonical domain. Both domains are held by the owner; the old domain has existing inbound links and the `feedback@` / `dev@` aliases established in ADR-0003.

The domain is not configured in the repo — per ADR-0003, the custom domain, DNS, and Email Routing live only in the Cloudflare dashboard, with the source tree carrying nothing but human-readable references (homepage URLs, mailto links, docs, UI copy). So the migration is two independent halves: a set of string updates in the repo, and a set of Cloudflare operations.

## Decision

We will make **`refactorplug.com`** the canonical domain for the site.

- **Custom domain**: add `refactorplug.com` to the Cloudflare Pages project `ritl`. The `pages.dev` URL and the Pages project name stay `ritl` (internal identifiers, not user-facing).
- **Old domain**: `refactoringintheloop.com` issues a **permanent 301 redirect** to `refactorplug.com`, preserving path and query, so existing links keep working. The old zone stays on Cloudflare to host the redirect rule.
- **Email**: the **Cloudflare Email Routing mechanism from ADR-0003 is unchanged** — only the domain moves. `feedback@refactorplug.com` and `dev@refactorplug.com` forward to the owner's Gmail; catch-all stays disabled. The destination address is account-level and already verified, so no re-verification is needed. ADR-0003 stands as the historical mechanism decision; this ADR records the domain change.
- **Repo references**: every human-readable mention of the old domain moves to the new one — plugin and marketplace `homepage`, mailto links and their assertions, README, the email-routing operational doc, snippet copy, and UI strings. The single exception is the historical body of ADR-0003, which is immutable and left intact.

## Consequences

**Easier:**

- Shorter, more memorable canonical domain.
- Existing inbound links survive via the 301; no link rot.
- No new email infrastructure — the ADR-0003 setup is reused verbatim on the new zone.

**Harder / new constraints:**

- Two zones remain under management (the new canonical zone plus the old zone hosting the redirect) until the owner chooses to retire the old domain.
- DNS propagation and Cloudflare SSL provisioning for the new custom domain take minutes to ~an hour; the new domain is not instantly live after the API calls.
- Any external references to the old domain that the owner does not control (third-party links) rely on the 301 staying in place indefinitely.

**Follow-up work:**

- Optional: add `metadataBase` / canonical SEO config (none exists today) so generated metadata points at the new domain explicitly. Parked, not part of this migration.
