---
name: replace-primitive-with-object
description: Apply Replace Primitive with Object when you see Primitive Obsession. Each domain concept has a small typed home — Money, PhoneNumber, OrderId — that knows its rules.
---

# Apply: 40 — Replace Primitive with Object

**Target state:** Each domain concept has a small typed home — Money, PhoneNumber, OrderId — that knows its rules.

**Why apply it:** Misuse becomes a type error; behavior accretes around the concept; refactoring is local to the wrapper.

**Tradeoff:** Wrapping every primitive is overkill — wrap when the concept needs validation, formatting, or domain-specific behavior beyond what the primitive offers.

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
