# 0003. Cloudflare Email Routing for inbound feedback

- **Status**: accepted
- **Date**: 2026-05-16
- **Deciders**: project owner, agent

## Context

The footer added in commit `2fb13b9` exposes a `mailto:feedback@refactoringintheloop.com` link. The address has to actually receive mail. The domain is on Cloudflare DNS + Cloudflare Pages, with no prior email setup.

Three options were considered:

1. **A real feedback form** posting to a Cloudflare Pages Function that sends outbound email via Resend, with KV-based rate-limiting and a honeypot — covered in a draft plan that was rejected.
2. **A dedicated mailbox provider** (Fastmail, Google Workspace, Proton) — one-click setup, but ~$3–6/mo per mailbox and ongoing management for a side project that receives only occasional feedback.
3. **Cloudflare Email Routing** — free, inbound-only, forwards arbitrary `<alias>@<domain>` addresses to a verified destination inbox. Already native to the Cloudflare stack; no new vendor.

The owner rejected option 1 with "too much tooling for just email for now" — Resend signup + DNS verification records + Pages secret + a new validator/rate-limiter + a new dialog UI was disproportionate for a side project's contact link. Option 2 was unnecessary cost given no need to send _from_ the address. Option 3 covers the actual requirement (inbound forwarding) with zero infra.

## Decision

We will use **Cloudflare Email Routing** for inbound mail to `refactoringintheloop.com`.

- **Custom addresses** route to the project owner's personal inbox:
  - `feedback@refactoringintheloop.com` → `wallace.drew@gmail.com`
  - `dev@refactoringintheloop.com` → `wallace.drew@gmail.com`
- **Catch-all** stays **disabled** so unrouted addresses bounce back to the sender (typo signal) rather than silently disappearing.
- **DNS records** (3× MX `route{1,2,3}.mx.cloudflare.net`, 1× SPF `v=spf1 include:_spf.mx.cloudflare.net ~all`) are managed automatically by Cloudflare and not duplicated in the repo or in `wrangler.toml`.
- **No outbound sending** capability — replying to a forwarded message goes from the destination Gmail address, not from the alias. The site does not send transactional mail.
- Configuration lives **only** in the Cloudflare dashboard. Nothing in the repo references the destination address (no env var, no secret, no source-code constant). The decision is captured here so future-agent / future-self can find it; the source of truth is the dashboard.

Operational reference: see `docs/email-routing.md` for setup steps, troubleshooting, and how to add additional aliases.

## Consequences

**Easier:**

- Zero infrastructure code: no Pages Function, no env var, no secret rotation, no rate-limiter, no anti-spam logic to maintain.
- Zero recurring cost — Email Routing is free at any volume for receive-only.
- Free DKIM / SPF / spam scoring at the relay via Cloudflare's reputation, observable in the dashboard activity log.
- Adding new aliases (e.g. `support@`, `careers@`) is a one-click dashboard task and doesn't touch the repo.

**Harder / new constraints:**

- We cannot send mail **as** `feedback@refactoringintheloop.com`. Replies go from the destination Gmail address, which means recipients of a reply see `wallace.drew@gmail.com` — a small identity-leakage concern, mitigable only by adopting option 1 or 2.
- The destination inbox owner is the de-facto support contact. If this stays a solo project, fine. If multiple maintainers ever need to triage feedback, we'll need to either add destinations or move to a shared mailbox.
- Forwarded mail occasionally lands in the destination inbox's spam folder despite Cloudflare's "Safe" classification. Mitigated with a per-inbox filter ("never send to spam"), not a system-wide fix.
- If the site ever needs a programmatic feedback form (form post → transactional email → inbox), this ADR will need to be superseded with a new one documenting the outbound-sender choice.

**Follow-up work:**

- None required. The setup is one-time and stable until requirements change.
- If outbound becomes a requirement, the rejected feedback-form plan (Resend + Pages Function + KV rate-limit) is the documented next step — supersede this ADR and revisit.
