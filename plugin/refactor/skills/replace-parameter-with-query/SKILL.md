---
name: replace-parameter-with-query
description: Apply Replace Parameter with Query when you see Long Parameter List. The function computes its own answer; the agent calls it without pre-computing the inputs.
---

# Apply: 31 — Replace Parameter with Query

**Symptom:** A function takes parameters its callers computed from data the function already has access to; the agent verifying any call must reproduce the caller's computation.

**Goal:** The function computes its own answer; the agent calls it without pre-computing the inputs.

```js
// Avoid:
const basePrice = order.qty * order.itemPrice;
const level = discountLevel(order);
const final = discounted(order, basePrice, level);

// Prefer:
const final = discounted(order); // computes basePrice and level itself
```

**Pressure:** Every caller pays the homework cost; the duplication of derivation logic scatters and the agent must keep callers in sync with the function's expectations.

**Tradeoff:** If the query is expensive or has side effects, replacing the parameter multiplies cost or introduces hidden coupling the agent must reason about.

**Relief:** Signatures shrink; the agent calls the function directly without reproducing caller-side derivations.

**Trap:** Replacing parameters with queries that are expensive or have side effects multiplies cost or introduces hidden coupling the agent reads as 'just a parameter swap'.

**Removes smells:** Long Parameter List
