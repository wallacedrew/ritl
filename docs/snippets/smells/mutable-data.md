---
name: mutable-data
description: Refuse Mutable Data when fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires tracing every writer. Apply Encapsulate Variable, Split Variable.
---

# Refuse: 06 — Mutable Data

**Trigger (refuse when you see):** Fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires tracing every writer.

**Cost of leaving it in:** The agent cannot answer 'what is this value here?' without modeling the full timeline of writes; concurrent reasoning becomes practically impossible.

**Target shape after refactoring:** Mutation happens behind a named function with a clear contract, or the data is replaced rather than modified — the agent can locate every change in one place.

```js
// Smellier:
const order = { total: 100 };
applyDiscount(order); // mutates total
addTax(order);        // mutates total

// Fresher:
const order = { total: 100 };
const final = addTax(applyDiscount(order));
```

**Apply refactorings:** Encapsulate Variable, Split Variable, Slide Statements, Extract Function, Separate Query from Modifier, Remove Setting Method, Replace Derived Variable with Query, Combine Functions into Class, Combine Functions into Transform, Change Reference to Value
