# 0004. Composite patterns use single before/after, prose carries the journey

- **Status**: accepted
- **Date**: 2026-05-27
- **Deciders**: project owner, agent

## Context

Slice 2 introduced the `patterns` catalog with Kerievsky's _Refactoring to Patterns_ (Addison-Wesley, 2004) entries. Each pattern is, in Kerievsky's frame, a **composite refactoring** — a sequence of atomic moves whose destination is a GoF design pattern. Compose Method (Slice 2) fit the existing single `before` / `after` schema without strain. Slice 3 added **Replace Conditional Logic with Strategy**, which is the first pattern in the book whose conventional teaching is genuinely multi-step:

1. Extract the conditional body into a method.
2. Move the method to a Strategy class.
3. Subclass for each branch.
4. Replace the conditional dispatcher with polymorphism.
5. Delete the now-dead conditional.

Two schema shapes were considered for representing this on the site:

1. **Single before/after** — keep the current `CatalogEntry` schema (one `before` snippet, one `after` snippet). The five-step journey lives in prose (`forces.goal`, `forces.relief`) and in cross-links to atomic refactorings (`nemeses`).
2. **`steps[]` array** — add an optional `steps: { label, before, after }[]` field on `CatalogEntry`. Each step is a tiny refactoring with its own bookends. Single-step entries (refactorings, smells, simple patterns like Compose Method) omit `steps[]`; multi-step composites populate it.

## Decision

We will use **option 1**: composite patterns keep the existing single `before` / `after` schema. Prose carries the journey.

Why option 1:

- **Authoring fit.** Slice 3 authored Replace Conditional Logic with Strategy as single before/after and the contrast was the educational moment. The five intermediate states are mechanically derivable from the bookends by a reader who follows the linked atomic refactorings.
- **Catalog vs tutorial.** The site is a catalog explorer — it answers "what does this pattern look like at rest" not "step me through applying it." Readers who want the exact move-by-move journey consult the book; the site exists to surface the named patterns and their force fields.
- **Uniform schema.** All 90 existing entries (refactorings + smells) use single before/after. Adding `steps[]` would create a two-mode schema where the same field carries different meanings depending on `steps[]` presence. The maintenance and rendering cost of that mode-switch isn't earned by what it adds.
- **Existing seams already carry the journey.** `forces.goal` describes the destination shape in domain language. `nemeses` link to the atomic refactorings that compose the pattern (e.g., Replace Conditional Logic with Strategy lists Replace Conditional with Polymorphism, Decompose Conditional). Each nemesis link resolves to a refactoring entry with its own before/after — so a reader who clicks through reconstructs the journey by visiting the atomic moves in the recommended order.
- **`exampleSource` covers attribution.** The optional `exampleSource` field added in Slice 2 lets each pattern explicitly cite "Adapted from Kerievsky's loan-calculator example" so readers know the example is synthesized but fundamentally equivalent to the book's.

## Consequences

**Easier:**

- One schema for all 90+ catalog entries. No mode-switching in `CatalogDetail`, no per-step rendering component, no migration of existing entries.
- Authoring a new pattern stays a one-file content change: edit `src/patterns/content/patterns.json`, add a JSON object with the bookend snippets, ship.
- Existing tests stay valid. The SKILL.md generator emits one `before` / `after` block per entry uniformly.

**Harder / new constraints:**

- The exact intermediate states (e.g., "after extracting the variable", "after moving the method to a Strategy class") are not visible on the pattern's own page. Readers who want them must follow the nemesis links to atomic refactorings, or consult the book.
- For agents using the generated SKILL.md, the dispatch hint reads "apply X, Y, Z and arrive at the Strategy hierarchy" rather than "follow these named moves in order." Slightly less directive at the per-pattern level, but the atomic-refactoring SKILL.md files (which the plugin already ships) cover the move-by-move guidance.
- Some patterns may strain harder than Replace Conditional Logic with Strategy did. If a future pattern's bookends can't honestly convey the move (e.g., a pattern whose value is _only_ the sequence, not the destination), supersede this ADR with one introducing `steps[]`.

**Follow-up work:**

- None required for Slice 3 or the remaining Kerievsky entries.
- Revisit if an entry resists single-bookend authoring during a later slice. The natural escape hatch is an optional `steps[]` field; this ADR stays in place as the precedent that prose-carries-the-journey is preferred.
