### Apply: 37 — Collapse Hierarchy

**Target state:** A subclass that no longer differs meaningfully from its parent merges back in.

**Why apply it:** Smaller hierarchy, less ceremony, fewer files to navigate.

**Pitfall:** Collapsing too eagerly destroys an extension point you'll later want — only collapse when the variant has been zero-sum for a sustained period.

```js
// Avoid:
class Employee {}
class FullTimeEmployee extends Employee {}

// Prefer:
class Employee {}
```

**Removes smells:** Lazy Element, Speculative Generality
