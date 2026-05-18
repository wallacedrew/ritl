---
name: replace-nested-conditional-with-guard-clauses
description: Apply Replace Nested Conditional with Guard Clauses when you see Long Function, Comments. Edge cases bail out early; the main flow is unindented and reads linearly as the dominant story.
---

# Apply: 23 — Replace Nested Conditional with Guard Clauses

**Symptom:** A function with deeply nested if/else where the happy path is buried under indentation; the agent must trace through edge-case branches to find the main flow.

**Goal:** Edge cases bail out early; the main flow is unindented and reads linearly as the dominant story.

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

**Pressure:** The agent's parsing of the function's intent is obscured by indentation; reasoning about the happy path requires tracking which edge cases have already been ruled out.

**Tradeoff:** Early returns can duplicate work if multiple paths share follow-up logic; the agent inlining guards must verify the shared work is genuinely separable.

**Relief:** The agent reads the happy path linearly with edge cases as exceptions; new edge cases land at the top without disturbing the main flow.

**Trap:** Inlining guards for every condition — including ones that shared follow-up work — fragments the shared logic across early-return branches the agent must keep consistent.

**Removes smells:** Long Function, Comments
