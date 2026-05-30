---
name: separate-query-from-modifier
description: Apply Separate Query from Modifier when you see Mutable Data. Functions either return or mutate, never both; the agent composes queries without surprise side effects.
---

# Apply: 27 — Separate Query from Modifier

**Announce first:** name the smell you see and that you're applying Separate Query from Modifier before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Separate Query from Modifier, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A function the agent calls for a query also mutates state; the agent reasoning about safety must trace the mutation across consumers.

**Goal:** Functions either return or mutate, never both; the agent composes queries without surprise side effects.

```js
// Avoid:
function findMiscreant(people) {
  for (const p of people) {
    if (p.isMiscreant) { alert(p); return p; }
  }
}

// Prefer:
function findMiscreant(people) { return people.find(p => p.isMiscreant); }
function alertMiscreant(people) {
  const m = findMiscreant(people);
  if (m) alert(m);
}
```

**Pressure:** Every call to the function pays for both contracts; the agent can't query without triggering mutation, which complicates testing and composition.

**Tradeoff:** If the modification and query are genuinely atomic (find-and-remove, compare-and-swap), splitting them introduces a race window the agent must close at every call site.

**Relief:** Queries return values without mutating; the agent predicts each function's effect from its name alone, and code generated against a query never accidentally writes the state the query reads.

**Trap:** Splitting atomic query-and-modify operations introduces race windows the agent must reason about at every call site — the cure becomes worse than the smell.

**Removes smells:** Mutable Data
