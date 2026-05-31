# 0008. Domain-first `src/` layout

- **Status**: accepted
- **Date**: 2026-05-31
- **Deciders**: project owner, agent

## Context

The top-level `src/` shape encoded a technical abstraction ("catalog") where the user-visible domain has three peers: smells, refactorings, design patterns. Concretely:

- `CatalogKind = "smells" | "refactorings" | "patterns"` drove folder names and entry discriminators, but `"patterns"` did not match the user-facing URL `/design-patterns` or the domain term "design pattern". `SubSite` (`src/shared/lib/SubSite.ts`) carried a `CATALOG_URL_SEGMENT` map in part to bridge the mismatch.
- Two sub-site landing pages — `GofLandingPage.tsx` and `KerievskyLandingPage.tsx` — lived alone in folders (`src/design-patterns/`, `src/refactoring-to-patterns/`) that contained only the landing, separated from the data they rendered. `GofLandingPage` rendered `loadPatterns()` output from `src/patterns/`; `KerievskyLandingPage` rendered `loadKerievsky()` output from `src/refactorings/lib/`.
- The `catalog` abstraction remains legitimate at the data-model layer (one `parseCatalogEntry`, one `CatalogGraph`, one detail-page chrome shared across the three domains). The overreach was using `catalog` as the top-level domain identifier — "catalog" names what the three domains have in common, not what they ARE.

The trigger was an exploration of `src/` against Screaming Architecture. The first read flagged `src/patterns/` and `src/design-patterns/` as an apparent name collision; deeper inspection showed each was doing real work, but the asymmetry — `src/patterns/` for data + `src/design-patterns/` for a single landing page — was the visible artifact of the data/URL inversion.

ADR-0007 (2026-05-31) moved Kerievsky entries from the patterns catalog to the refactorings catalog. That left the patterns catalog as Gang-of-Four-only and made the domain shape of `src/` more obvious: three domain peers (smells, refactorings, design patterns), not "patterns + something else".

## Decision

We will rearrange `src/` around the three domain peers, with three coordinated changes:

1. **Three top-level domain folders.** `src/smells/`, `src/refactorings/`, `src/design-patterns/`. The fourth top-level folder under the catalog axis becomes the data home of design patterns instead of holding a single landing page.

2. **Sub-site landings colocate with their data source.**
   - `GofLandingPage.tsx` moves from `src/design-patterns/` (alone) to `src/patterns/` (next to `loadPatterns`), then rides along when `src/patterns/` is renamed to `src/design-patterns/`. Final location: `src/design-patterns/GofLandingPage.tsx`.
   - `KerievskyLandingPage.tsx` moves from `src/refactoring-to-patterns/` (alone) to `src/refactorings/` (next to `loadKerievsky`).
   - Folders that contained only a landing are deleted.

3. **`CatalogKind` value matches the URL identifier.** `"patterns"` → `"design-patterns"` across the type union, `LEGAL_CATALOGS`, the validator (`parseCatalogEntry`), the JSON file (renamed `patterns.json` → `design-patterns.json`) and the `catalog` field on its 23 entries, the SubSite `CATALOG_URL_SEGMENT` map, `GOF.catalogs`, and the `NonPatternCatalog` Exclude clause. Every internal CatalogKind discriminator now reads the same as the URL slug.

`SubSite` stays. FOWLER (`["refactorings", "smells"]` under one slug) and KERIEVSKY (`["refactorings"]` filtered by `book === "kerievsky"` under a second slug) still earn the abstraction. GOF (`["design-patterns"]` → `/design-patterns`) becomes a trivial 1:1 case but stays inside the same registry for symmetry across all three sub-sites.

Three name-shape choices are deliberate:

- **`NonPatternCatalog` keeps its name.** The `Exclude` clause moves to `Exclude<CatalogKind, "design-patterns">`; the resolved set stays `"smells" | "refactorings"`. Renaming to `RefactoringCatalog` was considered and rejected — that name would misclassify smells as refactorings.
- **`Pattern*` entity names keep their original form.** `loadPatterns`, `PatternsDetailPage`, `toPatternListItem`, the `patterns: CatalogEntry[]` field on `CatalogSnapshot`. Decision 1 of the refactor pinned the rename scope at "minimal" — only the discriminator value, the folder, and the JSON filename change. The entity-name asymmetry (`Smell` and `Refactoring` are single words; `Pattern` is the short form of `DesignPattern`) reflects "design pattern" being a two-word domain term and stays localized to this domain.
- **`CatalogToolbar.tsx` and `AnalyticsTracker.ts` keep their internal `"patterns"` literals.** Those strings discriminate nav tabs (`"patterns"` identifies the Refactorings-to-Patterns sub-site for active-state tracking; `"design-patterns"` identifies the GoF sub-site) independently of `CatalogKind`. They also drive the `nav_clicked` analytics event payload; renaming would orphan historical analytics without any user-visible benefit.

Safety net built before any code move:

1. **URL inventory test** (`tests-small-unit/shared/lib/urlInventory.test.ts`) pins the slug set per dynamic route — exact count (24 smells / 66 Fowler refactorings / 27 Kerievsky refactorings / 23 GoF patterns) and exact slug strings — against a generated fixture. Any rename refactor that drops or renames a slug fails fast.
2. **Graph integrity walk** (`tests-small-unit/shared/lib/graphIntegrity.test.ts`) walks the full `CatalogGraph` and asserts every nemesis href, every `destinationHref`, every inbound href, and every destination-source href resolves to an existing node — and that every `destinationHref` points at a GoF pattern.
3. **Visual verification script** (`scripts/snap.mjs`) drives Playwright + chromium across 22 representative URLs at desktop (1280×800) and mobile (375×667) viewports, writing PNGs to `/tmp/ritl-snap-<label>/`. `diff -r` between baseline and per-phase captures gates each commit.

## Consequences

**Easier:**

- `src/` reads as the domain. The top-level folder list answers "what does this app do" (smells, refactorings, design patterns) before "how is it built" (shared, app, plugin). New contributors see the three domain peers as equals.
- The CatalogKind discriminator matches the URL identifier in every layer (folder name, type, validator, JSON, URL slug). No more mental translation from `"patterns"` to `/design-patterns`. The `subSiteForPatternBook` and `subSiteForCatalog` plumbing reads more directly.
- Each sub-site landing sits with its data source — `GofLandingPage` with `loadPatterns`, `KerievskyLandingPage` with `loadKerievsky`. Reading the landing no longer requires jumping between two folders.
- The atomic Phase 4 commit serves as a canonical example of how to handle a discriminator rename when a runtime validator gates correctness: split type-tightening and data-update into separate commits and the build goes red between them; bundle them atomically and every commit ends green.

**Harder / new constraints:**

- The `loadPatterns` function name and `Pattern*` entity names sit inside `src/design-patterns/` (the folder name uses two words; the entity name uses one). This is a deliberate Decision-1 trade-off — full symmetry would require a `loadDesignPatterns` rename, doubling the rename surface — but a future contributor scanning `src/design-patterns/lib/loadPatterns.ts` may briefly wonder whether the file moved or was renamed. The commit body of the Phase 3 folder rename and this ADR document the choice.
- `SubSite`'s `GOF` case becomes a trivial 1:1 (slug "design-patterns" → catalog `"design-patterns"`). It would shed ~10 lines if collapsed, but symmetry across the three sub-sites is worth more than the savings — FOWLER and KERIEVSKY still earn the abstraction. The registry stays.
- `CatalogToolbar.tsx` and `AnalyticsTracker.ts` carry the only remaining `"patterns"` string literals in shared code. Future contributors reading those files must know they discriminate nav tabs, not CatalogKind. The commit body of the Phase 4 atomic rename and this ADR document the leave-alone decision and the reason (historical analytics).
- Two pre-Phase-2 ADRs (ADR-0004, ADR-0007) reference the old `src/patterns/` path in their context paragraphs. The path is stale but the substantive reasoning stands. ADRs are immutable; future readers should mentally substitute `src/design-patterns/`.

**Follow-up work:**

- **`scripts/snap.mjs` URL completeness**: the current 22-URL list covers every distinct `page.tsx` type. If future slices add new page types (e.g., a `/about` route, a new sub-site shelf), the list must be extended before the next refactor uses it as a safety net.
- **Snippet generator drift cleanup**: running `node scripts/generate-snippets.mjs` during this slice surfaced ~30 outdated snippet files in `docs/snippets/` and `plugin/refactor/skills/` and ~30 missing snippet files that the generator now produces. The drift predates this refactor (regen wasn't run alongside recent content edits). A standalone "regenerate snippets" commit should land separately to bring `docs/snippets/`, `public/snippets/`, and `plugin/refactor/` back in sync with the generator output.
- **Optional `Pattern*` → `DesignPattern*` entity rename**: deferred per Decision 1. Worth revisiting if the entity-name / folder-name asymmetry produces confusion in practice over a few release cycles.

## Source framing

The substantive driver here is the same as ADR-0007's: watching the catalog model in production made the gap between the technical abstraction (`catalog`) and the user-visible domain (smells, refactorings, design patterns) visible. ADR-0007 reframed Kerievsky entries from "kind of pattern" to "kind of refactoring with a destination". This ADR completes the alignment: the top-level `src/` shape, the `CatalogKind` discriminator value, and the URL identifier all converge on the same domain term.

The `catalog` abstraction stays — it names what the three domains have in common at the data-model layer (one parser, one graph, one detail-page chrome). It just no longer drives folder names or external identifiers.
