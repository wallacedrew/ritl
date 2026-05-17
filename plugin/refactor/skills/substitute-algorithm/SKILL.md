---
name: substitute-algorithm
description: Apply Substitute Algorithm when you see Long Function, Loops. An opaque or convoluted algorithm gets replaced by a clearer one (often from a library or well-known pattern) that produces the same outputs.
---

# Apply: 51 — Substitute Algorithm

**Target state:** An opaque or convoluted algorithm gets replaced by a clearer one (often from a library or well-known pattern) that produces the same outputs.

**Why apply it:** Future maintainers read the well-known pattern instead of decoding the bespoke implementation; performance and correctness usually improve.

**Tradeoff:** Swapping algorithms wholesale forfeits behavioral safety — characterize the function with tests at every input boundary you care about before substituting.

```js
// Avoid:
function found(people, n) {
  for (const p of people) if (p.name === n) return p;
  return null;
}

// Prefer:
function found(people, n) {
  return people.find(p => p.name === n) ?? null;
}
```

**Removes smells:** Long Function, Loops
