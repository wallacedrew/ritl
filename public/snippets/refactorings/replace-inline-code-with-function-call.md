---
name: replace-inline-code-with-function-call
description: Apply Replace Inline Code with Function Call when you see Duplicated Code. One canonical implementation the agent loads once and references everywhere; the name labels the intent at every call site.
---

# Apply: 46 — Replace Inline Code with Function Call

**Target state:** One canonical implementation the agent loads once and references everywhere; the name labels the intent at every call site.

**Why apply it:** The agent reasons about one definition; future improvements reach every site that used to inline; consistency is enforced by reference.

**Tradeoff:** If the existing function's name doesn't quite match the local intent, the agent reads the call site as a near-miss and must verify the semantic match at every replacement.

```js
// Avoid:
const inRange = candidate >= low && candidate <= high;

// Prefer:
const inRange = between(candidate, low, high);
```

**Removes smells:** Duplicated Code
