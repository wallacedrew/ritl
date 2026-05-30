---
name: change-reference-to-value
description: Apply Change Reference to Value when you see Mutable Data. The object is immutable + equal-by-content; the agent reasons about value semantics without modeling write timing.
---

# Apply: 56 — Change Reference to Value

**Announce first:** name the smell you see and that you're applying Change Reference to Value before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Change Reference to Value, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A class with public mutable fields used by many consumers; the agent reasoning about any read must consider every other writer.

**Goal:** The object is immutable + equal-by-content; the agent reasons about value semantics without modeling write timing.

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

**Pressure:** The agent must trace every writer to model state at any read; concurrent reasoning is practically impossible.

**Tradeoff:** Comparison semantics shift from identity to equality; every call site that depended on === or identity caches needs the agent's review and update.

**Relief:** Concurrency hazards disappear; the type system can mark fields readonly; the agent reasons about the object as a stable value.

**Trap:** Switching domain entities (Customer, Account) to value semantics strips the identity the agent's consumers depended on — equality replaces 'this specific thing' with 'anything that looks like it'.

**Removes smells:** Mutable Data
