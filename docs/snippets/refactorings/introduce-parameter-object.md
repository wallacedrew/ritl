---
name: introduce-parameter-object
description: Apply Introduce Parameter Object when you see Long Parameter List, Data Clumps. The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.
---

# Apply: 08 — Introduce Parameter Object

**Target state:** The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.

**Why apply it:** Operations on the clump (formatting, validation, equality) live with it; the agent reasons about one named concept instead of N coupled fields.

**Tradeoff:** Constructing the object at every call adds an allocation and a name the agent must learn; if the clump appears in <3 places the wrapper is overhead.

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
