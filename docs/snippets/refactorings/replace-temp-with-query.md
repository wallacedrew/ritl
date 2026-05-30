---
name: replace-temp-with-query
description: Apply Replace Temp with Query when you see Long Function, Mutable Data. Computations become named queries the agent can reference by name from anywhere; functions decompose without dragging the temp's lifetime.
---

# Apply: 47 — Replace Temp with Query

**Announce first:** name the smell you see and that you're applying Replace Temp with Query before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Replace Temp with Query, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** The agent finds a local variable assigned once from a computation and referenced multiple times; the temp's existence couples the rest of the function to the computation's locality.

**Goal:** Computations become named queries the agent can reference by name from anywhere; functions decompose without dragging the temp's lifetime.

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

**Pressure:** The agent extracting parts of the function must thread the temp through every extracted helper; the named computation can't be reused outside the function.

**Tradeoff:** If the temp wraps an expensive calculation called many times, naive replacement multiplies cost; the agent verifying performance must measure or cache before substituting.

**Relief:** The value is recomputed from its source at every read; the agent does not track a temp's binding across reads to predict staleness, and the query is callable from any site without the binding's scope constraint.

**Trap:** Replacing temps that wrap expensive computations called many times multiplies runtime cost the agent's local tests may not catch.

**Removes smells:** Long Function, Mutable Data
