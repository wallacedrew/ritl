---
name: message-chains
description: Refuse Message Chains when long dotted access paths; a.b.c.d.e — every callsite walks the entire object graph. Apply Hide Delegate, Extract Function.
---

# Refuse: 17 — Message Chains

**Trigger (refuse when you see):** Long dotted access paths: a.b.c.d.e — every callsite walks the entire object graph.

**Cost of leaving it in:** Every link in the chain is a coupling point; renaming any intermediate field breaks every consumer.

**Target shape after refactoring:** Callers ask the closest object for what they want; the object delegates internally.

```js
// Smellier:
const street = order.customer.address.street;

// Fresher:
const street = order.customerStreet();
```

**Apply refactorings:** Hide Delegate, Extract Function, Move Function
