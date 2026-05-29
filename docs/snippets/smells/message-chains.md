---
name: message-chains
description: Refuse Message Chains when long dotted access paths the agent must trace through several object hops to understand any single read; renaming any intermediate field breaks every caller silently. Apply Hide Delegate, Extract Function.
---

# Refuse: 17 — Message Chains

**Symptom:** Long dotted access paths the agent must trace through several object hops to understand any single read; renaming any intermediate field breaks every caller silently.

**Goal:** Callers ask the closest object for what they want; the agent reads one method signature instead of walking N link types to predict what the chain produces.

```js
// Smellier:
const street = order.customer.address.street;

// Fresher:
const street = order.customerStreet();
```

**Pressure:** Every link in the chain is a coupling point the agent must hold in working memory; refactoring any intermediate shape requires the agent to find and update every chained access.

**Tradeoff:** Adding passthrough methods on the host class grows its surface; for chains used in one place the passthrough is overhead the agent now maintains in two places.

**Relief:** Encapsulation tightens; intermediate objects can change shape without breaking callers; the agent reasoning about a caller doesn't load every link in the chain.

**Trap:** Wrapping every dotted chain in passthroughs migrates the smell from call sites into the host class's surface — the agent now reads a wall of delegation methods to find any real behavior.

**Apply refactorings:** Hide Delegate, Extract Function, Move Function
