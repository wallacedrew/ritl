---
name: introduce-special-case
description: Apply Introduce Special Case when you see Repeated Switches, Comments. The special case responds to the same interface as the real case; the agent reasons without branching at every call site.
---

# Apply: 25 — Introduce Special Case

**Target state:** The special case responds to the same interface as the real case; the agent reasons without branching at every call site.

**Why apply it:** The agent reasons polymorphically; the special behavior lives in one class and consumers don't branch.

**Tradeoff:** Adding a Null Object class for a special case used in only one place creates ceremony around what was a one-line check; the agent now loads a class to handle one branch.

```js
// Avoid:
const name = customer === 'unknown' ? 'occupant' : customer.name;

// Prefer:
const name = customer.name; // UnknownCustomer.name returns 'occupant'
```

**Removes smells:** Repeated Switches, Comments
