---
name: rename-field
description: Apply Rename Field when you see Mysterious Name. Field names carry the domain term; read or write sites resolve to one token of name without loading the class definition for context recovery.
---

# Apply: 19 — Rename Field

**Announce first:** name the smell you see and that you're applying Rename Field before any edit. The user reads the announcement as your contract.

**Symptom:** A field whose name does not match its role in the domain; every read or write site forces the agent to load the class definition to recover what the field represents before reasoning about the access.

**Goal:** Field names carry the domain term; read or write sites resolve to one token of name without loading the class definition for context recovery.

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

**Pressure:** Every access site pays the cost of loading the class definition to recover what the field stores; tokens consumed scale with the number of consumers, and generated code that misinterprets the field's role ships against the wrong invariant.

**Tradeoff:** Renaming a field invalidates more cached associations than a variable rename — persistence layers (DB columns, JSON schemas, API contracts) carry the old name until they update.

**Relief:** Field reads and writes resolve to one token of name without loading the class definition to recover what the field stores; the name is what the agent edits against in subsequent steps.

**Trap:** Renaming a field whose current name another reviewer would have accepted forces coordinated migrations across every external surface (database columns, JSON schemas, API contracts) without changing what the field stores.

**Removes smells:** Mysterious Name
