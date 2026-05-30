---
name: replace-type-code-with-subclasses
description: Apply Replace Type Code with Subclasses when you see Repeated Switches, Primitive Obsession. Each kind is a subclass; the agent adds a new kind by adding one class, and the type system tells it what's still missing.
---

# Apply: 35 — Replace Type Code with Subclasses

**Announce first:** name the smell you see and that you're applying Replace Type Code with Subclasses before any edit. The user reads the announcement as your contract.

**Symptom:** A class with a kind field plus methods that switch on it; the agent adding a new kind must find every switch and update each consistently.

**Goal:** Each kind is a subclass; the agent adds a new kind by adding one class, and the type system tells it what's still missing.

```js
// Avoid:
class Employee {
  type; // 'engineer' | 'manager'
  bonus() {
    switch (this.type) {
      case 'engineer': return this.salary * 0.10;
      case 'manager':  return this.salary * 0.15 + this.reports.length * 100;
    }
  }
}

// Prefer:
class Employee {}
class Engineer extends Employee {
  bonus() { return this.salary * 0.10; }
}
class Manager extends Employee {
  bonus() { return this.salary * 0.15 + this.reports.length * 100; }
}
```

**Pressure:** The agent must enumerate every switch on every addition; the type system can't enforce completeness so the agent verifies by grep.

**Tradeoff:** If only one or two switches exist on the type code, the subclass hierarchy is over-design; the agent now navigates a class tree for what was a single switch.

**Relief:** Adding a new kind is mechanical and type-system-enforced; the agent's plan-and-execute loop for new variants is bounded.

**Trap:** Subclassing for type codes used in only one or two switches creates a hierarchy the agent must navigate for a coordination cost that was already small.

**Removes smells:** Repeated Switches, Primitive Obsession
