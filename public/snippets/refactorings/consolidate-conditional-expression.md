---
name: consolidate-conditional-expression
description: Apply Consolidate Conditional Expression when you see Duplicated Code. The conditions collapse into one named predicate; the agent reasons about one rule with one action.
---

# Apply: 22 — Consolidate Conditional Expression

**Symptom:** Multiple conditions in sequence lead to the same action; the agent must verify each branch leads to identical behavior and that adding a new condition won't accidentally diverge.

**Goal:** The conditions collapse into one named predicate; the agent reasons about one rule with one action.

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

**Relief:** The agent reasons about one named predicate with one consequent; new conditions extend in one place.

**Trap:** Collapsing conditions that look the same but encode independent rules hides distinctions the agent will need to re-split when one rule evolves differently from the others.

**Removes smells:** Duplicated Code
