---
name: separate-query-from-modifier
description: Apply Separate Query from Modifier when you see Mutable Data. Functions either return or mutate, never both; the agent composes queries without surprise side effects.
---

# Apply: 27 — Separate Query from Modifier

**Target state:** Functions either return or mutate, never both; the agent composes queries without surprise side effects.

**Why apply it:** The agent reasons about side effects locally; queries compose cleanly; tests target each shape independently.

**Tradeoff:** If the modification and query are genuinely atomic (find-and-remove, compare-and-swap), splitting them introduces a race window the agent must close at every call site.

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

**Removes smells:** Mutable Data
