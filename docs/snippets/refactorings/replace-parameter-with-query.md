---
name: replace-parameter-with-query
description: Apply Replace Parameter with Query when you see Long Parameter List. The function computes its own answer; the agent calls it without pre-computing the inputs.
---

# Apply: 31 — Replace Parameter with Query

**Target state:** The function computes its own answer; the agent calls it without pre-computing the inputs.

**Why apply it:** Signatures shrink; the agent calls the function directly without reproducing caller-side derivations.

**Tradeoff:** If the query is expensive or has side effects, replacing the parameter multiplies cost or introduces hidden coupling the agent must reason about.

```js
// Avoid:
const basePrice = order.qty * order.itemPrice;
const level = discountLevel(order);
const final = discounted(order, basePrice, level);

// Prefer:
const final = discounted(order); // computes basePrice and level itself
```

**Removes smells:** Long Parameter List
