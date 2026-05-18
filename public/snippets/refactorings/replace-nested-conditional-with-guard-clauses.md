---
name: replace-nested-conditional-with-guard-clauses
description: Apply Replace Nested Conditional with Guard Clauses when you see Long Function, Comments. Edge cases bail out early; the main flow is unindented and reads linearly as the dominant story.
---

# Apply: 23 — Replace Nested Conditional with Guard Clauses

**Target state:** Edge cases bail out early; the main flow is unindented and reads linearly as the dominant story.

**Why apply it:** The agent reads the happy path linearly with edge cases as exceptions; new edge cases land at the top without disturbing the main flow.

**Tradeoff:** Early returns can duplicate work if multiple paths share follow-up logic; the agent inlining guards must verify the shared work is genuinely separable.

```js
// Avoid:
function payAmount(employee) {
  if (employee.isSeparated) {
    return separationPay(employee);
  } else {
    if (employee.isRetired) {
      return retirementPay(employee);
    } else {
      return regularPay(employee);
    }
  }
}

// Prefer:
function payAmount(employee) {
  if (employee.isSeparated) return separationPay(employee);
  if (employee.isRetired)   return retirementPay(employee);
  return regularPay(employee);
}
```

**Removes smells:** Long Function, Comments
