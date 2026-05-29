---
name: push-down-method
description: Apply Push Down Method when you see Refused Bequest, Large Class. The method lives on the subclass that uses it; reading the parent's interface returns only the methods every instance supports, dropping the irrelevant declaration from the agent's window.
---

# Apply: 34 — Push Down Method

**Symptom:** A method declared on the parent that only one subclass overrides or invokes; the parent's interface includes a method that does not apply to most instances the agent reasons about.

**Goal:** The method lives on the subclass that uses it; reading the parent's interface returns only the methods every instance supports, dropping the irrelevant declaration from the agent's window.

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

**Relief:** The parent's interface shrinks by one method; queries about any subclass's behavior load fewer irrelevant declarations into the window, and code generated against the parent's interface no longer references a method most instances do not support.

**Trap:** Pushing down a method that callers reach through a parent-typed reference forces every such call site to downcast first; each downcast is a runtime type check the agent's generated code has to handle at every consumer.

**Removes smells:** Refused Bequest, Large Class
