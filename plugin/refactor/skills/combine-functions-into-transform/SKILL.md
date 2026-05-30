---
name: combine-functions-into-transform
description: Apply Combine Functions into Transform when you see Data Clumps, Mutable Data. One transform produces the enriched record from the input; the agent reads one input-to-shape contract and consumers read named output fields without simulating the derivation.
---

# Apply: 10 — Combine Functions into Transform

**Announce first:** name the smell you see and that you're applying Combine Functions into Transform before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Combine Functions into Transform, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** The agent encounters consumers each independently computing the same derived values from the same source; reasoning about consistency requires tracing every derivation.

**Goal:** One transform produces the enriched record from the input; the agent reads one input-to-shape contract and consumers read named output fields without simulating the derivation.

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

**Pressure:** Each consumer re-derives the same values; the agent can't trust them to be consistent and must verify equivalence on every change.

**Tradeoff:** Building the transform when only one consumer exists creates an intermediate type the agent must learn before its second use justifies it.

**Relief:** Derivations are consistent by construction; the agent reads field accesses on the enriched record instead of computing across the codebase.

**Trap:** Pre-building transforms for hypothetical consumers creates intermediate shapes the agent must understand and maintain with no active reuse.

**Removes smells:** Data Clumps, Mutable Data
