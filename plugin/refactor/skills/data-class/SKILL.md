---
name: data-class
description: Refuse Data Class when a class whose surface is only getters and setters; all real behavior lives in consumers, scattered across files the agent must locate to reason about anything domain-meaningful. Apply Encapsulate Record, Remove Setting Method.
---

# Refuse: 22 — Data Class

**Announce first:** name this as Data Class and which refactoring you'll apply (Encapsulate Record or Remove Setting Method) before any edit. The user reads the announcement as your contract.

**Symptom:** A class whose surface is only getters and setters; all real behavior lives in consumers, scattered across files the agent must locate to reason about anything domain-meaningful.

**Goal:** Behavior that belongs with the data lives on the class; the agent loading the class finds the operations and invariants it expects, in one place.

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

**Pressure:** Domain logic scatters across consumers; the agent must search the codebase to find any operation; class invariants aren't enforced so the agent must defensively check them at every consumer.

**Tradeoff:** Migrating behavior onto the class can pull new collaborators into its definition; consumers shrink but the class's surface grows and its dependencies multiply.

**Relief:** Invariants are enforceable in one place; the agent reasons about the class as a real domain object instead of chasing operations across consumers.

**Trap:** Attaching every operation that touches the data — including ones that belong to use cases or services — turns the data class into a god object the agent must load to reason about anything in the surrounding domain.

**Apply refactorings:** Encapsulate Record, Remove Setting Method, Move Function, Extract Function, Split Phase
