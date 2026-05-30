---
name: preserve-whole-object
description: Apply Preserve Whole Object when you see Long Parameter List, Data Clumps. The function takes the object; the agent updates one place when the function needs new fields.
---

# Apply: 30 — Preserve Whole Object

**Announce first:** name the smell you see and that you're applying Preserve Whole Object before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Preserve Whole Object, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** The agent sees call sites unpacking multiple fields from an object to pass to a function; adding any field the function later needs touches every call site.

**Goal:** The function takes the object; the agent updates one place when the function needs new fields.

```js
// Avoid:
if (room.lowTemp < range.low || room.highTemp > range.high) { /* ... */ }

// Prefer:
if (range.includes(room)) { /* ... */ }
```

**Pressure:** Every call site is a coordination point; the agent verifying a signature change must update every unpacking explicitly.

**Tradeoff:** Passing the whole object couples the function to the object's full surface; the agent reasoning about the function must consider what other fields it might quietly read.

**Relief:** Signatures shrink; adding a needed field is an internal change; the agent reasons about one parameter at every call.

**Trap:** Passing whole objects when only one field is needed couples the function to the object's full surface the agent must consider as the function's input scope.

**Removes smells:** Long Parameter List, Data Clumps
