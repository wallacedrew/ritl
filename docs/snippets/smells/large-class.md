---
name: large-class
description: Refuse Large Class when a class file with so many fields and methods that the agent cannot load it as a coherent unit; multiple unrelated responsibilities sit under one name. Apply Extract Class, Extract Superclass.
---

# Refuse: 20 — Large Class

**Symptom:** A class file with so many fields and methods that the agent cannot load it as a coherent unit; multiple unrelated responsibilities sit under one name.

**Goal:** Each class has one cohesive purpose; the agent loads a small focused file to reason about any single behavior.

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

**Pressure:** Cognitive context inflates with every irrelevant member; the agent reading any single method must skim past unrelated fields and helpers to find what it needs.

**Tradeoff:** Splitting creates new collaborator relationships the agent must trace across files; what was one load now becomes N loads and the agent must understand how the pieces interact.

**Relief:** Smaller, focused units; the agent's reasoning context per method is tight; tests target one concern at a time.

**Trap:** Splitting on superficial groupings produces fragments that don't cohere on their own — the agent now navigates several files to understand what was previously one coherent (if large) concept.

**Apply refactorings:** Extract Class, Extract Superclass, Replace Type Code with Subclasses
