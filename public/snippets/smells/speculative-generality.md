---
name: speculative-generality
description: Refuse Speculative Generality when hooks, abstract base classes, configuration knobs, and parameters added 'in case we need them' — but no real call site uses them. Apply Collapse Hierarchy, Inline Function.
---

# Refuse: 15 — Speculative Generality

**Trigger (refuse when you see):** Hooks, abstract base classes, configuration knobs, and parameters added 'in case we need them' — but no real call site uses them.

**Cost of leaving it in:** Tests are forced to cover branches no one exercises; readers learn a vocabulary they don't need; YAGNI debt compounds.

**Target shape after refactoring:** The code expresses exactly what it does today — abstraction earns its keep when a real second user shows up.

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
