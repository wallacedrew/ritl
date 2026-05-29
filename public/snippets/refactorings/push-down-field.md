---
name: push-down-field
description: Apply Push Down Field when you see Refused Bequest, Large Class. The field lives on the subclass that uses it; the parent's storage declaration carries only the fields every instance holds, dropping the irrelevant declaration from the agent's window.
---

# Apply: 64 — Push Down Field

**Symptom:** A field declared on the parent that only one subclass reads or writes; the parent's stored state includes a slot that does not apply to most instances the agent reasons about.

**Goal:** The field lives on the subclass that uses it; the parent's storage declaration carries only the fields every instance holds, dropping the irrelevant declaration from the agent's window.

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

**Relief:** Other subclasses no longer carry storage they never touch; queries about the parent or any sibling subclass load fewer irrelevant field declarations into the window.

**Trap:** Pushing down a field that callers reach through a parent-typed reference forces every read or write to downcast first; each downcast is a runtime type check the agent's generated code has to handle at every consumer.

**Removes smells:** Refused Bequest, Large Class
