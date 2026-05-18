---
name: push-down-field
description: Apply Push Down Field when you see Refused Bequest, Large Class. The field lives on the subclass that uses it; the agent's reasoning about the parent matches what most instances actually carry.
---

# Apply: 64 — Push Down Field

**Target state:** The field lives on the subclass that uses it; the agent's reasoning about the parent matches what most instances actually carry.

**Why apply it:** Other subclasses no longer carry ignored storage; the parent's surface shrinks; the agent reasons about each subclass's shape accurately.

**Tradeoff:** If the parent occasionally consults the field for type checks, pushing it down forces awkward downcasts the agent must add and verify at every consumer.

```js
// Avoid:
class Employee {
  quota; // only Salesperson uses this
}

// Prefer:
class Employee {}
class Salesperson extends Employee { quota; }
```

**Removes smells:** Refused Bequest, Large Class
