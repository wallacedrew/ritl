---
name: introduce-parameter-object
description: Apply Introduce Parameter Object when you see Long Parameter List, Data Clumps. Related arguments travel together as one well-named value object that the function (and callers) refer to by name.
---

# Apply: 08 — Introduce Parameter Object

**Target state:** Related arguments travel together as one well-named value object that the function (and callers) refer to by name.

**Why apply it:** Adding a related field is one type change instead of touching every call site; intent is named.

**Tradeoff:** Premature parameter objects hide which fields are actually needed by which method — wait until the clump appears in 3+ places before extracting.

```js
// Avoid:
function recordTemperature(low, high, value) { /* ... */ }
function alertIfOutOfRange(low, high, reading) { /* ... */ }

// Prefer:
class NumberRange {
  constructor(low, high) { this.low = low; this.high = high; }
}
function recordTemperature(range, value)   { /* ... */ }
function alertIfOutOfRange(range, reading) { /* ... */ }
```

**Removes smells:** Long Parameter List, Data Clumps
