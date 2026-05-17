---
name: remove-setting-method
description: Apply Remove Setting Method when you see Mutable Data, Data Class. Fields whose values should only be set at construction lose their setters; callers either construct a new object or call a domain method that changes the field as a side effect of doing real work.
---

# Apply: 54 — Remove Setting Method

**Target state:** Fields whose values should only be set at construction lose their setters; callers either construct a new object or call a domain method that changes the field as a side effect of doing real work.

**Why apply it:** Immutable-by-default classes; bugs from late mutation vanish; the API expresses what users can actually do.

**Tradeoff:** Removing a setter forces every legitimate update through a more meaningful method — verify there's a domain action behind every setter call before deleting it.

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
