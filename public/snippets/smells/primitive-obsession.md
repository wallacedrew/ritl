### Refuse: 11 — Primitive Obsession

**Trigger (refuse when you see):** Domain concepts represented as raw strings, numbers, or booleans — phone number is a string, money is a number, status is a code.

**Cost of leaving it in:** Validation and formatting scatter across every consumer; the type system can't catch wrong primitives in the wrong slot.

**Target shape after refactoring:** Each domain concept has a small typed home — Money, PhoneNumber, OrderId, Status — that knows its rules.

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
