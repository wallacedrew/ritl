---
name: remove-setting-method
description: Apply Remove Setting Method when you see Mutable Data, Data Class. Construction is the only path to setting these fields; the agent reasons about the object as immutable-after-construction.
---

# Apply: 54 — Remove Setting Method

**Target state:** Construction is the only path to setting these fields; the agent reasons about the object as immutable-after-construction.

**Why apply it:** The agent reasons about the class as immutable-after-construction; bugs from late mutation vanish; the API expresses what users can actually do.

**Tradeoff:** Removing a setter forces every legitimate update through a more meaningful method; the agent must verify each setter call has a domain action that justifies replacing it.

```js
// Avoid:
class Person {
  setName(n) { this._name = n; }
}

// Prefer:
class Person {
  constructor(name) { this._name = name; }
  name() { return this._name; }
}
```

**Removes smells:** Mutable Data, Data Class
