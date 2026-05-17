---
name: replace-exception-with-precheck
description: Apply Replace Exception with Precheck when you see Comments. Exceptions used for predictable, checkable conditions become an explicit precheck the caller can perform, leaving exceptions for truly exceptional cases.
---

# Apply: 61 — Replace Exception with Precheck

**Target state:** Exceptions used for predictable, checkable conditions become an explicit precheck the caller can perform, leaving exceptions for truly exceptional cases.

**Why apply it:** The error path is local and visible; reading code top-to-bottom describes the rules rather than the failure response; debuggers stop catching benign throws.

**Tradeoff:** Race conditions: the precheck may pass and the operation still fail (TOCTOU). Use prechecks only for conditions the caller can verify without a race.

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
