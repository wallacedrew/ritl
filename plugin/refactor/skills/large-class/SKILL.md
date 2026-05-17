---
name: large-class
description: Refuse Large Class when a class file with so many fields and methods that the agent cannot load it as a coherent unit; multiple unrelated responsibilities sit under one name. Apply Extract Class, Extract Superclass.
---

# Refuse: 20 — Large Class

**Trigger (refuse when you see):** A class file with so many fields and methods that the agent cannot load it as a coherent unit; multiple unrelated responsibilities sit under one name.

**Cost of leaving it in:** Cognitive context inflates with every irrelevant member; the agent reading any single method must skim past unrelated fields and helpers to find what it needs.

**Target shape after refactoring:** Each class has one cohesive purpose; the agent loads a small focused file to reason about any single behavior.

```js
// Smellier:
class Order {
  // lineItems, totals, customer info, shipping address, audit log, ...
}

// Fresher:
class Order    { /* lineItems, totals */ }
class Customer { /* name, email */ }
class Shipping { /* address, track */ }
```

**Apply refactorings:** Extract Class, Extract Superclass, Replace Type Code with Subclasses
