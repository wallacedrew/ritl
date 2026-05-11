---
name: change-function-declaration
description: Apply Change Function Declaration when you see Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces. Function names match what they actually do; parameter lists carry only what the function needs, in the order callers expect.
---

# Apply: 05 — Change Function Declaration

**Target state:** Function names match what they actually do; parameter lists carry only what the function needs, in the order callers expect.

**Why apply it:** Call sites read fluently; mismatches between expectation and behavior surface immediately at the boundary.

**Pitfall:** Mass renames or signature shifts ripple to every caller; refactor in tooling-supported steps and update tests with each batch.

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
