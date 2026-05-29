---
name: extract-variable
description: Apply Extract Variable when you see Mysterious Name, Comments. Intermediate values carry domain names; subsequent reads resolve to one token of name instead of re-evaluating the expression at every use.
---

# Apply: 03 — Extract Variable

**Symptom:** An expression complex enough that the agent must parse it sub-step by sub-step to interpret; subsequent reasoning about the value requires re-parsing the full expression.

**Goal:** Intermediate values carry domain names; subsequent reads resolve to one token of name instead of re-evaluating the expression at every use.

```js
// Avoid:
if (order.qty * order.price - Math.max(0, order.qty - 500) * order.price * 0.05 > 1000) { /* ... */ }

// Prefer:
const basePrice    = order.qty * order.price;
const bulkDiscount = Math.max(0, order.qty - 500) * order.price * 0.05;
if (basePrice - bulkDiscount > 1000) { /* ... */ }
```

**Pressure:** The agent re-parses complex expressions at every reference; debugging requires the agent to mentally evaluate the full subexpression chain.

**Tradeoff:** Each extracted variable is a name in the agent's local scope; over-extraction creates scope clutter the agent must navigate to find what's actually relevant.

**Relief:** Subsequent reads of the value pay one token of name instead of re-evaluating the expression at every use; the binding's definition site is the only place the expression appears.

**Trap:** Extracting every sub-expression — including ones already obvious — bloats the agent's scope table with names that document nothing the agent didn't already know.

**Removes smells:** Mysterious Name, Comments
