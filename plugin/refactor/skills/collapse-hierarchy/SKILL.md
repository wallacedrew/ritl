---
name: collapse-hierarchy
description: Apply Collapse Hierarchy when you see Lazy Element, Speculative Generality. The subclass folds into the parent; the agent reads one class instead of a degenerate two-class hierarchy.
---

# Apply: 37 — Collapse Hierarchy

**Symptom:** A subclass that no longer differs meaningfully from its parent; the agent navigating the hierarchy traverses indirection for no behavioral variation.

**Goal:** The subclass folds into the parent; the agent reads one class instead of a degenerate two-class hierarchy.

```js
// Avoid:
class Employee {}
class FullTimeEmployee extends Employee {}

// Prefer:
class Employee {}
```

**Pressure:** The agent's reasoning pays the hierarchy ceremony cost on every reference; future maintenance touches both classes for any change.

**Tradeoff:** If the subclass documents a future variation (extension point, planned divergence), collapsing destroys it; the agent that collapses without checking forecloses options.

**Relief:** Smaller hierarchy; less ceremony; the agent loads one class instead of navigating a degenerate two-class chain.

**Trap:** Collapsing subclasses that document planned future variation destroys extension points the agent will need to re-introduce later at higher cost.

**Removes smells:** Lazy Element, Speculative Generality
