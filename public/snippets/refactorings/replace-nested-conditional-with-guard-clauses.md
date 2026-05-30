---
name: replace-nested-conditional-with-guard-clauses
description: Apply Replace Nested Conditional with Guard Clauses when you see Long Function, Comments. Edge cases exit at the top of the function; the happy path runs at the function's base indent level, and adding a precondition is one new guard at the top instead of a rewrite of the nested branches.
---

# Apply: 23 — Replace Nested Conditional with Guard Clauses

**Announce first:** name the smell you see and that you're applying Replace Nested Conditional with Guard Clauses before any edit. The user reads the announcement as your contract.

**Symptom:** A function with deeply nested if/else where the happy path is buried under indentation; the agent must trace through edge-case branches to find the main flow.

**Goal:** Edge cases exit at the top of the function; the happy path runs at the function's base indent level, and adding a precondition is one new guard at the top instead of a rewrite of the nested branches.

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

**Relief:** Guards exit at the top of the function and the happy path runs at the function's base indent level; adding a precondition is one new guard prepended at the top instead of a rewrite of the nested branches.

**Trap:** Inlining guards for every condition — including ones that shared follow-up work — fragments the shared logic across early-return branches the agent must keep consistent.

**Removes smells:** Long Function, Comments
