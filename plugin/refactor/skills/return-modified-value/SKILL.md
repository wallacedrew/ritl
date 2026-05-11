---
name: return-modified-value
description: Apply Return Modified Value when you see Mutable Data. Instead of mutating a parameter in place, the function returns the modified value so the caller reassigns.
---

# Apply: 50 — Return Modified Value

**Target state:** Instead of mutating a parameter in place, the function returns the modified value so the caller reassigns.

**Why apply it:** Side effects on inputs disappear; the function reads as a transformation; equality and snapshotting become possible.

**Pitfall:** Callers must remember to capture the returned value; if any forget, they keep the unmodified original. Mark the parameter readonly so the type system helps.

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
