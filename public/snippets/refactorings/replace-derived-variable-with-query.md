---
name: replace-derived-variable-with-query
description: Apply Replace Derived Variable with Query when you see Mutable Data. Derived values are computed on demand; the agent reasons about state by reading source fields and trusting derivations.
---

# Apply: 20 — Replace Derived Variable with Query

**Target state:** Derived values are computed on demand; the agent reasons about state by reading source fields and trusting derivations.

**Why apply it:** Mutation scope shrinks to source fields; the agent reasons about state without modeling derivation update timing; consistency is by construction.

**Tradeoff:** Recomputing on every read can multiply cost if the derivation is expensive and the source rarely changes; the agent verifying performance must measure before deciding.

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

**Removes smells:** Mutable Data
