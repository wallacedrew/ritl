---
name: move-field
description: Apply Move Field when you see Shotgun Surgery, Insider Trading. Each field lives where its lifecycle is owned; the agent loads one class to reason about both the field and its determining data.
---

# Apply: 13 — Move Field

**Target state:** Each field lives where its lifecycle is owned; the agent loads one class to reason about both the field and its determining data.

**Why apply it:** Class boundaries align with data ownership; the agent reasons about mutations locally; refactoring becomes safer because the field's true owner is visible.

**Tradeoff:** Every reader of the original class now reaches across the new boundary; coupling drops at the field's new home but reappears at each consumer the agent must follow.

```js
// Avoid:
class Customer {
  plan;
  discountRate;
}
// every customer in a given plan gets the same rate:
customers.forEach(c => c.discountRate = c.plan.kind === 'gold' ? 0.15 : 0.05);

// Prefer:
class Plan {
  kind;
  discountRate;
}
class Customer { plan; }
customer.plan.discountRate;
```

**Removes smells:** Shotgun Surgery, Insider Trading
