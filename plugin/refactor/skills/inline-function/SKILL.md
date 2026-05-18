---
name: inline-function
description: Apply Inline Function when you see Lazy Element, Speculative Generality. Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening.
---

# Apply: 02 — Inline Function

**Target state:** Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening.

**Why apply it:** Shorter call chains; the agent loads one fewer definition per reasoning step.

**Tradeoff:** Inlining scatters the wrapper's body across call sites; if the wrapper was a seam (mocking boundary, extension point), removing it forecloses options the agent might need later.

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
