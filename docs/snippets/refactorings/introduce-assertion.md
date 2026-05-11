---
name: introduce-assertion
description: Apply Introduce Assertion when you see Comments, Mutable Data. Invariants the code assumes are stated explicitly; readers don't need to deduce them.
---

# Apply: 26 — Introduce Assertion

**Target state:** Invariants the code assumes are stated explicitly; readers don't need to deduce them.

**Why apply it:** Bugs that violate the invariant fail loudly at the source instead of bubbling out as mysterious downstream errors.

**Pitfall:** Assertions used as control flow couple production behavior to debug-mode invariants — keep them as runtime contracts that should never fire.

```js
// Avoid:
// rate must be positive
const tax = base * rate;

// Prefer:
if (rate <= 0) throw new Error("rate must be positive");
const tax = base * rate;
```

**Removes smells:** Comments, Mutable Data
