---
name: replace-derived-variable-with-query
description: Apply Replace Derived Variable with Query when you see Mutable Data. Derived values are computed on demand; the agent reasons about state by reading source fields and trusting derivations.
---

# Apply: 20 — Replace Derived Variable with Query

**Symptom:** The agent finds a field whose value mirrors a computation on other fields; every writer of the source field must update the derived field consistently or the values drift.

**Goal:** Derived values are computed on demand; the agent reasons about state by reading source fields and trusting derivations.

```js
// Avoid:
class Order {
  items;
  total;
  add(item) { this.items.push(item); this.total += item.price; }
}

// Prefer:
class Order {
  items;
  add(item)  { this.items.push(item); }
  total()    { return this.items.reduce((s, i) => s + i.price, 0); }
}
```

**Pressure:** The agent must trace every writer of the source field to verify the derived field stays in sync; bugs hide where one writer forgot to update the derivation.

**Tradeoff:** Recomputing on every read can multiply cost if the derivation is expensive and the source rarely changes; the agent verifying performance must measure before deciding.

**Relief:** Mutation scope shrinks to source fields; the agent reasons about state without modeling derivation update timing; consistency is by construction.

**Trap:** Replacing every derived field with a query — including ones wrapping expensive computations called many times — trades runtime cost for correctness without measuring the impact.

**Removes smells:** Mutable Data
