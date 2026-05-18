---
name: extract-variable
description: Apply Extract Variable when you see Mysterious Name, Comments. Intermediate values have names the agent can reference directly; reasoning about the expression decomposes into reasoning about named sub-values.
---

# Apply: 03 — Extract Variable

**Target state:** Intermediate values have names the agent can reference directly; reasoning about the expression decomposes into reasoning about named sub-values.

**Why apply it:** The agent references named intermediate values; expression-level reasoning becomes reference-level reasoning, which is cheaper.

**Tradeoff:** Each extracted variable is a name in the agent's local scope; over-extraction creates scope clutter the agent must navigate to find what's actually relevant.

```js
// Avoid:
if (order.qty * order.price - Math.max(0, order.qty - 500) * order.price * 0.05 > 1000) { /* ... */ }

// Prefer:
const basePrice    = order.qty * order.price;
const bulkDiscount = Math.max(0, order.qty - 500) * order.price * 0.05;
if (basePrice - bulkDiscount > 1000) { /* ... */ }
```

**Removes smells:** Mysterious Name, Comments
