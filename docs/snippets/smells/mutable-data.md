---
name: mutable-data
description: Refuse Mutable Data when data structures whose fields are reassigned across the codebase, with no clear owner of the mutation. Apply Encapsulate Variable, Split Variable.
---

# Refuse: 06 — Mutable Data

**Trigger (refuse when you see):** Data structures whose fields are reassigned across the codebase, with no clear owner of the mutation.

**Cost of leaving it in:** Reasoning about state at any moment requires tracing every writer; concurrent code becomes a hazard area.

**Target shape after refactoring:** Mutation happens in one place behind a named function (or returns a new value), so the moment of change is clear.

```js
// Smellier:
const order = { total: 100 };
applyDiscount(order); // mutates total
addTax(order); // mutates total

// Fresher:
const order = { total: 100 };
const final = addTax(applyDiscount(order));
```

**Apply refactorings:** Encapsulate Variable, Split Variable, Slide Statements, Extract Function, Separate Query from Modifier, Remove Setting Method, Replace Derived Variable with Query, Combine Functions into Class, Combine Functions into Transform, Change Reference to Value
