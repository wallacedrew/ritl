---
name: inline-function
description: Apply Inline Function when you see Lazy Element, Speculative Generality. Trivial wrappers vanish; the call site reads as exactly what's happening.
---

# Apply: 02 — Inline Function

**Target state:** Trivial wrappers vanish; the call site reads as exactly what's happening.

**Why apply it:** One fewer indirection to follow when reading; smaller surface to maintain.

**Tradeoff:** If the function had a meaningful name covering several call sites, inlining can scatter the intent — only inline when the body is as clear as the wrapper.

```js
// Avoid:
function moreThanFive(n) {
  return n > 5;
}
function rating(driver) {
  return moreThanFive(driver.numberOfLateDeliveries) ? 2 : 1;
}

// Prefer:
function rating(driver) {
  return driver.numberOfLateDeliveries > 5 ? 2 : 1;
}
```

**Removes smells:** Lazy Element, Speculative Generality
