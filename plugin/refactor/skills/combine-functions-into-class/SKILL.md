---
name: combine-functions-into-class
description: Apply Combine Functions into Class when you see Data Clumps, Primitive Obsession. Operations live with the data they act on; the agent loads one class to reason about both shape and behavior.
---

# Apply: 09 — Combine Functions into Class

**Target state:** Operations live with the data they act on; the agent loads one class to reason about both shape and behavior.

**Why apply it:** The agent loads the class as a single unit; behavior, fields, and invariants all in one place with one import.

**Tradeoff:** Wrapping the data in a class adds construction ceremony at every entry point; for data only used in one place the class is more code than the original concern warranted.

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

**Removes smells:** Data Clumps, Primitive Obsession
