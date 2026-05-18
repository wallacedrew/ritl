---
name: replace-temp-with-query
description: Apply Replace Temp with Query when you see Long Function, Mutable Data. Computations become named queries the agent can reference by name from anywhere; functions decompose without dragging the temp's lifetime.
---

# Apply: 47 — Replace Temp with Query

**Target state:** Computations become named queries the agent can reference by name from anywhere; functions decompose without dragging the temp's lifetime.

**Why apply it:** The agent's plan-and-execute loop for Extract Function becomes mechanical; the named query is reusable anywhere it makes sense.

**Tradeoff:** If the temp wraps an expensive calculation called many times, naive replacement multiplies cost; the agent verifying performance must measure or cache before substituting.

```js
// Avoid:
function bill() {
  const basePrice = qty * itemPrice;
  if (basePrice > 1000) return basePrice * 0.95;
  return basePrice;
}

// Prefer:
function bill() {
  if (basePrice() > 1000) return basePrice() * 0.95;
  return basePrice();
}
function basePrice() { return qty * itemPrice; }
```

**Removes smells:** Long Function, Mutable Data
