---
name: move-field
description: Apply Move Field when you see Shotgun Surgery, Insider Trading. Each field belongs to the class that owns its lifecycle; cross-class reaching disappears.
---

# Apply: 13 — Move Field

**Target state:** Each field belongs to the class that owns its lifecycle; cross-class reaching disappears.

**Why apply it:** Class boundaries align with data ownership; mutations are local; refactoring becomes safer.

**Tradeoff:** Every reader of the original class now reaches across the new class boundary — coupling drops at the field's new home but reappears at each consumer.

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
