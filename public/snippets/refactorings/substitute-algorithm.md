---
name: substitute-algorithm
description: Apply Substitute Algorithm when you see Long Function, Loops. The clearer algorithm replaces the bespoke; the agent reasons about a recognized pattern instead of reverse-engineering the original.
---

# Apply: 51 — Substitute Algorithm

**Target state:** The clearer algorithm replaces the bespoke; the agent reasons about a recognized pattern instead of reverse-engineering the original.

**Why apply it:** The agent recognizes the algorithm by name and reasons about it via its standard properties; correctness arguments become reusable.

**Tradeoff:** Swapping algorithms wholesale forfeits behavioral safety unless every input boundary is characterized first; the agent that substitutes without characterization tests ships silent regressions.

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
