---
name: hide-delegate
description: Apply Hide Delegate when you see Message Chains. Callers ask the closest object for what they want; the object delegates internally without exposing its collaborators.
---

# Apply: 41 — Hide Delegate

**Target state:** Callers ask the closest object for what they want; the object delegates internally without exposing its collaborators.

**Why apply it:** Encapsulation tightens; intermediate objects can change shape without breaking callers.

**Pitfall:** Adds a passthrough method on the parent for every delegated operation — only worth it for operations that are repeated across consumers.

```js
// Avoid:
const street = order.customer.address.street;

// Prefer:
// inside Order: customerStreet() { return this.customer.address.street; }
const street = order.customerStreet();
```

**Removes smells:** Message Chains
