---
name: replace-primitive-with-object
description: Apply Replace Primitive with Object when you see Primitive Obsession. Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot before runtime.
---

# Apply: 40 — Replace Primitive with Object

**Target state:** Each domain concept has its own typed wrapper; the agent's type checker catches wrong-primitive-in-wrong-slot before runtime.

**Why apply it:** Wrong-primitive misuse becomes a type error the agent catches without runtime testing; behavior accretes around the concept where the agent expects to find it.

**Tradeoff:** Each wrapper is a class the agent must instantiate at every entry point; for primitives without domain rules the wrapper is overhead with no return.

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

**Removes smells:** Primitive Obsession
