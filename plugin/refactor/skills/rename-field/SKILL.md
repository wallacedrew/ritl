---
name: rename-field
description: Apply Rename Field when you see Mysterious Name. Field names carry domain meaning so the agent can interpret reads and writes without examining the class definition.
---

# Apply: 19 — Rename Field

**Symptom:** A class field the agent must contextualize against surrounding code to interpret; reasoning about any read/write touches the field plus the class-shape context.

**Goal:** Field names carry domain meaning so the agent can interpret reads and writes without examining the class definition.

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

**Pressure:** The agent re-derives field meaning at every access site; ambiguity compounds with the number of consumers.

**Tradeoff:** Renaming a field invalidates more cached associations than a variable rename — persistence layers (DB columns, JSON schemas, API contracts) carry the old name until they update.

**Relief:** The agent reasons about field access with the field's name as ground truth; consumer-side reasoning becomes self-documenting.

**Trap:** Renaming fields purely for cosmetic preference creates churn across persistence + API surfaces the agent must coordinate without comprehension gain.

**Removes smells:** Mysterious Name
