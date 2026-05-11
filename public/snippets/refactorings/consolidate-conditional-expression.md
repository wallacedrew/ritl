---
name: consolidate-conditional-expression
description: Apply Consolidate Conditional Expression when you see Duplicated Code. Multiple conditions leading to the same action collapse into one named predicate.
---

# Apply: 22 — Consolidate Conditional Expression

**Target state:** Multiple conditions leading to the same action collapse into one named predicate.

**Why apply it:** The shared rationale becomes visible and namable; new conditions extend one place instead of N.

**Pitfall:** Combining conditions can hide their independent reasons — only consolidate when they truly express the same business rule.

```js
// Avoid:
if (employee.seniority < 2)        return 0;
if (employee.monthsDisabled > 12)  return 0;
if (employee.isPartTime)           return 0;

// Prefer:
if (isIneligibleForBonus(employee)) return 0;
```

**Removes smells:** Duplicated Code
