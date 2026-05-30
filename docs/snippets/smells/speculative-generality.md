---
name: speculative-generality
description: Refuse Speculative Generality when abstract base classes, hooks, configuration knobs, or parameters with no real call site exercising them — the agent must learn vocabulary it never gets to use. Apply Collapse Hierarchy, Inline Function.
---

# Refuse: 15 — Speculative Generality

**Announce first:** name this as Speculative Generality and which refactoring you'll apply (Collapse Hierarchy or Inline Function) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Speculative Generality, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Abstract base classes, hooks, configuration knobs, or parameters with no real call site exercising them — the agent must learn vocabulary it never gets to use.

**Goal:** The code expresses exactly what it does today; the agent's mental model has no concepts that don't correspond to active behavior.

```js
// Smellier:
class Strategy { execute() {} }
class OnlyStrategy extends Strategy { execute() { /* the real one */ } }
new OnlyStrategy().execute();

// Fresher:
function execute() {
  // the real one
}
execute();
```

**Pressure:** Tests cover branches no one exercises; readers (human and agent) learn dead vocabulary; refactoring proposals must consider phantom users that aren't real.

**Tradeoff:** Removing speculative scaffolding is sometimes a real loss — the abstraction may document a coming feature or a deliberately-preserved seam; the agent collapsing it must verify no current or imminent caller relies on the option.

**Relief:** Smaller surface; fewer concepts the agent must hold in its reasoning context; tests align with actual behavior so green tests mean live coverage.

**Trap:** Collapsing every unused hook on sight removes options the team had reason to hold; the agent must judge intent before deleting, or risk shipping cleanups the maintainers reject.

**Apply refactorings:** Collapse Hierarchy, Inline Function, Inline Class, Change Function Declaration, Remove Dead Code
