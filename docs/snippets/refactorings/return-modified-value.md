---
name: return-modified-value
description: Apply Return Modified Value when you see Mutable Data. The function returns the modified value; the agent reads the signature and knows the function is a transformation, not a mutator.
---

# Apply: 50 — Return Modified Value

**Target state:** The function returns the modified value; the agent reads the signature and knows the function is a transformation, not a mutator.

**Why apply it:** Side effects on inputs disappear from the agent's contract reasoning; the function reads as a pure transformation; composition and snapshotting work.

**Tradeoff:** Callers must remember to capture the returned value; if any forget they keep the unmodified original, which the agent verifying must check at every call site (or rely on a readonly parameter type).

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

**Removes smells:** Mutable Data
