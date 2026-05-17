---
name: rename-field
description: Apply Rename Field when you see Mysterious Name. Field names match the domain role they play; readers don't need to inspect usage to know what a field means.
---

# Apply: 19 — Rename Field

**Target state:** Field names match the domain role they play; readers don't need to inspect usage to know what a field means.

**Why apply it:** Stronger encapsulation; future-you reads the class definition and immediately understands its shape.

**Tradeoff:** Same drift as Rename Variable, amplified across the field's read/write surface and any persistence shadows (DB columns, JSON schemas, APIs).

```js
// Avoid:
class Position {
  name;          // role name? or person's name?
  hiringManager;
}
console.log(position.name);  // ambiguous

// Prefer:
class Position {
  title;
  hiringManager;
}
console.log(position.title);  // clearly the role
```

**Removes smells:** Mysterious Name
