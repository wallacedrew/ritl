# 0006. Remove the compareDifferential strapline; agent-side forces carry the contrast

- **Status**: accepted (supersedes ADR-0005)
- **Date**: 2026-05-29
- **Deciders**: project owner, agent

## Context

ADR-0005 introduced a voice rubric for the `compareDifferential` field — a dedicated 3-sentence italic strapline on the compare view, sitting between the entry header and the six `Symptom / Goal / Pressure / Tradeoff / Relief / Trap` comparison sections. The rubric required each strapline to lead with a Humans sentence, follow with an Agents sentence grounded in context-window or token-cost mechanics, and land a shipped-code stake.

Within hours of authoring 140 differentials against that rubric, an audit of the agent-side force fields revealed the strapline was **redundant chrome**. The six agent-side forces below it already carry — and structurally must carry — the same human-vs-agent contrast in the same context-window / token-cost frame. Representative samples:

- **Long Function** (refactoring) — agent `tradeoff`: "Each extracted helper inflates context-window cost by one definition the next reasoning step must load."
- **Strategy** (GoF) — agent `pressure`: "Type-tag dispatch inside the host blows up the agent's context budget on every algorithm-related edit."
- **Mysterious Name** (smell) — agent `pressure`: "Every reasoning pass re-derives meaning from surrounding context; chained edits compound the cost."

The strapline restated material the reader was about to encounter in structured form anyway. On a page that teaches readers to recognize specification-redundant slop, having a 3-sentence summary of the next six sections was its own kind of mode collapse.

## Decision

We will **remove the `compareDifferential` field entirely** — the render in `CatalogCompareDetail`, the schema in `CatalogEntry`, the validator in `parseCatalogEntry`, and the 140 data entries across the three catalog JSON files.

The **voice rubric from ADR-0005 carries forward**, but its surface changes. The rubric now applies to the six agent-side force fields per entry rather than to a dedicated differential. Concretely, when authoring or revising an agent-side `symptom / goal / pressure / tradeoff / relief / trap` string, the same rules govern:

1. Ground in **context window** (what fits, what gets paged out, lost-in-the-middle, overflow) or **token cost** (tokens per read, tokens per write, tokens for unrelated payload, tokens for a walk through every branch).
2. **Neutral, facts-only voice** — no emotional verbs, value-laden nouns, rhetorical em-dash emphasis, or narrative voice.
3. **Ban hedge words** ("can," "may," "might," "tends to") and **ban abstract nouns** as load-bearing ("complexity," "coupling," "coordination," "ergonomics").
4. **Land a user-visible stake** where the field's role allows — shipped bugs, drift in generated answers, iteration cost. The agent-side `pressure` and `trap` fields are the natural homes for this; `symptom / goal / relief` describe state rather than consequence and can stay descriptive.
5. **Humans/Agents two-actor structure does not apply** at the field level — the compare view already pairs each agent-side field with the corresponding human-side field side-by-side, so the structural contrast is delivered by layout rather than by repeating "Humans... Agents..." inside every string.

A follow-up slice will audit the existing 140 × 6 agent-force fields against this carried-forward rubric and rewrite the weakest. That audit is **not in scope for this ADR's implementation slice** — the removal lands first; the content-strengthening pass follows.

## Consequences

**Easier:**

- The compare view layout becomes structurally honest: every section is a paired Humans/Agents box, no editorial strapline mediating between header and structured content.
- The schema shrinks. `parseCatalogEntry` loses the ≤3-sentence enforcement function. The `CatalogEntry` constructor loses one parameter and one readonly field. The render loses an import and a `Typography` block.
- Authoring a new entry no longer requires writing both a 3-sentence strapline AND the six agent-side forces. The forces alone carry the agent perspective.
- The compare view stops front-loading the reader with a summary of what's about to be read in structured form.

**Harder / new constraints:**

- Any reader who relied on the strapline as a quick orientation now has to read at least the agent-side `symptom` to ground the contrast. Mitigation: that's the field's existing job, so this is the field doing its work rather than being upstaged.
- The agent-side force fields now bear the full load of the human-vs-agent contrast specificity. Weak forces will read more conspicuously weak without the strapline to compensate. This is a feature, not a bug — it surfaces the entries that need the follow-up audit most.
- ADR-0005 is superseded within hours of being written. The rubric content carries forward here, but the dedicated field it governed is gone. This is honest churn driven by the audit finding rather than a process error.

**Follow-up work:**

- **Agent-force voice audit (deferred slice).** Apply the carried-forward rubric to the 140 × 6 agent-side force fields. Identify the weakest, rewrite them. The audit method is the same as the differential audit: classify each as STRONG / OK / WEAK against the rubric, rewrite WEAK in bulk, tighten OK as needed, spot-check STRONG.
- **Lint test for banned vocabulary (deferred tidying).** A unit test that scans the agent-side force strings for banned hedge words and abstract-noun load-bearing terms would prevent regression. Worth doing as a separate slice; specifying the banned list is its own decision.
- **Reinstate if Phase 2 reveals the forces can't carry the load.** Unlikely based on the audit sample, but if the agent forces prove structurally unable to deliver the per-entry specificity the strapline provided, a future ADR can supersede this one and bring the field back — informed by what the forces audit reveals.

## Source framing

This decision inherits the same operating principle ADR-0005 was written against: slop is a specification problem, and the cure is per-entry specificity grounded in concrete mechanism. The change here is structural — the specificity now lives in the six existing structured fields per entry rather than in a seventh redundant field. Same principle, smaller surface.
