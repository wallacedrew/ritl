---
name: replace-derived-variable-with-query
description: Apply Replace Derived Variable with Query when you see Mutable Data. Values computed from other state are computed on demand; no separate field needs to be kept in sync.
---

# Apply: 20 — Replace Derived Variable with Query

**Target state:** Values computed from other state are computed on demand; no separate field needs to be kept in sync.

**Why apply it:** Mutation scope shrinks; reasoning about state is simpler; no chance of the derived field drifting from its source.

**Pitfall:** If the derivation is expensive and the source rarely changes, recomputing on every read may be wasteful — measure before deciding.

```js
// Avoid:
class Order {
  items;
  total;
  add(item) {
    this.items.push(item);
    this.total += item.price;
  }
}

// Prefer:
class Order {
  items;
  add(item) {
    this.items.push(item);
  }
  total() {
    return this.items.reduce((s, i) => s + i.price, 0);
  }
}
```

**Removes smells:** Mutable Data
