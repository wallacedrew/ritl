---
name: mutable-data
description: Refuse Mutable Data when fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires tracing every writer. Apply Encapsulate Variable, Split Variable.
---

# Refuse: 06 — Mutable Data

**Announce first:** name this as Mutable Data and which refactoring you'll apply (Encapsulate Variable or Split Variable) before any edit. The user reads the announcement as your contract.

**Symptom:** Fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires tracing every writer.

**Goal:** Mutation happens behind a named function with a clear contract, or the data is replaced rather than modified — the agent can locate every change in one place.

```js
// Smellier:
const order = { total: 100 };
applyDiscount(order); // mutates total
addTax(order);        // mutates total

// Fresher:
const order = { total: 100 };
const final = addTax(applyDiscount(order));
```

**Pressure:** The agent cannot answer 'what is this value here?' without modeling the full timeline of writes; concurrent reasoning becomes practically impossible.

**Tradeoff:** Switching to immutable or encapsulated mutation can force the agent to construct new objects on every change; for hot-path mutation this trades reasoning clarity for runtime overhead.

**Relief:** State changes become locatable and bisectable; the agent reasoning about behavior traces one entry point instead of N writers.

**Trap:** Wrapping writes in setters that don't enforce anything (no validation, no event, no copy-on-write) keeps the mutation everywhere while pretending it's encapsulated — the agent is now misled by the API.

**Apply refactorings:** Encapsulate Variable, Split Variable, Slide Statements, Extract Function, Separate Query from Modifier, Remove Setting Method, Replace Derived Variable with Query, Combine Functions into Class, Combine Functions into Transform, Change Reference to Value
