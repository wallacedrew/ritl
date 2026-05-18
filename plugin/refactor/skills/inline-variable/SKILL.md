---
name: inline-variable
description: Apply Inline Variable when you see Lazy Element. Single-use variables that rename without semantic gain disappear; expressions speak for themselves.
---

# Apply: 04 — Inline Variable

**Symptom:** A local variable whose value is the same as its right-hand expression and whose name adds no semantic information beyond the expression itself.

**Goal:** Single-use variables that rename without semantic gain disappear; expressions speak for themselves.

```js
// Avoid:
const basePrice = order.basePrice;
return basePrice > 1000;

// Prefer:
return order.basePrice > 1000;
```

**Pressure:** The agent tracks an extra name in scope for no reasoning benefit; reference resolution becomes a tiny hop to a definition that adds nothing.

**Tradeoff:** Inlining a variable that did carry domain meaning forces the agent to interpret the bare expression every time instead of reading the named concept.

**Relief:** Less local clutter in the agent's scope table; expressions read as themselves.

**Trap:** Inlining variables that named non-obvious intermediate values forces the agent to repeatedly parse the same expression across every reference site.

**Removes smells:** Lazy Element
