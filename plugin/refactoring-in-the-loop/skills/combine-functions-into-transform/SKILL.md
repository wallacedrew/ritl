---
name: combine-functions-into-transform
description: Apply Combine Functions into Transform when you see Data Clumps, Mutable Data. Multiple derived values from the same source come from one transform that produces an enriched record.
---

# Apply: 10 — Combine Functions into Transform

**Target state:** Multiple derived values from the same source come from one transform that produces an enriched record.

**Why apply it:** Derivations stay consistent (no two callers compute slightly different versions); cache invalidation becomes obvious.

**Pitfall:** Building a transform up-front when only one derivation exists is BDUF — wait for the second derivation before introducing the transform.

```js
// Avoid:
function base(reading)    { /* ... */ }
function taxable(reading) { /* ... */ }

// Prefer:
function enrich(reading) {
  return { ...reading, base: base(reading), taxable: taxable(reading) };
}
```

**Removes smells:** Data Clumps, Mutable Data
