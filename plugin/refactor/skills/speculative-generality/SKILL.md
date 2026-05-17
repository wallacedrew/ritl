---
name: speculative-generality
description: Refuse Speculative Generality when abstract base classes, hooks, configuration knobs, or parameters with no real call site exercising them — the agent must learn vocabulary it never gets to use. Apply Collapse Hierarchy, Inline Function.
---

# Refuse: 15 — Speculative Generality

**Trigger (refuse when you see):** Abstract base classes, hooks, configuration knobs, or parameters with no real call site exercising them — the agent must learn vocabulary it never gets to use.

**Cost of leaving it in:** Tests cover branches no one exercises; readers (human and agent) learn dead vocabulary; refactoring proposals must consider phantom users that aren't real.

**Target shape after refactoring:** The code expresses exactly what it does today; the agent's mental model has no concepts that don't correspond to active behavior.

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

**Apply refactorings:** Collapse Hierarchy, Inline Function, Inline Class, Change Function Declaration, Remove Dead Code
