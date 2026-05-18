---
name: extract-class
description: Apply Extract Class when you see Data Clumps, Temporary Field, Large Class, Primitive Obsession. Each class has one purpose; the agent loads a small focused file to reason about any single concept.
---

# Apply: 39 — Extract Class

**Target state:** Each class has one purpose; the agent loads a small focused file to reason about any single concept.

**Why apply it:** Smaller focused units; the agent tests one concept at a time and reasons about each class as a coherent whole.

**Tradeoff:** Extracting too eagerly — 1-2 fields with no behavior — adds a class file the agent must load with no encapsulation gain.

```js
// Avoid:
class Person {
  name;
  officeAreaCode;
  officeNumber;
  telephoneNumber() { return `(${this.officeAreaCode}) ${this.officeNumber}`; }
}

// Prefer:
class Phone {
  areaCode;
  number;
  toString() { return `(${this.areaCode}) ${this.number}`; }
}
class Person { name; phone; }
```

**Removes smells:** Data Clumps, Temporary Field, Large Class, Primitive Obsession
