---
name: inline-variable
description: Apply Inline Variable when you see Lazy Element. Single-use variables that rename without semantic gain disappear; expressions speak for themselves.
---

# Apply: 04 — Inline Variable

**Target state:** Single-use variables that rename without semantic gain disappear; expressions speak for themselves.

**Why apply it:** Less local clutter in the agent's scope table; expressions read as themselves.

**Tradeoff:** Inlining a variable that did carry domain meaning forces the agent to interpret the bare expression every time instead of reading the named concept.

```js
// Avoid:
const basePrice = order.basePrice;
return basePrice > 1000;

// Prefer:
return order.basePrice > 1000;
```

**Removes smells:** Lazy Element
