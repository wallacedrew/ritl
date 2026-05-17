---
name: replace-temp-with-query
description: Apply Replace Temp with Query when you see Long Function, Mutable Data. A local variable assigned once from a computation becomes a function that returns that computation on demand.
---

# Apply: 47 — Replace Temp with Query

**Target state:** A local variable assigned once from a computation becomes a function that returns that computation on demand.

**Why apply it:** Extract Function becomes easier (the query has a name and stable scope); the temp's lifetime no longer constrains how the surrounding function is split.

**Tradeoff:** If the temp wraps an expensive calculation called many times, naive replacement may multiply cost — measure or cache before deciding.

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
