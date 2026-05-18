---
name: consolidate-conditional-expression
description: Apply Consolidate Conditional Expression when you see Duplicated Code. The conditions collapse into one named predicate; the agent reasons about one rule with one action.
---

# Apply: 22 — Consolidate Conditional Expression

**Target state:** The conditions collapse into one named predicate; the agent reasons about one rule with one action.

**Why apply it:** The agent reasons about one named predicate with one consequent; new conditions extend in one place.

**Tradeoff:** If the conditions encode independent reasons (different rules that happen to produce the same outcome today), collapsing them hides distinctions the agent will need to re-split later.

```js
// Avoid:
if (employee.seniority < 2)        return 0;
if (employee.monthsDisabled > 12)  return 0;
if (employee.isPartTime)           return 0;

// Prefer:
if (isIneligibleForBonus(employee)) return 0;
```

**Removes smells:** Duplicated Code
