---
name: introduce-special-case
description: Apply Introduce Special Case when you see Repeated Switches, Comments. The special case responds to the same interface as the real case; the agent reasons without branching at every call site.
---

# Apply: 25 — Introduce Special Case

**Symptom:** The agent finds the same null-or-special check repeating across multiple consumers; consistency depends on every consumer remembering the pattern.

**Goal:** The special case responds to the same interface as the real case; the agent reasons without branching at every call site.

```js
// Avoid:
const name = customer === 'unknown' ? 'occupant' : customer.name;

// Prefer:
const name = customer.name; // UnknownCustomer.name returns 'occupant'
```

**Pressure:** Every consumer is a chance to miss the check; the agent verifying consistency must audit every site.

**Tradeoff:** Adding a Null Object class for a special case used in only one place creates ceremony around what was a one-line check; the agent now loads a class to handle one branch.

**Relief:** The agent reasons polymorphically; the special behavior lives in one class and consumers don't branch.

**Trap:** Introducing a Null Object class for special checks used in only one place creates a class the agent must load and reason about with no consistency gain.

**Removes smells:** Repeated Switches, Comments
