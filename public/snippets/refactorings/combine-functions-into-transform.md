---
name: combine-functions-into-transform
description: Apply Combine Functions into Transform when you see Data Clumps, Mutable Data. One transform produces the enriched record; the agent reasons about derivations in one place and consumers read named fields.
---

# Apply: 10 — Combine Functions into Transform

**Target state:** One transform produces the enriched record; the agent reasons about derivations in one place and consumers read named fields.

**Why apply it:** Derivations are consistent by construction; the agent reads field accesses on the enriched record instead of computing across the codebase.

**Tradeoff:** Building the transform when only one consumer exists creates an intermediate type the agent must learn before its second use justifies it.

```js
// Avoid:
function baseCharge(reading)    { return reading.kwh * reading.tariff.baseRate; }
function taxableCharge(reading) { return reading.kwh * reading.tariff.taxRate; }
// every consumer recomputes:
const monthly  = baseCharge(reading) + taxableCharge(reading);
const discount = baseCharge(reading) * 0.95;

// Prefer:
function enrich(reading) {
  return {
    ...reading,
    baseCharge:    reading.kwh * reading.tariff.baseRate,
    taxableCharge: reading.kwh * reading.tariff.taxRate,
  };
}
const r = enrich(reading);
const monthly  = r.baseCharge + r.taxableCharge;
const discount = r.baseCharge * 0.95;
```

**Removes smells:** Data Clumps, Mutable Data
