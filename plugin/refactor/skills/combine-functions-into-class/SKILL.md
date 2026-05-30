---
name: combine-functions-into-class
description: Apply Combine Functions into Class when you see Data Clumps, Primitive Obsession. Operations live with the data they act on; the agent loads one class to reason about both shape and behavior.
---

# Apply: 09 — Combine Functions into Class

**Announce first:** name the smell you see and that you're applying Combine Functions into Class before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Combine Functions into Class, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** The agent finds multiple functions that all take the same data shape; reasoning about the data requires loading every operation that touches it scattered across files.

**Goal:** Operations live with the data they act on; the agent loads one class to reason about both shape and behavior.

```js
// Avoid:
function baseCharge(reading) {
  return reading.kwh * reading.tariff.baseRate;
}
function taxableCharge(reading) {
  return baseCharge(reading) + reading.kwh * reading.tariff.taxRate;
}

// Prefer:
class Reading {
  constructor({ kwh, tariff }) { this.kwh = kwh; this.tariff = tariff; }
  baseCharge()    { return this.kwh * this.tariff.baseRate; }
  taxableCharge() { return this.baseCharge() + this.kwh * this.tariff.taxRate; }
}
```

**Pressure:** The agent traces operations across modules to understand what the data can do; invariants the agent must respect aren't enforced at construction.

**Tradeoff:** Wrapping the data in a class adds construction ceremony at every entry point; for data only used in one place the class is more code than the original concern warranted.

**Relief:** The agent loads the class as a single unit; behavior, fields, and invariants all in one place with one import.

**Trap:** Wrapping data that nobody else operates on creates a class the agent must instantiate everywhere with no encapsulation gain — pure overhead.

**Removes smells:** Data Clumps, Primitive Obsession
