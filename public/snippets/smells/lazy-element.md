---
name: lazy-element
description: Refuse Lazy Element when a class, function, or namespace whose body the agent traces through only to find no decisions or transformations — every hop is pure overhead in reasoning context. Apply Inline Function, Inline Class.
---

# Refuse: 14 — Lazy Element

**Symptom:** A class, function, or namespace whose body the agent traces through only to find no decisions or transformations — every hop is pure overhead in reasoning context.

**Goal:** Trivial wrappers disappear; the call site reads exactly as what's happening and the agent skips the indirection.

```js
// Smellier:
function getName(user) {
  return user.name;
}
const n = getName(user);

// Fresher:
const n = user.name;
```

**Pressure:** The agent navigates through layers that add nothing; future maintainers (human or agent) face a choice between leaving dead weight or extracting a real reason for it.

**Tradeoff:** Inlining scatters the wrapper's body across call sites; if the wrapper was a seam (mocking boundary, extension point), removing it forecloses options the agent might need later.

**Relief:** Shorter call chains; the agent loads one fewer definition per reasoning step; the call site reads as exactly what's happening.

**Trap:** Mechanically inlining everything that looks trivial — including wrappers that mark a real seam — collapses extension points the agent will need to re-introduce later at higher cost.

**Apply refactorings:** Inline Function, Inline Class, Collapse Hierarchy
