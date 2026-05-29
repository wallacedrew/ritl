---
name: change-function-declaration
description: Apply Change Function Declaration when you see Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces. Names and signatures express what the function does; the agent reasons about call sites from the signature alone.
---

# Apply: 05 — Change Function Declaration

**Symptom:** A function whose name or signature doesn't match its behavior; the agent inferring intent from the call site gets misled and must read the body to verify.

**Goal:** Names and signatures express what the function does; the agent reasons about call sites from the signature alone.

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

**Pressure:** The agent must read the function body to verify call-site intent; chained edits compound the cost as the agent re-derives intent at every site.

**Tradeoff:** Every caller pays for the change at once; for cross-team consumers, the agent must coordinate updates or risk breaking external code.

**Relief:** The signature carries the contract the agent reads at every call site; arguments that violate the contract become type errors at compile time instead of runtime mismatches generated against the old signature.

**Trap:** Reshaping signatures across team boundaries without coordination forces other consumers to rebuild — the agent shipping the change may not see the downstream breakage.

**Removes smells:** Mysterious Name, Long Parameter List, Alternative Classes with Different Interfaces
