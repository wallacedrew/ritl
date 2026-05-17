---
name: primitive-obsession
description: Refuse Primitive Obsession when function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing. Apply Replace Primitive with Object, Replace Type Code with Subclasses.
---

# Refuse: 11 — Primitive Obsession

**Trigger (refuse when you see):** Function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing.

**Cost of leaving it in:** The agent must inspect call-site context (variable names, surrounding code) to verify a primitive is the right kind; validation and formatting logic scatters across consumers.

**Target shape after refactoring:** Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot mistakes before runtime.

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

**Apply refactorings:** Replace Primitive with Object, Replace Type Code with Subclasses, Replace Conditional with Polymorphism, Extract Class, Introduce Parameter Object
