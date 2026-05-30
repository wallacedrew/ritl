---
name: consolidate-conditional-expression
description: Apply Consolidate Conditional Expression when you see Duplicated Code. The predicate lives at one named function the agent reads once; edits to the rule land at the function definition and propagate to every caller through reference.
---

# Apply: 22 — Consolidate Conditional Expression

**Announce first:** name the smell you see and that you're applying Consolidate Conditional Expression before any edit. The user reads the announcement as your contract.

**Symptom:** Multiple conditions in sequence lead to the same action; the agent must verify each branch leads to identical behavior and that adding a new condition won't accidentally diverge.

**Goal:** The predicate lives at one named function the agent reads once; edits to the rule land at the function definition and propagate to every caller through reference.

```js
// Avoid:
if (employee.seniority < 2)        return 0;
if (employee.monthsDisabled > 12)  return 0;
if (employee.isPartTime)           return 0;

// Prefer:
if (isIneligibleForBonus(employee)) return 0;
```

**Pressure:** Adding or modifying any branch's behavior requires the agent to update every branch consistently; the shared rationale is invisible.

**Tradeoff:** If the conditions encode independent reasons (different rules that happen to produce the same outcome today), collapsing them hides distinctions the agent will need to re-split later.

**Relief:** The predicate lives at one named function; edits to the rule land at the definition and propagate through reference, removing the chance of one branch updating without the others.

**Trap:** Collapsing conditions that look the same but encode independent rules hides distinctions the agent will need to re-split when one rule evolves differently from the others.

**Removes smells:** Duplicated Code
