# Refactoring discipline (drop into AGENTS.md / CLAUDE.md)

Apply this cycle to every change to existing code; refuse to skip steps.

## 1. Sense the smell

Match what you see against Fowler's vocabulary before changing anything. The 24 named smells: mysterious-name, duplicated-code, long-function, long-parameter-list, global-data, mutable-data, divergent-change, shotgun-surgery, feature-envy, data-clumps, primitive-obsession, repeated-switches, loops, lazy-element, speculative-generality, temporary-field, message-chains, middle-man, insider-trading, large-class, alternative-classes-with-different-interfaces, data-class, refused-bequest, comments.

Refuse to invent ad-hoc smell names. If nothing matches, say so.

## 2. Identify the source

State file path + line range explicitly. If the smell appears in multiple places, refactor the one with the fewest external dependencies first.

## 3. Establish a safety net

Before any structural change, the current behavior needs tests. If they don't exist, write characterization tests first, get them green, commit. Skip this step only if the area already has comprehensive coverage.

## 4. Apply one named refactoring

Pick from Fowler's catalog — Extract Function, Inline Function, Extract Variable, Replace Primitive with Object, Decompose Conditional, Replace Conditional with Polymorphism, Replace Loop with Pipeline, etc. State which one you're applying and why. One refactoring per commit.

## 4a. When you decline

If you decide **not** to apply a refactoring, name which kind of decline:

- **Catalog miss** — no Fowler smell matches; refuse to invent an ad-hoc name.
- **Taste call** — match exists, but judged not worth doing now. Arguable.
- **Cost-benefit** — match exists, but estimated cost > value. Name both estimates.
- **Constraint-blocked** — applying would break a non-negotiable contract (public API, perf budget).
- **Insufficient context** — can't decide without more information. Ask first.

Silent inaction hides which counterargument applies.

## 5. Stay green

Run the full test suite after each refactoring. Red → revert, decompose further, retry. Never power through red.

## 6. Recognize pattern destinations

When a stack of refactorings climbs toward a known shape, name the destination. Kerievsky's *Refactoring to Patterns* gives 27 composite refactorings whose endpoints are GoF design patterns; the GoF *Design Patterns* book gives 23 structural shapes. Look these up at refactorplug.com/reference. State the destination before applying the next move so the agent can verify each step is heading there. Refuse to invent ad-hoc pattern names; if nothing matches, say so.

## Tidy First

Structural changes (refactoring) and behavioral changes (features, fixes) ship in separate commits. Subjects: `refactor: <what>` for structural; `feat: <what>` or `fix: <what>` for behavioral. Structural commits include a `Before: / After: / Value:` block in the body so the next reader can tell load-bearing tidying from drive-by churn.

## Source

Fowler 2e (https://refactoring.com/catalog/), Kerievsky's *Refactoring to Patterns* (2004), and *Design Patterns* (Gamma/Helm/Johnson/Vlissides 1994). For Claude Code users, install the auto-invoking plugin instead of pasting this file: `/plugin marketplace add wallacedrew/ritl` then `/plugin install refactor@ritl` — each skill loads just-in-time on description match.
