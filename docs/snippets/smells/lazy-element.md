---
name: lazy-element
description: Refuse Lazy Element when a class, function, or namespace that exists but does nothing meaningful — a one-line wrapper, an empty subclass, a passthrough method. Apply Inline Function, Inline Class.
---

# Refuse: 14 — Lazy Element

**Trigger (refuse when you see):** A class, function, or namespace that exists but does nothing meaningful — a one-line wrapper, an empty subclass, a passthrough method.

**Cost of leaving it in:** Reader pays a navigation cost to discover the wrapper adds nothing; future changes are tempted to add real work to it.

**Target shape after refactoring:** Trivial wrappers disappear; the call site says exactly what's happening.

```js
// Smellier:
function getName(user) {
  return user.name;
}
const n = getName(user);

// Fresher:
const n = user.name;
```

**Apply refactorings:** Inline Function, Inline Class, Collapse Hierarchy
