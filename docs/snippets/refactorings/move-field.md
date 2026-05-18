---
name: move-field
description: Apply Move Field when you see Shotgun Surgery, Insider Trading. Each field lives where its lifecycle is owned; the agent loads one class to reason about both the field and its determining data.
---

# Apply: 13 — Move Field

**Symptom:** The agent finds a field on class A whose value is determined by data on class B; reasoning about the field's value requires loading B to verify the derivation.

**Goal:** Each field lives where its lifecycle is owned; the agent loads one class to reason about both the field and its determining data.

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

**Pressure:** Every consumer must maintain the cross-class invariant; the agent verifying any change must coordinate updates across both classes.

**Tradeoff:** Every reader of the original class now reaches across the new boundary; coupling drops at the field's new home but reappears at each consumer the agent must follow.

**Relief:** Class boundaries align with data ownership; the agent reasons about mutations locally; refactoring becomes safer because the field's true owner is visible.

**Trap:** Moving fields purely on derivation grounds — without checking whether the original class's identity depends on the field's presence — breaks consumer expectations the agent didn't model.

**Removes smells:** Shotgun Surgery, Insider Trading
