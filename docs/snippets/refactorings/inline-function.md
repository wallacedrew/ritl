---
name: inline-function
description: Apply Inline Function when you see Lazy Element, Speculative Generality. Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening.
---

# Apply: 02 — Inline Function

**Announce first:** name the smell you see and that you're applying Inline Function before any edit. The user reads the announcement as your contract.

**Symptom:** A function whose body the agent must trace through only to find no decisions or transformations — every reference site pays a context-load hop for no reasoning gain.

**Goal:** Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening.

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

**Pressure:** The agent loads the wrapper definition to verify any change touching it; the indirection is a tax on every reasoning step.

**Tradeoff:** Inlining scatters the wrapper's body across call sites; if the wrapper was a seam (mocking boundary, extension point), removing it forecloses options the agent might need later.

**Relief:** Shorter call chains; the agent loads one fewer definition per reasoning step.

**Trap:** Mechanically inlining every short function — including ones that name a real domain concept — collapses semantic anchors the agent uses to reason about behavior.

**Removes smells:** Lazy Element, Speculative Generality
