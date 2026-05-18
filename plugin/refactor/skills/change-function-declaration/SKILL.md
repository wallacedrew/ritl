---
name: change-function-declaration
description: Apply Change Function Declaration when you see Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces. Names and signatures express what the function does; the agent reasons about call sites from the signature alone.
---

# Apply: 05 — Change Function Declaration

**Target state:** Names and signatures express what the function does; the agent reasons about call sites from the signature alone.

**Why apply it:** Call sites read fluently; the agent's signature-based reasoning becomes trustworthy; mismatches surface at the boundary.

**Tradeoff:** Every caller pays for the change at once; for cross-team consumers, the agent must coordinate updates or risk breaking external code.

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
