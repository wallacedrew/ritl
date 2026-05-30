---
name: remove-setting-method
description: Apply Remove Setting Method when you see Mutable Data, Data Class. Construction is the only path to setting these fields; the agent reasons about the object as immutable-after-construction.
---

# Apply: 54 — Remove Setting Method

**Announce first:** name the smell you see and that you're applying Remove Setting Method before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Remove Setting Method, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** The agent finds setters on a class whose values should only be set at construction; every late-mutation site is using setters for one-shot assignment.

**Goal:** Construction is the only path to setting these fields; the agent reasons about the object as immutable-after-construction.

```js
// Avoid:
class Person {
  setName(n) { this._name = n; }
}

// Prefer:
class Person {
  constructor(name) { this._name = name; }
  name() { return this._name; }
}
```

**Pressure:** Late mutations break the agent's reasoning about invariants between operations; the agent must trace every setter call to verify timing assumptions.

**Tradeoff:** Removing a setter forces every legitimate update through a more meaningful method; the agent must verify each setter call has a domain action that justifies replacing it.

**Relief:** The agent reasons about the class as immutable-after-construction; bugs from late mutation vanish; the API expresses what users can actually do.

**Trap:** Removing setters that meaningfully encoded a domain state change — like markPaid() coordinating paidAt+status — without replacing them with the equivalent domain method strips the semantic anchor.

**Removes smells:** Mutable Data, Data Class
