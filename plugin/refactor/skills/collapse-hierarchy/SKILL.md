---
name: collapse-hierarchy
description: Apply Collapse Hierarchy when you see Lazy Element, Speculative Generality. The subclass folds into the parent; the agent reads one class instead of a degenerate two-class hierarchy.
---

# Apply: 37 — Collapse Hierarchy

**Target state:** The subclass folds into the parent; the agent reads one class instead of a degenerate two-class hierarchy.

**Why apply it:** Smaller hierarchy; less ceremony; the agent loads one class instead of navigating a degenerate two-class chain.

**Tradeoff:** If the subclass documents a future variation (extension point, planned divergence), collapsing destroys it; the agent that collapses without checking forecloses options.

```js
// Avoid:
class Employee {}
class FullTimeEmployee extends Employee {}

// Prefer:
class Employee {}
```

**Removes smells:** Lazy Element, Speculative Generality
