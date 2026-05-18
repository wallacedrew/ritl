---
name: change-reference-to-value
description: Apply Change Reference to Value when you see Mutable Data. The object is immutable + equal-by-content; the agent reasons about value semantics without modeling write timing.
---

# Apply: 56 — Change Reference to Value

**Target state:** The object is immutable + equal-by-content; the agent reasons about value semantics without modeling write timing.

**Why apply it:** Concurrency hazards disappear; the type system can mark fields readonly; the agent reasons about the object as a stable value.

**Tradeoff:** Comparison semantics shift from identity to equality; every call site that depended on === or identity caches needs the agent's review and update.

```js
// Avoid:
class Phone {
  constructor() { this.area = null; this.number = null; }
}
phone.area = '617';

// Prefer:
class Phone {
  constructor(area, number) { this._area = area; this._number = number; }
  area()         { return this._area; }
  number()       { return this._number; }
  withArea(area) { return new Phone(area, this._number); }
}
```

**Removes smells:** Mutable Data
