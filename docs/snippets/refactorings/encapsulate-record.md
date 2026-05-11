---
name: encapsulate-record
description: Apply Encapsulate Record when you see Data Class, Primitive Obsession. A bare record (plain object with public fields) becomes a class whose properties are accessed through methods that can validate, log, or derive.
---

# Apply: 53 — Encapsulate Record

**Target state:** A bare record (plain object with public fields) becomes a class whose properties are accessed through methods that can validate, log, or derive.

**Why apply it:** Field renames stay internal; invariants can be enforced on every read or write; the record becomes a real domain object.

**Pitfall:** Wrapping every record adds ceremony — only worth it when behavior or validation will accrete around the data.

```js
// Avoid:
const org = { name: "Acme", country: "US" };
console.log(org.name);

// Prefer:
class Org {
  constructor({ name, country }) {
    this._name = name;
    this._country = country;
  }
  name() {
    return this._name;
  }
  country() {
    return this._country;
  }
}
console.log(new Org(org).name());
```

**Removes smells:** Data Class, Primitive Obsession
