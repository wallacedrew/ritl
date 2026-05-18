---
name: replace-exception-with-precheck
description: Apply Replace Exception with Precheck when you see Comments. The precheck appears at the point of decision; the agent reads the code top-to-bottom as the rule, with exceptions reserved for truly exceptional cases.
---

# Apply: 61 — Replace Exception with Precheck

**Target state:** The precheck appears at the point of decision; the agent reads the code top-to-bottom as the rule, with exceptions reserved for truly exceptional cases.

**Why apply it:** The agent reads the rule top-to-bottom; debuggers stop catching benign throws; exception handlers reserve for truly exceptional cases.

**Tradeoff:** Race conditions: the precheck may pass and the operation still fail (TOCTOU); the agent using prechecks must verify the caller can check the condition atomically.

```js
// Avoid:
try {
  return amounts[i] / 100;
} catch (e) {
  return 0;
}

// Prefer:
if (i >= amounts.length) return 0;
return amounts[i] / 100;
```

**Removes smells:** Comments
