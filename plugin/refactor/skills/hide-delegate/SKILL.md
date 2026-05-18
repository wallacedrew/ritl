---
name: hide-delegate
description: Apply Hide Delegate when you see Message Chains. Callers ask the closest object directly; the agent reasons about one boundary instead of traversing N.
---

# Apply: 41 — Hide Delegate

**Symptom:** The agent finds long dotted access paths through several object hops; renaming any intermediate field silently breaks every caller.

**Goal:** Callers ask the closest object directly; the agent reasons about one boundary instead of traversing N.

```js
// Avoid:
const street = order.customer.address.street;

// Prefer:
// inside Order: customerStreet() { return this.customer.address.street; }
const street = order.customerStreet();
```

**Pressure:** Every link in the chain is a coupling point the agent holds in working memory; refactoring any intermediate shape requires updating every chain access.

**Tradeoff:** Each hidden delegate adds a passthrough method on the host; for chains used in one place the passthrough is overhead the agent now maintains in two places.

**Relief:** Encapsulation tightens; the agent reasons about one boundary; intermediate objects can change shape without breaking callers.

**Trap:** Wrapping every dotted chain in passthroughs migrates the chain from call sites into the host's surface — the agent now wades through a wall of delegations to find real behavior.

**Removes smells:** Message Chains
