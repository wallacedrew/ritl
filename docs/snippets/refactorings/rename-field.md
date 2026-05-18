---
name: rename-field
description: Apply Rename Field when you see Mysterious Name. Field names carry domain meaning so the agent can interpret reads and writes without examining the class definition.
---

# Apply: 19 — Rename Field

**Target state:** Field names carry domain meaning so the agent can interpret reads and writes without examining the class definition.

**Why apply it:** The agent reasons about field access with the field's name as ground truth; consumer-side reasoning becomes self-documenting.

**Tradeoff:** Renaming a field invalidates more cached associations than a variable rename — persistence layers (DB columns, JSON schemas, API contracts) carry the old name until they update.

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
