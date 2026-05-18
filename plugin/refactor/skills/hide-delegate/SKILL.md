---
name: hide-delegate
description: Apply Hide Delegate when you see Message Chains. Callers ask the closest object directly; the agent reasons about one boundary instead of traversing N.
---

# Apply: 41 — Hide Delegate

**Target state:** Callers ask the closest object directly; the agent reasons about one boundary instead of traversing N.

**Why apply it:** Encapsulation tightens; the agent reasons about one boundary; intermediate objects can change shape without breaking callers.

**Tradeoff:** Each hidden delegate adds a passthrough method on the host; for chains used in one place the passthrough is overhead the agent now maintains in two places.

```js
// Avoid:
const street = order.customer.address.street;

// Prefer:
// inside Order: customerStreet() { return this.customer.address.street; }
const street = order.customerStreet();
```

**Removes smells:** Message Chains
