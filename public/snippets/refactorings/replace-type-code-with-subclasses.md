---
name: replace-type-code-with-subclasses
description: Apply Replace Type Code with Subclasses when you see Repeated Switches, Primitive Obsession. Each kind is a subclass; the agent adds a new kind by adding one class, and the type system tells it what's still missing.
---

# Apply: 35 — Replace Type Code with Subclasses

**Target state:** Each kind is a subclass; the agent adds a new kind by adding one class, and the type system tells it what's still missing.

**Why apply it:** Adding a new kind is mechanical and type-system-enforced; the agent's plan-and-execute loop for new variants is bounded.

**Tradeoff:** If only one or two switches exist on the type code, the subclass hierarchy is over-design; the agent now navigates a class tree for what was a single switch.

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

**Removes smells:** Repeated Switches, Primitive Obsession
