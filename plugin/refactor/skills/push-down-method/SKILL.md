---
name: push-down-method
description: Apply Push Down Method when you see Refused Bequest, Large Class. The method lives on the subclass that uses it; the agent's reasoning about the parent's surface is accurate to what most instances support.
---

# Apply: 34 — Push Down Method

**Target state:** The method lives on the subclass that uses it; the agent's reasoning about the parent's surface is accurate to what most instances support.

**Why apply it:** The parent's surface shrinks; subclasses that don't need the method aren't burdened; the agent reasons about each subclass's contract accurately.

**Tradeoff:** If the parent occasionally consults the method for type checks or polymorphic dispatch, pushing it down forces awkward downcasts at every consumer the agent must verify.

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

**Removes smells:** Refused Bequest, Large Class
