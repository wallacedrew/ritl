---
name: return-modified-value
description: Apply Return Modified Value when you see Mutable Data. The function returns the modified value; the agent reads the signature and knows the function is a transformation, not a mutator.
---

# Apply: 50 — Return Modified Value

**Announce first:** name the smell you see and that you're applying Return Modified Value before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Return Modified Value, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A function that mutates one of its parameters in place; the agent reading the signature can't tell which parameters get mutated without reading the body.

**Goal:** The function returns the modified value; the agent reads the signature and knows the function is a transformation, not a mutator.

```js
// Avoid:
function addTax(order) {
  order.total *= 1.1;
}
addTax(order);

// Prefer:
function withTax(order) {
  return { ...order, total: order.total * 1.1 };
}
order = withTax(order);
```

**Pressure:** The agent reasoning about any call must check the function body to identify which parameters mutate; equality, snapshotting, and composition all become guarded.

**Tradeoff:** Callers must remember to capture the returned value; if any forget they keep the unmodified original, which the agent verifying must check at every call site (or rely on a readonly parameter type).

**Relief:** Side effects on inputs disappear from the agent's contract reasoning; the function reads as a pure transformation; composition and snapshotting work.

**Trap:** Forcing return-modified-value on every in-place mutator — including ones where mutation is the contract callers want (performance-critical batch ops) — substitutes one mismatch for another.

**Removes smells:** Mutable Data
