---
name: substitute-algorithm
description: Apply Substitute Algorithm when you see Long Function, Loops. The clearer algorithm replaces the bespoke; the agent reasons about a recognized pattern instead of reverse-engineering the original.
---

# Apply: 51 — Substitute Algorithm

**Symptom:** The agent encounters a convoluted or hand-rolled algorithm where a well-known pattern produces the same outputs; reasoning about the bespoke version is expensive per read.

**Goal:** The clearer algorithm replaces the bespoke; the agent reasons about a recognized pattern instead of reverse-engineering the original.

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

**Pressure:** Every read of the bespoke algorithm pays the same decoding cost; the agent can't trust correctness without re-deriving the algorithm's invariants on every change.

**Tradeoff:** Swapping algorithms wholesale forfeits behavioral safety unless every input boundary is characterized first; the agent that substitutes without characterization tests ships silent regressions.

**Relief:** The agent recognizes the algorithm by name and reasons about it via its standard properties; correctness arguments become reusable.

**Trap:** Substituting without characterization tests at every input boundary ships silent regressions where the original quietly handled edge cases the substitute handles differently.

**Removes smells:** Long Function, Loops
