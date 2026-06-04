# Architecture Decision Records

Chronological index of ADRs. Numbers are immutable; superseded ADRs stay in place with their status updated.

| Number   | Title                                              | Status                 | Date       | One-line summary                                                                                                    |
| -------- | -------------------------------------------------- | ---------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| ADR-0001 | Adopt Next.js App Router + TypeScript              | accepted               | 2026-05-10 | Rebuild the prototype as a Next.js 16 App Router + TypeScript app to support content-driven slices going forward.   |
| ADR-0002 | Adopt Material UI (v9) with prototype-derived dark | accepted               | 2026-05-10 | Use MUI v9 + Emotion + AppRouterCacheProvider for the component vocabulary; preserve the prototype's palette.       |
| ADR-0003 | Cloudflare Email Routing for inbound feedback      | accepted               | 2026-05-16 | Forward `feedback@refactoringintheloop.com` to the owner's Gmail via Cloudflare Email Routing; no outbound sending. |
| ADR-0004 | Composite patterns use single before/after         | accepted               | 2026-05-27 | Kerievsky composite patterns keep the single `before`/`after` schema; prose and nemesis links carry the journey.    |
| ADR-0005 | Compare-view differentials use voice rubric        | superseded by ADR-0006 | 2026-05-29 | Every `compareDifferential` names one specific mechanical failure mode; banned hedge words and abstract nouns.      |
| ADR-0006 | Agent-side forces carry the contrast               | superseded by ADR-0009 | 2026-05-29 | Remove the `compareDifferential` strapline; the six agent-side force fields carry the human-vs-agent contrast.      |
| ADR-0007 | Kerievsky entries are refactorings, not patterns   | accepted               | 2026-05-31 | Move the 27 Kerievsky entries from `patterns` catalog to `refactorings` catalog; `patterns` becomes GoF-only.       |
| ADR-0008 | Domain-first `src/` layout                         | accepted               | 2026-05-31 | Three top-level domain folders; sub-site landings colocate with data; `CatalogKind` value matches the URL slug.     |
| ADR-0009 | Voice rubric: strict canonical LLM-research terms  | accepted               | 2026-06-03 | Restrict agent-side vocabulary to canonical LLM-research terms + three project exceptions; ban OS-borrow metaphors. |
| ADR-0010 | Agent-side voice and audience contract             | accepted               | 2026-06-03 | Lock modal reader, POV ("the agent"), present-declarative mood, 50-word ceiling, six-field role contract.           |
