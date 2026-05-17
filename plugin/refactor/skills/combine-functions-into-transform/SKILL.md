---
name: combine-functions-into-transform
description: Apply Combine Functions into Transform when you see Data Clumps, Mutable Data. Multiple derived values from the same source come from one transform that produces an enriched record.
---

# Apply: 10 — Combine Functions into Transform

**Target state:** Multiple derived values from the same source come from one transform that produces an enriched record.

**Why apply it:** Derivations stay consistent (no two callers compute slightly different versions); cache invalidation becomes obvious.

**Tradeoff:** Building a transform up-front when only one derivation exists is BDUF — wait for the second derivation before introducing the transform.

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
