---
name: extract-class
description: Apply Extract Class when you see Data Clumps, Temporary Field, Large Class, Primitive Obsession. Each class has one purpose; the agent loads a small focused file to reason about any single concept.
---

# Apply: 39 — Extract Class

**Announce first:** name the smell you see and that you're applying Extract Class before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Extract Class, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A class whose surface mixes multiple cohesive sub-concepts; the agent reasoning about any single concept must skim past the others to find what it needs.

**Goal:** Each class has one purpose; the agent loads a small focused file to reason about any single concept.

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

**Pressure:** The agent's reasoning context per method inflates with unrelated members; changes to one concept require reasoning about all of them.

**Tradeoff:** Extracting too eagerly — 1-2 fields with no behavior — adds a class file the agent must load with no encapsulation gain.

**Relief:** Each class holds one responsibility's data and methods; queries about one responsibility load only its file, and the unrelated payload that previously sat in the same window for every read is gone.

**Trap:** Extracting candidate concepts that are just trivial field groups creates class files the agent must navigate without buying any encapsulation gain.

**Removes smells:** Data Clumps, Temporary Field, Large Class, Primitive Obsession
