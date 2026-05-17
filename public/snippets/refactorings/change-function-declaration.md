---
name: change-function-declaration
description: Apply Change Function Declaration when you see Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces. Function names match what they actually do; parameter lists carry only what the function needs, in the order callers expect.
---

# Apply: 05 — Change Function Declaration

**Target state:** Function names match what they actually do; parameter lists carry only what the function needs, in the order callers expect.

**Why apply it:** Call sites read fluently; mismatches between expectation and behavior surface immediately at the boundary.

**Tradeoff:** Every caller pays for the signature change at once, even those whose call sites were already fine; other-team callers get forced coordination.

```js
// Avoid:
function circum(radius) {
  return 2 * Math.PI * radius;
}

// Prefer:
function circumference(radius) {
  return 2 * Math.PI * radius;
}
```

**Removes smells:** Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces
