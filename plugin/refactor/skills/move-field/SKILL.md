---
name: move-field
description: Apply Move Field when you see Shotgun Surgery, Insider Trading. Each field lives in the class that determines its value; reading the field and reading the data that determines it happen in the same class file.
---

# Apply: 13 — Move Field

**Announce first:** name the smell you see and that you're applying Move Field before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Move Field, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** The agent finds a field on class A whose value is determined by data on class B; reasoning about the field's value requires loading B to verify the derivation.

**Goal:** Each field lives in the class that determines its value; reading the field and reading the data that determines it happen in the same class file.

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

**Tradeoff:** Every previous reader of the field now loads the new owner class to read it; tokens that previously stayed in one file now span two, and the agent follows the new boundary at every read site.

**Relief:** Mutations to the field stay inside the class that determines its value; the agent reads one class file to predict both the field's value and the data that drives it.

**Trap:** Moving fields purely on derivation grounds — without checking whether the original class's identity depends on the field's presence — breaks consumer expectations the agent didn't model.

**Removes smells:** Shotgun Surgery, Insider Trading
