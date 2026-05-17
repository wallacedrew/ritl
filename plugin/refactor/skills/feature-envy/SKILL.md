---
name: feature-envy
description: Refuse Feature Envy when a method's body references foreign-class data more than its own; the agent loading this method must also load the foreign class to verify any change. Apply Move Function, Extract Function.
---

# Refuse: 09 — Feature Envy

**Trigger (refuse when you see):** A method's body references foreign-class data more than its own; the agent loading this method must also load the foreign class to verify any change.

**Cost of leaving it in:** Each call to the envious method pulls a second class into the agent's working context; chained reasoning across the boundary compounds the load.

**Target shape after refactoring:** Method bodies stay close to the data they read — the agent loads one class to reason about one behavior.

```js
// Smellier:
class Order {
  totalWeight() {
    return this.items.reduce((s, i) => s + i.unitWeight * i.qty, 0);
  }
}

// Fresher:
class Item  { weight()      { return this.unitWeight * this.qty; } }
class Order { totalWeight() { return this.items.reduce((s, i) => s + i.weight(), 0); } }
```

**Apply refactorings:** Move Function, Extract Function
