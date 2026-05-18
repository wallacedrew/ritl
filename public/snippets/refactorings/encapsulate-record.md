---
name: encapsulate-record
description: Apply Encapsulate Record when you see Data Class, Primitive Obsession. The record is a class with accessors; the agent reasons about its shape, invariants, and behavior in one definition.
---

# Apply: 53 — Encapsulate Record

**Symptom:** A plain object passed across the codebase; the agent reading any consumer must inspect every other consumer to learn what shape the record actually has.

**Goal:** The record is a class with accessors; the agent reasons about its shape, invariants, and behavior in one definition.

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

**Pressure:** Field changes ripple through every consumer; the agent must coordinate updates and verify each consumer respects the (implicit) contract.

**Tradeoff:** Wrapping every record adds construction ceremony at every entry; for records without invariants or behavior to attract, the agent gains nothing for the per-call cost.

**Relief:** Field renames stay internal; invariants enforce in one place; the agent reasons about the class as a real domain object.

**Trap:** Wrapping records on principle without invariants or behavior to add creates classes the agent must instantiate everywhere with no encapsulation gain.

**Removes smells:** Data Class, Primitive Obsession
