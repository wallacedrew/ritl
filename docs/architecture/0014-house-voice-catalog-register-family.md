# 0014. House voice: the catalog-register family

- **Status**: accepted
- **Date**: 2026-06-05
- **Deciders**: project owner, agent

## Context

ADRs 0006, 0009, 0010, 0011, and 0013 govern catalog `forces.{human,agent}` mechanics: six-field structure, vocabulary allow-list, POV, present-declarative mood, no mentalist verbs, 40–60 words per field. Together they pin the catalog row to the page.

They do not cover the **register** — the personality, the tonal posture — of every other surface on the site: the about page, the home page, error messages, page titles, nav copy, editorial paragraphs that wrap or introduce catalog content, and any future worked-example commentary. Until now this register lived only in editorial habit. The memory entry `feedback_neutral_voice.md` ("facts-only, no emotional language or rhetorical emphasis in catalog prose") covered the catalog side but was silent on what a positive register sounds like, and silent on every surface outside the catalog.

A recent conversation surfaced the implicit voice when pressed: a dry, practitioner-to-practitioner reference register, closest to Fowler's own _Refactoring_ catalog. Once named, it became obvious the same register applied across the site and that the lineage was wider than Fowler alone. The five authors who actually wrote the source canon and its discipline literature — Fowler, Beck, Kerievsky, Ottinger, Hill — share a family of registers. Pinning the site's voice to that family gives future drafters (human or LLM agent) an explicit anchor and gives reviewers shared vocabulary for "this is one Ottinger bite too many" or "this paragraph is leaning too tutorial-blog."

## Decision

The house voice belongs to the **catalog-register family** — the same lineage as the five authors whose work the site references and extends. Each name supplies a register; the registers are weighted by surface, not blended evenly.

### The five registers

- **Martin Fowler — _Refactoring_, _Patterns of Enterprise Application Architecture_.** Calm, declarative, recipe-mechanical. The catalog template itself. Lowest personality budget of the five. First-person used sparingly to mark a personal preference where the catalog cannot be prescriptive ("I prefer to extract the helper first"). Specificity carries the prose; adjectives are scarce.
- **Kent Beck — _Tidy First?_, _Extreme Programming Explained_, _Smalltalk Best Practice Patterns_.** Koanic, aphoristic, the fewest words of the five. Short sentences. Emotional honesty about programming — safety, fear, courage — without sentimentality. Strong intuition language balanced by mechanical rigor.
- **Joshua Kerievsky — _Refactoring to Patterns_.** Fowler's template with longer breath. Worked examples written from inside the refactoring journey. Slightly more pedagogical than Fowler — willing to narrate the "why we go this way" while staying declarative.
- **Tim Ottinger — _Agile in a Flash_, long-running blog.** Pithy, slogan-shaped, dry deadpan humor. Willing to name dysfunction directly. The most edge of the five; the closest the family gets to bite. Naming and making-the-implicit-explicit are recurring moves.
- **GeePaw (Michael) Hill — talks, essays, MMMSS, "we make money by making changes."** Folksy precision. Lyric at times. The most personality of the five and the most willing to use metaphor — but metaphors land because they are earned. Strong economic and ethical framing of change.

### Surface weighting

| Surface                                                                     | Dominant register   | Permitted accents                                                              | Personality budget                                                    |
| --------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `forces.{human,agent}` field copy                                           | Fowler              | none — ADRs 0006/0009/0010/0011/0013 outrank this ADR                          | zero                                                                  |
| Catalog editorial wrappers (intros, section headers, cross-reference prose) | Fowler              | Beck koan-density where one short line says it                                 | zero                                                                  |
| Nav copy, page titles, error messages, alt text                             | Fowler              | Beck compression                                                               | zero                                                                  |
| About page, home page                                                       | Fowler              | one Ottinger-shaped bite per page max; Beck koan permitted; no GeePaw metaphor | one sharp sentence per page                                           |
| Worked-example commentary (if/when added)                                   | Kerievsky on Fowler | Beck koan-density at transition lines                                          | one Ottinger bite per worked example                                  |
| ADRs and contributor-facing docs                                            | Fowler with GeePaw  | GeePaw framing where the rationale is economic/ethical; Beck koan permitted    | one sharp sentence per ADR; metaphors permitted if they earn the line |

### POV and mood

- Third person about the site, the catalog, the reader's peers (developers, tech leads, self-taught builders).
- No first-person plural — no "we built X," no "our catalog." The site is described, not narrated by its maker.
- No second-person calls to action — no "learn how," no "discover," no "supercharge."
- Direct second person ("hover any underlined term to read the definition") permitted only when the reader's literal next action is being described.
- Present-declarative mood throughout. No future-conditional marketing tense ("you'll be able to…").

### Affordances

- Specificity over evocation. Name the field, the count, the mechanism, the author.
- Adjectives are taxes. Pay only where they add information the noun cannot carry.
- Reader is a peer who already cares. No on-ramp. No why-this-matters preamble.
- Where two paths exist, say so (Fowler). Where one short line says it, say only it (Beck). Where the rationale is economic, say what the money is (GeePaw).
- One sharp sentence per page on the about/home surfaces. Zero on catalog field copy.

### Banned moves

- Tutorial-blog warmth ("Let's walk through…").
- Quip-density of modern dev-tool docs ("You're gonna love this part").
- Academic passive voice walled with hedges ("It may be the case that…").
- Corporate-authoritative ("Our framework provides…").
- Pedagogical scaffolding ("In this section we will examine…").
- GeePaw-density metaphors stacked back-to-back. One earned metaphor per ADR or worked example; three is a different site.
- Slogans as content. One Ottinger-shaped slogan per several pages, maximum, and only when it carries information the surrounding prose cannot.
- Founder warmth in the third-person voice. The author's hand stays off the page outside the Attributions block.

## Consequences

**Easier:**

- Drafting any new editorial copy now has a named reference family instead of "neutral voice."
- Review has shared vocabulary: "this is leaning Kerievsky on a surface that wants Fowler," "this metaphor is doing GeePaw-density work on the about page."
- AI agents drafting prose can be pointed at this ADR directly and at the named authors, instead of having to infer the register from existing copy.
- Future surfaces (worked examples, longer essays, contributor docs) have a pre-decided register weighting rather than a per-surface debate.

**Harder / new constraints:**

- New contributors unfamiliar with the five authors have reading homework. The named registers are advisory anchors, not quotable text — do not paraphrase any of them; the site has its own voice inside the family.
- Register is harder to lint than vocabulary or word count. Enforcement remains editorial. No automated lint is added by this ADR.
- The personality budget for the about and home pages is now explicit and small: one sharp sentence per page, maximum. Future edits that add a second bite need to choose which one survives.

**Follow-up work:**

- `AGENTS-project-specific.md` carries a short pointer to ADR-0014 so future drafters find it before editing wrapper prose or the about page. The existing voice section continues to point at 0006/0009/0010/0011/0013 for catalog field copy.
- Where existing wrapper prose drifts outside the surface weighting above, it gets brought in over time. No bulk rewrite is mandated by this ADR.

## Source framing

ADRs 0006–0013 lock the catalog row in place. ADR-0014 names the family the rest of the site's prose belongs to, so the register stops being a thing each draft has to rediscover. Fowler is the spine; Beck, Kerievsky, Ottinger, and Hill are the seasoning, in that order of restraint.
