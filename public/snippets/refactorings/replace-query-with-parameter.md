---
name: replace-query-with-parameter
description: Apply Replace Query with Parameter when you see Mutable Data, Insider Trading. Dependencies are visible in the signature; the agent reasons about the function as a pure transformation of its inputs.
---

# Apply: 59 — Replace Query with Parameter

**Target state:** Dependencies are visible in the signature; the agent reasons about the function as a pure transformation of its inputs.

**Why apply it:** The agent reasons about pure transformations; tests target the function in isolation; signatures document dependencies.

**Tradeoff:** Pushing every internal query to a parameter bloats signatures the agent must thread through call sites — appropriate only for queries that touch global or volatile state.

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

**Removes smells:** Mutable Data, Insider Trading
