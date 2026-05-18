---
name: push-down-method
description: Apply Push Down Method when you see Refused Bequest, Large Class. The method lives on the subclass that uses it; the agent's reasoning about the parent's surface is accurate to what most instances support.
---

# Apply: 34 — Push Down Method

**Symptom:** A method on the parent class used by only one subclass; the agent reading the parent's surface sees methods that don't apply to most instances.

**Goal:** The method lives on the subclass that uses it; the agent's reasoning about the parent's surface is accurate to what most instances support.

```js
// Avoid:
class Employee {
  quota() { /* used only by Salesperson */ }
}

// Prefer:
class Salesperson extends Employee {
  quota() { /* ... */ }
}
```

**Pressure:** The parent's interface is muddied with subclass-specific methods; the agent can't tell which methods apply to which subclass without inspecting usage.

**Tradeoff:** If the parent occasionally consults the method for type checks or polymorphic dispatch, pushing it down forces awkward downcasts at every consumer the agent must verify.

**Relief:** The parent's surface shrinks; subclasses that don't need the method aren't burdened; the agent reasons about each subclass's contract accurately.

**Trap:** Pushing down methods the parent occasionally needs for dispatch forces downcasts at every consumer the agent must add and verify.

**Removes smells:** Refused Bequest, Large Class
