---
name: encapsulate-record
description: Apply Encapsulate Record when you see Data Class, Primitive Obsession. The record is a class with accessors; the agent reasons about its shape, invariants, and behavior in one definition.
---

# Apply: 53 — Encapsulate Record

**Target state:** The record is a class with accessors; the agent reasons about its shape, invariants, and behavior in one definition.

**Why apply it:** Field renames stay internal; invariants enforce in one place; the agent reasons about the class as a real domain object.

**Tradeoff:** Wrapping every record adds construction ceremony at every entry; for records without invariants or behavior to attract, the agent gains nothing for the per-call cost.

```js
// Avoid:
const org = { name: 'Acme', country: 'US' };
console.log(org.name);

// Prefer:
class Org {
  constructor({ name, country }) { this._name = name; this._country = country; }
  name()    { return this._name; }
  country() { return this._country; }
}
console.log(new Org(org).name());
```

**Removes smells:** Data Class, Primitive Obsession
