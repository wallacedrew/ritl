### Apply: 31 — Replace Parameter with Query

**Target state:** When a function can compute its own answer from already-available state, callers don't have to pre-compute it.

**Why apply it:** Signatures shrink; consumers stop doing the function's homework.

**Pitfall:** If the query has side effects or is expensive, passing the value is genuinely better — only replace when the query is pure and cheap.

```js
// Avoid:
const basePrice = order.qty * order.itemPrice;
const level = discountLevel(order);
const final = discounted(order, basePrice, level);

// Prefer:
const final = discounted(order); // computes basePrice and level itself
```

**Removes smells:** Long Parameter List
