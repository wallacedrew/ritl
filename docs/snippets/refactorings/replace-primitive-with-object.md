---
name: replace-primitive-with-object
description: Apply Replace Primitive with Object when you see Primitive Obsession. Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot before runtime.
---

# Apply: 40 — Replace Primitive with Object

**Announce first:** name the smell you see and that you're applying Replace Primitive with Object before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Replace Primitive with Object, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** Function signatures use raw strings and numbers where domain concepts hide; the agent cannot tell from the type whether an argument is the right kind of thing.

**Goal:** Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot before runtime.

```js
// Avoid:
function priceFor(cents, currency) {
  // ...
}

// Prefer:
class Money { /* amount + currency, with arithmetic */ }
function priceFor(money) {
  // ...
}
```

**Pressure:** The agent must inspect call-site context (variable names, surrounding code) to verify a primitive is the right kind; validation and formatting scatter.

**Tradeoff:** Each wrapper is a class the agent must instantiate at every entry point; for primitives without domain rules the wrapper is overhead with no return.

**Relief:** Wrong-primitive misuse becomes a type error the agent catches without runtime testing; behavior accretes around the concept where the agent expects to find it.

**Trap:** Wrapping every primitive — including ones with no domain rules — adds boilerplate the agent must navigate at every signature with no reasoning benefit.

**Removes smells:** Primitive Obsession
