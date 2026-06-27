# Email routing

`refactorplug.com` doesn't run a real mailbox. Custom addresses are routed inbound-only through **Cloudflare Email Routing** to the project owner's personal inbox.

## What's configured

| Custom address              | Action          | Destination              |
| --------------------------- | --------------- | ------------------------ |
| `feedback@refactorplug.com` | Send to email   | `wallace.drew@gmail.com` |
| `dev@refactorplug.com`      | Send to email   | `wallace.drew@gmail.com` |
| catch-all                   | drop (disabled) | —                        |

The footer's "Feedback" mailto link in `src/shared/components/SiteFooter.tsx` targets the first row above.

## Auth signals

DNS records that Cloudflare Email Routing manages automatically:

- **MX**: `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, `route3.mx.cloudflare.net`
- **SPF (TXT)**: `v=spf1 include:_spf.mx.cloudflare.net ~all`

Verify from a terminal:

```
dig MX refactorplug.com +short
dig TXT refactorplug.com +short
```

## What this setup does and doesn't do

| Capability                                          | Status                                                                                  |
| --------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Receive mail at `<address>@refactorplug.com`        | ✅ via Email Routing                                                                    |
| Forward transparently to the destination inbox      | ✅                                                                                      |
| Reply to original sender from the destination inbox | ✅ (reply goes from the real Gmail, not from the alias)                                 |
| Send mail **as** `<address>@refactorplug.com`       | ❌ — would require a transactional sender (Resend, Postmark) or a real mailbox provider |
| Programmatic outbound from a Pages Function         | ❌ — same as above                                                                      |
| Log into a mailbox you can read directly            | ❌ — Email Routing is forward-only                                                      |

## Adding a new address

Cloudflare dashboard → `refactorplug.com` → **Email** → **Email Routing** → **Routing rules** → **Create address**:

1. Custom address: enter the local-part (e.g. `support`).
2. Action: **Send to an email**.
3. Destination: pick a previously-verified address.
4. Save. The address is live immediately.

To add a new destination, go to **Destination addresses** first and verify it via the email Cloudflare sends to that address.

## Troubleshooting

| Symptom                                        | Likely cause                                     | Fix                                                               |
| ---------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| Test message bounces immediately               | DNS hasn't propagated since enable               | Wait 5–30 minutes; re-run `dig MX …` to confirm                   |
| Test message arrives in Gmail spam             | Edge-case spam classifier mismatch               | Gmail filter "to:<alias>@refactorplug.com" → "Never send to spam" |
| Destination missing emails entirely            | Master Email Routing switch off                  | Settings → toggle **Email Routing: On**                           |
| Cloudflare shows `Dropped` in the activity log | Sender failed SPF/DKIM and Cloudflare blocked it | Inspect the activity log entry — usually a misconfigured upstream |

## When to revisit this

- If outbound sending **as** the alias becomes a requirement (e.g. transactional confirmations from a real feedback form), revisit by writing a new ADR — see `docs/architecture/0003-...`. Resend + Cloudflare Pages Functions is the documented next step.
- If inbound volume grows past casual feedback (e.g. hundreds of messages/day), Email Routing's free tier is unlimited for receive, but the destination inbox may become the bottleneck. At that point, a dedicated mailbox provider (Fastmail / Google Workspace) becomes worth the cost.
