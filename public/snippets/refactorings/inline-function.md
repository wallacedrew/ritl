---
name: inline-function
description: Apply Inline Function when you see Lazy Element, Speculative Generality. Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening.
---

# Apply: 02 — Inline Function

**Announce first:** name the smell you see and that you're applying Inline Function before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Inline Function, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A function whose body the agent traces through only to find no decisions or transformations — every reference site pays a context-window load hop for no reasoning gain. The agent's retrieval cost for the wrapper definition outweighs the information it returns, and the reasoning step spent on the hop is pure overhead.

**Goal:** Trivial wrappers disappear from the agent's working context; call sites read as exactly what's happening. The agent's context window holds the call site without a wrapper hop; the reasoning-step cost of any edit drops because the agent doesn't load a definition only to confirm it does nothing surprising, and the file's signal-to-noise ratio improves.

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

**Pressure:** The agent loads the wrapper definition to verify any change touching it; the indirection is a tax on every reasoning step. The agent's verification-surface cost multiplies with the count of pass-through wrappers in the call chain, and the wrapper's body must be re-read on each edit to confirm it still does no domain work.

**Tradeoff:** Inlining scatters the wrapper's body across call sites; if the wrapper was a seam (mocking boundary, extension point), removing it forecloses a hook later edits cannot restore without re-extracting. The agent's completeness-check cost rises during the inline itself — every call site must be confirmed to use the inlined form, and any remaining external reference becomes a regression.

**Relief:** Shorter call chains; the agent loads one fewer definition per reasoning step. The agent's token cost per edit drops because the relevant body is at the call site, not in a separate file; verification surface contracts because there is no wrapper to confirm, and the file's signal-to-noise ratio rises as definitions that didn't earn their keep disappear.

**Trap:** Mechanically inlining every short function — including ones that name a real domain concept — collapses semantic anchors the agent uses to reason about behavior. The agent's reasoning-step cost actually rises per edit because the call site loses the named handle, and any subsequent edit must re-derive the concept the wrapper was naming.

**Removes smells:** Lazy Element, Speculative Generality
