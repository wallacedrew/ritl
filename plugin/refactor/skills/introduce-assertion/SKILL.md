---
name: introduce-assertion
description: Apply Introduce Assertion when you see Comments, Mutable Data. Invariants are stated explicitly; the agent reads them and reasons about behavior under their guarantee.
---

# Apply: 26 — Introduce Assertion

**Symptom:** Code that depends on unwritten invariants the agent must reconstruct from context; bugs that violate the invariant surface far from the source.

**Goal:** Invariants are stated explicitly; the agent reads them and reasons about behavior under their guarantee.

```js
// Avoid:
// rate must be positive
const tax = base * rate;

// Prefer:
if (rate <= 0) throw new Error('rate must be positive');
const tax = base * rate;
```

**Pressure:** The agent must reconstruct invariants from surrounding code; bugs surface far from the source and tracing them costs reasoning hops.

**Tradeoff:** Assertions used as control flow couple production behavior to debug-mode invariants; the agent that conflates the two ships a flow-dependent change disguised as documentation.

**Relief:** Invariants fail loudly at the source; the agent's debugging traces are short; assumptions become enforceable contracts.

**Trap:** Coupling production behavior to assertion presence/absence — the agent reads them as documentation but the runtime depends on them firing or not.

**Removes smells:** Comments, Mutable Data
