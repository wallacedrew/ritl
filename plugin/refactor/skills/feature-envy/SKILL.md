---
name: feature-envy
description: Refuse Feature Envy when a method's body references foreign-class data more than its own; the agent loading this method must also load the foreign class to verify any change. Apply Move Function, Extract Function.
---

# Refuse: 09 — Feature Envy

**Symptom:** A method's body references foreign-class data more than its own; the agent loading this method must also load the foreign class to verify any change.

**Goal:** Method bodies stay close to the data they read — the agent loads one class to reason about one behavior.

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

**Pressure:** Each call to the envious method pulls a second class into the agent's working context; chained reasoning across the boundary compounds the load.

**Tradeoff:** Moving the method may force additional cross-class dependencies the original boundary hid; the agent verifying the move must trace the new coupling at the destination class.

**Relief:** The method's data sits inside the agent's current reasoning context; verifying behavior touches one class instead of two.

**Trap:** Mechanical move-the-method-to-the-data on every cross-class read creates a fan-out the agent must follow at every call site — the cure becomes a worse smell than the original.

**Apply refactorings:** Move Function, Extract Function
