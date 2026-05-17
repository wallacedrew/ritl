---
name: replace-nested-conditional-with-guard-clauses
description: Apply Replace Nested Conditional with Guard Clauses when you see Long Function, Comments. Edge cases bail out early at the top of the function; the main flow is unindented and tells the happy path linearly.
---

# Apply: 23 — Replace Nested Conditional with Guard Clauses

**Target state:** Edge cases bail out early at the top of the function; the main flow is unindented and tells the happy path linearly.

**Why apply it:** Indentation drops; the dominant case is obvious; new edge cases land at the top without disturbing the rest.

**Tradeoff:** If multiple paths share work, premature returns can duplicate that work — extract first, then guard.

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
