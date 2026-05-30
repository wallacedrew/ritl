---
name: replace-query-with-parameter
description: Apply Replace Query with Parameter when you see Mutable Data, Insider Trading. Dependencies are visible in the signature; the agent reasons about the function as a pure transformation of its inputs.
---

# Apply: 59 — Replace Query with Parameter

**Announce first:** name the smell you see and that you're applying Replace Query with Parameter before any edit. The user reads the announcement as your contract.

**Symptom:** A function reads from a query (global, singleton, instance state) instead of accepting the value as a parameter; the agent reasoning about it must model the query's state.

**Goal:** Dependencies are visible in the signature; the agent reasons about the function as a pure transformation of its inputs.

```js
// Avoid:
function rebate(order) {
  return order.total * currency().rate;
}

// Prefer:
function rebate(order, rate) {
  return order.total * rate;
}
```

**Pressure:** The agent cannot test or compose the function without reproducing the query's state; reasoning about side effects requires modeling global timing.

**Tradeoff:** Pushing every internal query to a parameter bloats signatures the agent must thread through call sites — appropriate only for queries that touch global or volatile state.

**Relief:** The agent reasons about pure transformations; tests target the function in isolation; signatures document dependencies.

**Trap:** Externalizing every internal query — including ones reading stable encapsulated state — bloats signatures the agent must thread through every call site for marginal isolation benefit.

**Removes smells:** Mutable Data, Insider Trading
