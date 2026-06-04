# 0013. Word budget narrowed to 40–60 per field

- **Status**: accepted (supersedes ADR-0012)
- **Date**: 2026-06-04
- **Deciders**: project owner, agent

## Context

ADR-0012 (also dated 2026-06-04) expanded the word budget from 25/50 to 50/75 per field. Within hours of rewriting the first seven smells against the new budget, the upper bound proved too generous. Fields at 70+ words read longer than the compare view's visual rhythm wants; the prose density that the older 50-word budget enforced was a feature, not a bug. The 50-word floor — meant to push fields past their previous compression — also overshot. Fields at 50–60 words land the mechanism cleanly with room for one cross-reference; fields at 65–75 words tend to add a third clause that pads more than it explains.

The lesson from the seven rewrites: 50 words is roughly where the prose gains room to breathe; 60 words is roughly where the second clause starts repeating the first. The 25-word budget under-served the catalog's pedagogy; the 75-word budget over-served it.

## Decision

The field-length budget becomes **40–60 words per field**, applied to both human-side and agent-side force fields.

- **Hard ceiling**: 60 words. Lint-enforced via `agent-forces-length.test.ts`.
- **Floor**: 40 words. Editorial target.
- **Median target**: ~50 words.
- **Sentence count** (ADR-0010 §6) remains 1–3 per field.

## Consequences

**Easier:**

- The compare view's two columns stay visually balanced — each field is roughly two short paragraphs of pose, not a wall.
- The 60-word ceiling forces compression discipline back into the authoring loop without sacrificing the cross-reference room the original 50-word ceiling was just barely missing.
- Density returns to the prose: every sentence carries weight because the budget can't accommodate filler.

**Harder / new constraints:**

- The seven smells revised against the 50–75 budget run long. The same slice that lands this ADR also revises them down into the 40–60 range.
- Authors who acclimated to the larger budget over the last few hours of writing need to re-internalize the tighter discipline. The voice ADRs (0006, 0009, 0010, 0011) still constrain vocabulary, POV, mood, and mechanism citation; the budget change does not relax those.

**Follow-up work:**

- The seven smells revised under ADR-0012's budget are compressed in this same slice. No floor lint is added — the editorial 40-word target follows the same posture as ADR-0012's deferred floor: enforce only after the corpus migration is complete.

## Source framing

ADR-0012 widened the room for prose. ADR-0013 narrows it back. Same voice contract, calibrated tighter after the wider budget surfaced its own kind of slack.
