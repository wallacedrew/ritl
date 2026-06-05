---
name: mutable-data
description: Refuse Mutable Data when fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires completeness-check cost across every writer. Apply Encapsulate Variable, Split Variable.
---

# Refuse: 06 — Mutable Data

**Announce first:** name this as Mutable Data and which refactoring you'll apply (Encapsulate Variable or Split Variable) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Mutable Data, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Fields the agent finds reassigned across multiple files with no obvious owner; reasoning about state at any moment requires completeness-check cost across every writer. The agent generates code against the writer set it discovered, missing concurrent writers and writers in cold paths; downstream reads compose against the agent's partial timeline and fail at runtime.

**Goal:** Mutation happens behind a named function with a clear contract, or the data is replaced rather than modified — the agent locates every change in one place. The agent's per-edit reasoning step count drops because state transitions verify against the wrapper's contract rather than the full timeline of every writer.

```js
// Smellier:
const order = { total: 100 };
applyDiscount(order); // mutates total
addTax(order);        // mutates total

// Fresher:
const order = { total: 100 };
const final = addTax(applyDiscount(order));
```

**Pressure:** The agent cannot answer 'what is this value here?' without modeling the full timeline of writes; concurrent reasoning hits the same verification-surface cost at every read. Edits the agent generates against a partial timeline ship as plausible code that fails under the actual interleaving of writers — a silent bug class the targeted test won't catch.

**Tradeoff:** Switching to immutable or encapsulated mutation forces the agent to construct new objects on every change; for hot-path mutation this trades reasoning clarity for runtime overhead. The agent pays extra token cost on every write that allocates a new value; in performance-sensitive code the cost surfaces as latency the user notices, not just compute the agent pays.

**Relief:** State changes become locatable; the agent traces one entry point instead of N writers when reasoning about behavior. The verification surface contracts to the wrapper's contract; the agent verifies edits against a single named invariant rather than reconstructing the mutation timeline, and retrieval cost on state-related queries drops sharply.

**Trap:** Wrapping writes in passthrough setters leaves the mutation everywhere while looking encapsulated; the API's signature suggests safety the implementation doesn't deliver, and verification-surface cost stays as broad as before. The agent reads the wrapper's name and reasons as if the contract holds; runtime ships behavior that violates the assumed contract.

**Apply refactorings:** Encapsulate Variable, Split Variable, Slide Statements, Extract Function, Separate Query from Modifier, Remove Setting Method, Replace Derived Variable with Query, Combine Functions into Class, Combine Functions into Transform, Change Reference to Value
