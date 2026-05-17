---
name: inline-variable
description: Apply Inline Variable when you see Lazy Element. Single-use variables that just rename their right-hand side disappear; the expression speaks for itself.
---

# Apply: 04 — Inline Variable

**Target state:** Single-use variables that just rename their right-hand side disappear; the expression speaks for itself.

**Why apply it:** Less local clutter, fewer redundant names, smaller scopes to track.

**Tradeoff:** Inlining a name that did carry domain meaning costs readability — only inline when the expression is already self-explanatory.

```js
// Avoid:
const basePrice = order.basePrice;
return basePrice > 1000;

// Prefer:
return order.basePrice > 1000;
```

**Removes smells:** Lazy Element
