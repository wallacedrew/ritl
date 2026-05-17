**Refactoring in the Loop — Master TODO List**

Sequenced by leverage and dependency. The HITL thesis is the spine; everything else proves and operationalizes it.

---

**Phase 0 — The Thesis (ship today)**

Before anything else. This is the wedge.

1. **Write the HITL thesis paragraph.** One paragraph. Names the loop, names what degrades without refactoring discipline ("HITL collapses to diff-rubber-stamping the moment the agent stops doing one named refactoring at a time"), names what this site delivers. This is the single most valuable copy on the entire site.

   _Draft (3 sentences, ~55 words):_

   > Human-in-the-loop coding collapses to diff-rubber-stamping the moment the agent stops doing one named refactoring at a time. The missing primitive is refactoring discipline: one named move from Fowler's catalog, a green test bar before the next, a commit per refactoring sized to fit a real review. This site is the catalog; the [Claude Code plugin](/plugin) is the orchestrator that makes the agent honor it.

   _Trade-off:_ gives up the concrete "five chained moves and a behavior change in one commit is past anyone's attention budget" example from the 5-sentence draft. Fine if the modal reader is staff-engineer-and-up; weaker for readers who haven't felt the collapse themselves — in which case item 3's HITL-primitive bullets need to do the convincing right underneath.

2. **Decide where the thesis lives — home page or /plugin or both.** Tied to the audience-decision gate (item 8 below). If the site is the storefront for the plugin, thesis goes on home. If the site is the canonical reference, thesis goes on /plugin and home leads with the catalog. Don't run the thesis in two places with two different framings.

   _Resolved (2026-05-16): canonical reference._ Thesis lives on `/plugin` only. Home keeps leading with the refactorings catalog. Item 3's HITL-primitive bullets live alongside the thesis on `/plugin`.

3. **Map refactoring discipline onto HITL primitives.** Three to four bullets connecting your move to existing HITL vocabulary: approval gates (green bar per refactoring), oversight cost (orchestrator refuses chained moves), review surface (commit per refactoring sized to human attention budget), autonomy levels (where you sit on the autonomy axis and why). This is the staff-engineer-and-up pitch. Lives wherever the thesis lives.

   _Deferred (2026-05-16)._ Drafting bullets surfaced two open questions: (a) the HITL primitive vocabulary isn't shared enough yet for the mapping to land as on-page copy without sounding like academic taxonomy, and (b) early drafts overclaimed plugin enforcement (the orchestrator prompts, it doesn't runtime-block). Likely reshape: treat the mapping as a private design frame that informs items 9–16 and Phase 6 recipes, rather than copy under the thesis. Revisit after item 4.

---

**Phase 1 — Catalog Foundation (this week)**

4. **Add a Safety net line to every card.** One label: `compiler / unit test / characterization test / type system`. Four values total across all cards. Also encodes your risk gradient — no separate difficulty tag needed.

   _Decisions (2026-05-16):_
   - **Refactorings only**, not smells. Smells get detection signals via item 21.
   - **Detail page only**, not list cards. List cards stay scannable.
   - **Three values, not four** — `types/compiler / unit test / characterization test`. Fowler's `compiler` and `type system` collapse into one value; the slash label keeps both halves visible so TS-native readers don't have to translate "compiler" mentally.
   - Implemented as a `SafetyNet` value object (`src/refactorings/lib/SafetyNet.ts`) per the project's "no domain concept without a value object" rule.
   - Tidy First sequence: structural commit (optional field + parser + render-when-present) ships green with no visible change; classifications follow as one-line behavior commits, batched.

5. **Rename Savings → Trade where the move carries a real cost.** Audit all 66. Pure-win moves (Remove Dead Code, Replace Magic Literal) keep `Savings`. Real-cost moves get `Trade` with both sides written honestly.

   _Reframed (2026-05-16): keep Savings, add Tradeoff._ The original framing forced an either/or between "win" and "cost"; the reality is most refactorings have both. Keep `savings` as-is for every entry, add an optional `tradeoff?: string` field surfaced as its own "Tradeoff" section right after Savings (the symmetric counterpart). `risk` stays as the operational "Note" — different axis (mechanical caveat when doing the move) vs Tradeoff (honest cost even when the move succeeds). Pure-win moves leave Tradeoff blank; the section conditionally renders. Same Tidy First sequence as item 4: structural commit (optional field + parser + render-when-present) then content commits in batches.

---

**Phase 2 — Calibration & Audience Decision (this week → next)**

6. **Fix examples that sit below the threshold of pain.** Calibrate each example so the `after` reads more clearly than the `before`. Likely culprits: Extract Function, Inline Function, Extract Variable, Decompose Conditional, Replace Loop with Pipeline.

7. **Pick a language per card, not multiple.** Choose the language that makes each refactoring's _shape_ clearest. Java for inheritance moves, TS for pipeline moves, Python where duck typing illuminates. Don't quadruple every card.

8. **Audience decision gate.** Before Phase 5: is the public site (a) storefront for the plugin, or (b) canonical reference? Decision shapes everything downstream — home page lead, plugin page positioning, how aggressive pair consolidation can be. Don't try to be both.

   _Resolved (2026-05-16): canonical reference._ Home leads with the catalog; `/plugin` is the thesis + install + proof page. Phase 5 pair consolidation runs cautiously — preserve URLs, set up redirects, expect inbound links and citations to outlive any restructure. Re-read item 25 under this framing (see flag below).

---

**Phase 3 — Plugin Page Overhaul (after Phase 0, parallel with Phase 2)**

9. **Re-order the three plugin tiers around the reader's environment.** Drop "Recommended" from Tier 1 or replace with "Best on Claude Code." Fork at the top: _"On Claude Code? Tier 1. Not on Claude Code? Tier 2."_ Modal reader is not on Claude Code.

10. **Show the AGENTS.md file inline.** 25 lines. Paste them on the page. Highest friction-to-payload ratio fix on the entire site.

11. **Show the orchestrator's SKILL.md inline (or a transcript of the agent using it).** Proof, not promise. Staff engineers install plugins they can read first.

12. **Add a trust signal on /plugin.** One line + link. Who built this, what they run in production. Credentials are real; deploy them.

13. **Reframe "91 auto-invoking skills" from quantity to precision.** _"91 skills — your agent only ever sees the one that matches the smell in front of it."_ Same data, opposite sell.

14. **State the coupling model between AGENTS.md and the catalog.** One sentence. Does the agent fetch refactoringintheloop.com at runtime, or is the file self-contained? Reader can't evaluate the offer without knowing.

15. **State the plugin update model.** One sentence. Pull updates, or install-and-drift?

16. **Collapse Tier 3 to one line under Tier 2.** Unless you can name the specific audience (in-house custom harnesses), it's clutter. Keep the honest token-burn warning; lose the tier.

---

**Phase 4 — Catalog Depth (two-week sprint)**

17. **Add Mechanics to every card.** Three to five numbered steps, each safe on a green bar. Biggest body of work on the list. Slice it 5–10 cards at a time. Done when a reader could _perform_ the refactoring from the card alone.

18. **Add When to Apply and Do NOT Use When per card.** Two to three lines each. Plus a _Cost of Delay_ one-liner. Makes bidirectional tension explicit per card.

19. **Add Failure Mode per card.** One line — what this refactoring becomes when over-applied. Prevents pattern worship.

20. **Add Verify per card.** One or two pointed questions to ask _after_ the move. _"Did coupling actually decrease? Would the next change here be cheaper now?"_ Sanity check, not checklist.

21. **Add Codebase Signals to smell cards (not refactoring cards).** Change frequency, defect rate, coupling, cognitive load. Tells the reader which smell to chase first. Lives on smells because that's where prioritization happens.

---

**Phase 5 — Structural Consolidation (release with redirect plan)**

22. **Consolidate bidirectional pairs into single cards.** Each pair becomes one card with two directions and an explicit "when to go which way" section. Pairs: Extract Function ↔ Inline Function, Extract Variable ↔ Inline Variable, Extract Class ↔ Inline Class, Hide Delegate ↔ Remove Middle Man, Pull Up Method ↔ Push Down Method, Pull Up Field ↔ Push Down Field, Replace Parameter with Query ↔ Replace Query with Parameter, Change Reference to Value ↔ Change Value to Reference, Replace Function with Command ↔ Replace Command with Function, Replace Error Code with Exception ↔ Replace Exception with Precheck. Set up URL redirects so you don't break the plugin or external links.

---

**Phase 6 — Composition (after Phases 1–5)**

23. **Ship three recipes.** "Break Up God Class," "Refactor for Testability," "Untangle Feature Envy." Each: starting smell, sequence of refactorings, rationale for ordering, stopping conditions, rollback risk. Prose only — no diagrams yet. Ship three, see what gets read, expand from there.

---

**Phase 7 — Distribution & Funnel (any time after Phase 3)**

24. **Map distribution surface and ship two channels.** Claude Code marketplace listing, GitHub awesome-AGENTS.md inclusion, AGENTS.md snippet directories, shareable social asset. Pick two; ship them.

25. **One "paste your code → which refactoring" demo on the home page.** Single-purpose, single-CTA: funnel to the plugin install. Lead capture, not a product. If it starts growing features, stop — that's the other product on the wrong URL.

    _Conflict flagged (2026-05-16):_ this item is funnel-shaped and was sized for the storefront framing. Under the canonical-reference decision (item 8), home leads with the catalog, not a demo. Options: (a) drop this item entirely, (b) move the demo to `/plugin` as a third proof element alongside AGENTS.md (item 10) and SKILL.md (item 11), or (c) keep it on home as a small below-the-fold widget that doesn't compete with the catalog lead. Decide before Phase 7.

---

**Rejected (kept here so the discipline is visible):**

- Multi-language examples (Java/TS/Python/C#) on every card — quadruples maintenance for marginal value
- Per-card outbound links to refactoring.com — funnel leak; fix examples instead
- Language-applicability filters — Fowler's catalog is language-agnostic by design
- "Why this matters" line per card — already exists as the outcome description under each card name
- Smells-addressed / technique-type filters — already exist via the smell↔refactoring index and /reference grouping
- Search box — defer; ctrl-F works on a single page of ~55 cards post-consolidation
- Separate difficulty / risk-level tag — Safety net already encodes the gradient
- Business-impact notes on every card — turns the catalog into a McKinsey deck; build it once as a separate page if needed
- Visual flow diagrams on recipes — SVG is a tar pit; ship prose first
- AI judgment platform, advisor, entropy score, design pressure analyzer — goes to the other product
- Multi-language examples in the realistic-example overhaul — same reason as above

---

**Dependency notes:**

- Phase 0 unblocks everything strategically — write the thesis first even if you ship other items in parallel.
- Phase 1 is independent.
- Phase 2 #8 (audience decision) blocks Phase 5.
- Phase 3 can run parallel with Phase 1–2 once thesis exists.
- Phase 4 items are independent of each other; do them in parallel slices.
- Phase 5 needs Phases 1–4 mostly done — don't merge pairs then re-edit every merged card.
- Phase 7 is opportunistic after Phase 3.

---

**Stopping condition for the whole list:** the catalog teaches the _practice,_ not the names, and the HITL thesis is the first thing every visitor reads. You'll know you're done when a staff engineer can land on the site, read one paragraph, install the plugin, and immediately understand why this is the missing primitive in agentic coding — and when their agent, equipped with the plugin, refuses to chain refactorings without a green bar. Everything past that point is the other product.
