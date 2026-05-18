---
name: separate-query-from-modifier
description: Apply Separate Query from Modifier when you see Mutable Data. Functions either return or mutate, never both; the agent composes queries without surprise side effects.
---

# Apply: 27 — Separate Query from Modifier

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

**Relief:** The agent reasons about side effects locally; queries compose cleanly; tests target each shape independently.

**Trap:** Splitting atomic query-and-modify operations introduces race windows the agent must reason about at every call site — the cure becomes worse than the smell.

**Removes smells:** Mutable Data
