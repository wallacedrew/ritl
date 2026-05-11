---
name: combine-functions-into-class
description: Apply Combine Functions into Class when you see Data Clumps, Primitive Obsession. Functions that all act on the same data live alongside it as methods; calls become method calls on a domain object.
---

# Apply: 09 — Combine Functions into Class

**Target state:** Functions that all act on the same data live alongside it as methods; calls become method calls on a domain object.

**Why apply it:** Encapsulation tightens; tests target the class; new operations land in one obvious place.

**Pitfall:** Wrapping passive data in a class that nobody else uses adds ceremony — only combine when 2+ functions take the same data and would benefit from co-located behavior.

```js
// Avoid:
function baseCharge(reading)    { /* uses reading */ }
function taxableCharge(reading) { /* uses reading */ }

// Prefer:
class Reading {
  baseCharge()    { /* ... */ }
  taxableCharge() { /* ... */ }
}
```

**Removes smells:** Data Clumps, Primitive Obsession
