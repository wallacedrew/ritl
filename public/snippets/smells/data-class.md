---
name: data-class
description: Refuse Data Class when a class whose surface is only getters and setters; all real behavior lives in consumers, scattered across files the agent must locate to reason about anything domain-meaningful. Apply Encapsulate Record, Remove Setting Method.
---

# Refuse: 22 — Data Class

**Trigger (refuse when you see):** A class whose surface is only getters and setters; all real behavior lives in consumers, scattered across files the agent must locate to reason about anything domain-meaningful.

**Cost of leaving it in:** Domain logic scatters across consumers; the agent must search the codebase to find any operation; class invariants aren't enforced so the agent must defensively check them at every consumer.

**Target shape after refactoring:** Behavior that belongs with the data lives on the class; the agent loading the class finds the operations and invariants it expects, in one place.

```js
// Smellier:
class Address { street; city; zip; }
function format(a) {
  return `${a.street}, ${a.city} ${a.zip}`;
}

// Fresher:
class Address {
  format() {
    return `${this.street}, ${this.city} ${this.zip}`;
  }
}
```

**Apply refactorings:** Encapsulate Record, Remove Setting Method, Move Function, Extract Function, Split Phase
