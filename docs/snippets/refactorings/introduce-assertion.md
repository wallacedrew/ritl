---
name: introduce-assertion
description: Apply Introduce Assertion when you see Comments, Mutable Data. Invariants are stated explicitly; the agent reads them and reasons about behavior under their guarantee.
---

# Apply: 26 — Introduce Assertion

**Target state:** Invariants are stated explicitly; the agent reads them and reasons about behavior under their guarantee.

**Why apply it:** Invariants fail loudly at the source; the agent's debugging traces are short; assumptions become enforceable contracts.

**Tradeoff:** Assertions used as control flow couple production behavior to debug-mode invariants; the agent that conflates the two ships a flow-dependent change disguised as documentation.

```js
// Avoid:
// rate must be positive
const tax = base * rate;

// Prefer:
if (rate <= 0) throw new Error('rate must be positive');
const tax = base * rate;
```

**Removes smells:** Comments, Mutable Data
