---
name: message-chains
description: Refuse Message Chains when long dotted access paths the agent must trace through several object hops to understand any single read; renaming any intermediate field breaks every caller silently. Apply Hide Delegate, Extract Function.
---

# Refuse: 17 — Message Chains

**Trigger (refuse when you see):** Long dotted access paths the agent must trace through several object hops to understand any single read; renaming any intermediate field breaks every caller silently.

**Cost of leaving it in:** Every link in the chain is a coupling point the agent must hold in working memory; refactoring any intermediate shape requires the agent to find and update every chained access.

**Target shape after refactoring:** Callers ask the closest object for what they want; the agent reasons about one boundary instead of traversing N.

```js
// Smellier:
const street = order.customer.address.street;

// Fresher:
const street = order.customerStreet();
```

**Apply refactorings:** Hide Delegate, Extract Function, Move Function
