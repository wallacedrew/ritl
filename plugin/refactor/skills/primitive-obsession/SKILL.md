---
name: primitive-obsession
description: Refuse Primitive Obsession when function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing. Apply Replace Primitive with Object, Replace Type Code with Subclasses.
---

# Refuse: 11 — Primitive Obsession

**Announce first:** name this as Primitive Obsession and which refactoring you'll apply (Replace Primitive with Object or Replace Type Code with Subclasses) before any edit. The user reads the announcement as your contract.

**Symptom:** Function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing.

**Goal:** Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot mistakes before runtime.

```js
// Smellier:
function priceFor(cents, currency) {
  // ...
}

// Fresher:
class Money { /* amount + currency, with arithmetic */ }
function priceFor(money) {
  // ...
}
```

**Pressure:** The agent must inspect call-site context (variable names, surrounding code) to verify a primitive is the right kind; validation and formatting logic scatters across consumers.

**Tradeoff:** Each wrapper is a class the agent must load and instantiate; for primitives used in only one place, the wrapper is more code than the original concern warranted.

**Relief:** Wrong-primitive misuse becomes a type error the agent catches without runtime testing; behavior and rules accrete around the concept where the agent expects to find them.

**Trap:** Wrapping every primitive — including ones with no domain rules or behavior — adds boilerplate the agent must navigate at every signature with no reasoning benefit.

**Apply refactorings:** Replace Primitive with Object, Replace Type Code with Subclasses, Replace Conditional with Polymorphism, Extract Class, Introduce Parameter Object
