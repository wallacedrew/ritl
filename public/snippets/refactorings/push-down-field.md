---
name: push-down-field
description: Apply Push Down Field when you see Refused Bequest, Large Class. The field lives on the subclass that uses it; the agent's reasoning about the parent matches what most instances actually carry.
---

# Apply: 64 — Push Down Field

**Symptom:** A field on the parent class used by only one subclass; the agent reading the parent's shape sees storage that doesn't apply to most instances.

**Goal:** The field lives on the subclass that uses it; the agent's reasoning about the parent matches what most instances actually carry.

```js
// Avoid:
class Employee {
  quota; // only Salesperson uses this
}

// Prefer:
class Employee {}
class Salesperson extends Employee { quota; }
```

**Pressure:** The parent's storage carries dead weight; serialization includes ignored fields; the agent's reasoning about the parent's shape is muddied.

**Tradeoff:** If the parent occasionally consults the field for type checks, pushing it down forces awkward downcasts the agent must add and verify at every consumer.

**Relief:** Other subclasses no longer carry ignored storage; the parent's surface shrinks; the agent reasons about each subclass's shape accurately.

**Trap:** Pushing down fields the parent occasionally consults for dispatch forces downcasts the agent must add at every consumer.

**Removes smells:** Refused Bequest, Large Class
