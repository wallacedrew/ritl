# 0007. Kerievsky entries are refactorings, not patterns

- **Status**: accepted
- **Date**: 2026-05-31
- **Deciders**: project owner, agent

## Context

The data model puts Joshua Kerievsky's _Refactoring to Patterns_ entries (27 of them) into the `patterns` catalog alongside the 41 Gang of Four entries. Both share `catalog: "patterns"` and disambiguate via `book: "kerievsky" | "gof"`. This was the natural shape when the catalog was built — both come from "pattern books", both render as pattern detail pages — but a recent exploration of the cross-book bridges UI on `/reference/map` made the actual shape of the Kerievsky entries impossible to ignore.

Every Kerievsky entry in `src/patterns/content/patterns.json` is a verb-led recipe:

- `Encapsulate Classes With Factory`
- `Replace Conditional Logic with Strategy`
- `Compose Method`
- `Move Embellishment to Decorator`
- `Inline Singleton`
- …

These are not patterns. A pattern names a structural arrangement (Strategy is a pattern; Factory Method is a pattern). A name shaped `Replace X with Y` or `Encapsulate X` is a **refactoring move** — a recipe for getting from one shape to another. Their distinguishing feature relative to Fowler refactorings is that they name a GoF pattern as their `destinationPattern` field. They are refactorings whose target is a pattern.

The current shape causes three concrete problems:

1. **The reference-map cross-book bridges UI** reads as "Kerievsky pattern → GoF pattern" which is structurally a hop between two pattern books, when the reader's actual journey is "smell → Fowler refactoring → Kerievsky refinement → GoF pattern". The first hop is across a phantom boundary because both endpoints are tagged `patterns`. A reader who notices a code smell and wants to find what to do about it should land in `refactorings`, not `patterns`.
2. **`CatalogGraph` dispatches cross-reference rendering on tone** (`src/shared/lib/CatalogGraph.ts:67-77`). The `"kerievsky-pattern"` branch produces `triggered-by` + `destination` relationships — semantically a refactoring's preconditions and post-condition. The `"gof-pattern"` branch produces `reached-from` — semantically a pattern's incoming refactorings. The dispatch is correct but the tone names lie about what the entries are.
3. **The `nemeses` field on Kerievsky entries cross-references both smells and Fowler refactorings**, which the bare-string nemesis convention used by Fowler/smells does not support. Pattern entries get a special object-shaped nemesis parser as a workaround. The asymmetry vanishes once Kerievsky entries become refactorings — they're allowed to reference both because every catalog can.

## Decision

We will move the Kerievsky entries from the `patterns` catalog to the `refactorings` catalog, with three coordinated decisions:

1. **Catalog reshape.** Each Kerievsky entry's `catalog` field changes from `"patterns"` to `"refactorings"`. The entries keep `book: "kerievsky"`, keep their `destinationPattern` field, and keep their object-shaped nemeses. The `patterns` catalog becomes Gang-of-Four-only.
   - `Book` type unifies as `"fowler" | "kerievsky" | "gof"`; `PatternBook` is kept transitionally and dropped in a follow-up cleanup.
   - `book` becomes a legal (and required-per-catalog-rule) field on refactorings: `fowler` or `kerievsky`. All existing 65 Fowler entries take `book: "fowler"`.
   - `destinationPattern` becomes legal on refactorings when `book === "kerievsky"`. The constraint at `parseCatalogEntry.ts:139` widens accordingly.
   - The `parseCatalogEntry` nemesis parser becomes symmetric: refactoring and smell entries accept both the legacy bare-string shape and the `{catalog, name}` object shape. Bare-string remains the default for Fowler/smell entries; object-shaped is required for Kerievsky entries because they cross-reference both opposite catalogs.

2. **URL preservation via book-aware refactoring routing.** The `/refactoring-to-patterns/<slug>` URLs survive the move. The Kerievsky sub-site stays — its `catalogs` field changes from `["patterns"]` to `["refactorings"]`, and `Slug.toCatalogHref` learns to disambiguate refactorings by `book` (sending Fowler entries to `/refactoring/canon/<slug>` and Kerievsky entries to `/refactoring-to-patterns/<slug>`). The site is low-traffic, so a clean URL break would be acceptable, but the Kerievsky shelf has standalone reference value as a distinct landing — preserving its URL preserves its bookmark-ability and the "Refactoring to Patterns" sub-site identity.

3. **Tone strings renamed for honesty.** The `CatalogEntryTone` union currently encodes "what the entry visually is" (color/shelf identity) by piggybacking on catalog+book. Post-move it must encode the truth about each entry:
   - `"kerievsky-pattern"` → `"kerievsky-refactoring"`
   - `"gof-pattern"` → `"pattern"` (GoF is the only book left in the patterns catalog)
   - `"refactoring"` → `"fowler-refactoring"`
   - `"smell"` → unchanged.

   The chip-color map in `catalogChipColor.ts` is the one place that translates tone → CSS; visual identity is preserved entirely through that map. The rename is purely about not lying in the type system.

The implementation is phased to keep every commit independently green:

- **Phase A** (three additive structural commits): allow `book` on refactorings; symmetric nemesis parser; book-aware URL routing + tone rename + `destinationPattern` constraint widening. Kerievsky data stays in `patterns.json` throughout — all current routes and UI render unchanged.
- **Phase B** (one behavior commit): the 27 Kerievsky entries move from `patterns.json` to `refactorings.json`. Includes the explicit fix for the `RefactoringComparePage` silent regression (a Fowler refactoring's "referenced-by-patterns" group must continue to include its Kerievsky inbound references after the move, which means swapping its `loadPatterns()` source to a Kerievsky-inclusive one — and an explicit regression test).
- **Phase C** (one or two behavior commits): the Kerievsky sub-site catalogs flip to `["refactorings"]`, route shims at `src/app/refactoring-to-patterns/*` switch from the `Patterns*Page` components to the `Refactoring*Page` components with `book: "kerievsky"`, refactoring pages learn book-aware backlinks, and a `loadKerievsky()` helper replaces the transitional inline filters.
- **Phase D** (deferred, separate slice): drop `PatternBook` alias, remove `subSiteForPatternBook`, prune transitional kerievsky-as-pattern code paths, and (optionally) migrate Fowler/smell bare-string nemeses to object shape for full schema symmetry.

## Consequences

**Easier:**

- The data model reads as the user does. A reader scanning the refactorings catalog finds both Fowler's "Extract Function" and Kerievsky's "Replace Conditional Logic with Strategy" side by side, distinguished by their `book` and (for Kerievsky) by their `destinationPattern`. No phantom catalog hop in the journey from smell to pattern.
- `CatalogGraph` cross-reference dispatch becomes honest. A Kerievsky entry's `triggered-by` / `destination` rendering is its tone telling the truth about its shape, not a tone laundered through a catalog mismatch.
- The cross-book bridges UI on `/reference/map` becomes structurally accurate. A Kerievsky entry is a refactoring with a destination; rendering it as part of a refactoring → pattern bridge stops needing the "first hop is between two pattern books" caveat.
- The nemesis-shape asymmetry between catalogs becomes a transitional artifact rather than a permanent feature of the model. Symmetric object-shaped nemeses are now legal on every catalog; Phase D's optional migration finishes the cleanup.
- New refactorings that target patterns (whether Kerievsky's original 27 or future additions) have a single home in the model.

**Harder / new constraints:**

- `Slug.toCatalogHref` and `subSiteForCatalog` need to know `book` to route refactorings correctly. The function signatures change. This is a load-bearing structural commit (Phase A3) and a code-review hotspot — getting it wrong sends Kerievsky URLs to `/refactoring/canon/<slug>` instead of `/refactoring-to-patterns/<slug>`.
- `RefactoringComparePage` (and any other surface that calls `loadPatterns()` to count or display pattern-shaped inbound references to a Fowler refactoring) silently loses its Kerievsky entries the moment they move out of the patterns catalog. This is the single highest-risk silent regression in the slice. Phase B explicitly fixes it and adds a regression test pinning the invariant.
- Tone string rename touches every test fixture that constructs entries with the old tone names. Roughly ten spec files in `tests-small-unit/shared/lib/` need updating.
- The `KERIEVSKY` sub-site's `catalogs` field changing from `["patterns"]` to `["refactorings"]` means the same catalog (`refactorings`) now appears in two sub-sites (`FOWLER` and `KERIEVSKY`). `subSiteForCatalog` cannot disambiguate without book, so its callers must pass book or use a new `subSiteForRefactoringBook` helper. This is intentional — catalogs are no longer in one-to-one correspondence with sub-sites — but it means anyone reading the routing code in the future must know that the refactorings catalog is split across two shelves.
- ADR-0004 ("Kerievsky composite patterns keep the single `before`/`after` schema; prose and nemesis links carry the journey") still stands but its title becomes slightly off — the entries it discusses are no longer "patterns". The ADR's content remains correct; readers should mentally substitute "refactorings" for "patterns" in the title. A future ADR could supersede ADR-0004 if the wording confuses readers in practice; the substance does not change.

**Follow-up work:**

- **Phase D cleanup slice** (described above). Strictly after Phase C ships and bakes for one release cycle.
- **Optional nemesis-shape migration.** Migrate Fowler/smell bare-string nemeses to object shape across `refactorings.json` and `smells.json` for full schema symmetry. Tidy First commit; ~90 entry mechanical edit; no behavior change.
- **Optional `ReferenceCatalogCounts` field rename.** The `kerievskyPatterns` count field in `src/reference/lib/getReferenceSections.ts` becomes a misnomer post-move. Renaming to `kerievskyRefactorings` is a small follow-up tidy if the name confuses readers; deferred to keep Phase C focused.
- **Visual identity revisit.** The chip colors for Kerievsky entries currently signal "Kerievsky pattern". Whether they should keep that color (preserving the brand shelf) or shift toward the refactoring palette (reflecting the new identity) is a UX call rather than an architectural one. Defer until the renamed tones have been live for long enough to know whether the existing color reads as "lying" to users.

## Source framing

The substantive driver here is the same as ADR-0004's: Kerievsky's composite patterns sit between "pattern" and "refactoring" in a way the original Refactoring to Patterns book deliberately left fuzzy. ADR-0004 chose to keep them schema-aligned with patterns (single before/after, prose carries the journey). This ADR completes the reframing in the opposite direction — now that we've watched the catalog model in production, the Kerievsky entries' natural home is the refactorings catalog, and the prose-carries-the-journey discipline from ADR-0004 still applies on that side of the move.
