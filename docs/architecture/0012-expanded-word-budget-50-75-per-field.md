# 0012. Expanded word budget: 50–75 words per field

- **Status**: accepted (supersedes ADR-0010 §5 word budget)
- **Date**: 2026-06-04
- **Deciders**: project owner, agent

## Context

ADR-0010 §5 set the field-length budget at "median ~25 words, soft cap 40, hard ceiling 50." After ten months of authoring against that budget, three constraints became visible:

1. **Nuance loss.** A 25-word field can name a mechanism and land a stake but cannot also cross-reference adjacent terms or describe the second-order consequence. The catalog's pedagogy suffers when every field forces compression to the bone.

2. **Citation density.** With the glossary now carrying 42 entries across human costs, cross-cutting principles, agent costs, and failure modes, a field that names one term often benefits from naming a second (the mechanism + the downstream cost it drives, or the human-side parallel). 25 words is too tight for that pattern.

3. **Symmetric framing.** The compare view pairs human-side and agent-side fields. When both columns describe the same force at different grains, both need room to lay out the mechanism — not just name it. The cross-cutting principle that drives both costs often warrants its own clause.

The 50-word ceiling was set when the catalog's vocabulary was narrower and the parallel-structure rule wasn't yet load-bearing. Both have grown.

## Decision

The field-length budget for agent-side and human-side force fields becomes **50–75 words per field**.

- **Hard ceiling**: 75 words. Lint-enforced via `agent-forces-length.test.ts`.
- **Floor**: 50 words. Editorial target — the rest of the catalog (entries authored before this ADR) is migrated incrementally and will fall under 50 until rewritten. The lint does not enforce the floor.
- **Median target**: ~60 words.
- **Sentence count** (ADR-0010 §6) remains 1–3 per field.

Both human-side and agent-side fields share this budget — there is no separate human-side range. The compare view's structural symmetry calls for matched lengths on the two columns.

## Consequences

**Easier:**

- A field can name both a mechanism and the second-order consequence it drives without dropping either.
- Cross-references to adjacent glossary terms (e.g., naming the human-side `verification cost` while describing the agent-side `verification-surface cost`) become natural rather than aspirational.
- Stakes in `pressure` and `trap` get more room to land the user-visible cost.
- The compare view's two columns can both show their work — the human-side parallel and the agent-side mechanism — rather than one side compressing to fit while the other expands.

**Harder / new constraints:**

- Existing catalog entries (140+ across smells, refactorings, patterns) are under the new floor. They will be migrated entry by entry as part of routine content revision; the lint does not gate this migration.
- Fields written against the old budget no longer represent the target voice. Future readers may notice some entries reading tighter than others until the migration is complete.
- The 75-word ceiling is wider than the original 50; authors who relied on compression discipline to produce tight prose now have more rope. The voice ADRs (0006, 0009, 0010, 0011) still constrain vocabulary, POV, mood, and mechanism citation — the budget expansion does not relax those.

**Follow-up work:**

- **Catalog migration.** Entries are revised one batch at a time as the user directs. The first batch (smells 1–7) is the same slice that introduces this ADR.
- **Floor lint, deferred.** When the corpus migration is complete, a follow-up ADR can add a lint enforcing the 50-word floor. Premature enforcement would block routine commits.

## Source framing

ADR-0010 set the voice contract when the catalog was establishing its discipline. ADR-0012 expands the room within that contract now that the discipline is established and the glossary has grown. Same rules; more room for them to play in.
