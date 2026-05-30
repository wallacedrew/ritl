---
name: introduce-parameter-object
description: Apply Introduce Parameter Object when you see Long Parameter List, Data Clumps. The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.
---

# Apply: 08 — Introduce Parameter Object

**Announce first:** name the smell you see and that you're applying Introduce Parameter Object before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Introduce Parameter Object, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** The agent sees the same field group appearing across multiple signatures; every site re-parses the same shape and verifies the same ordering.

**Goal:** The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.

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

**Pressure:** Adding or reordering a field touches every signature; the agent must find and update each consistently or risk silent positional drift.

**Tradeoff:** Constructing the object at every call adds an allocation and a name the agent must learn; if the clump appears in <3 places the wrapper is overhead.

**Relief:** The bundled parameter carries the values together as one typed object; the agent matches one field per name at each call site instead of N positional arguments where a mis-alignment passes the type checker.

**Trap:** Wrapping coincidental field groups creates fake value objects the agent must construct and destructure with no comprehension gain.

**Removes smells:** Long Parameter List, Data Clumps
