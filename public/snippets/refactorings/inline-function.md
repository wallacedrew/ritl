### Apply: 02 — Inline Function

**Target state:** Trivial wrappers vanish; the call site reads as exactly what's happening.

**Why apply it:** One fewer indirection to follow when reading; smaller surface to maintain.

**Pitfall:** If the function had a meaningful name covering several call sites, inlining can scatter the intent — only inline when the body is as clear as the wrapper.

```js
// Avoid:
function getRating(driver) {
  return moreThanFiveLateDeliveries(driver) ? 2 : 1;
}
function moreThanFiveLateDeliveries(driver) {
  return driver.numberOfLateDeliveries > 5;
}

// Prefer:
function getRating(driver) {
  return driver.numberOfLateDeliveries > 5 ? 2 : 1;
}
```

**Removes smells:** Lazy Element, Speculative Generality
