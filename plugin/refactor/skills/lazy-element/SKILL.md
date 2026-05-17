---
name: lazy-element
description: Refuse Lazy Element when a class, function, or namespace whose body the agent traces through only to find no decisions or transformations — every hop is pure overhead in reasoning context. Apply Inline Function, Inline Class.
---

# Refuse: 14 — Lazy Element

**Trigger (refuse when you see):** A class, function, or namespace whose body the agent traces through only to find no decisions or transformations — every hop is pure overhead in reasoning context.

**Cost of leaving it in:** The agent navigates through layers that add nothing; future maintainers (human or agent) face a choice between leaving dead weight or extracting a real reason for it.

**Target shape after refactoring:** Trivial wrappers disappear; the call site reads exactly as what's happening and the agent skips the indirection.

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
