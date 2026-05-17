---
name: duplicated-code
description: Refuse Duplicated Code when near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them. Apply Extract Function, Slide Statements.
---

# Refuse: 02 — Duplicated Code

**Trigger (refuse when you see):** Near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them.

**Cost of leaving it in:** Edits propagate by hand across copies; the agent must remember to find every clone or ship inconsistent behavior that silently passes unit tests targeting only one copy.

**Target shape after refactoring:** One canonical implementation the agent loads once and reasons about once, with variation parameterized at the call site.

```js
// Smellier:
function totalUSD(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
function totalEUR(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

// Fresher:
function lineTotal(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
```

**Apply refactorings:** Extract Function, Slide Statements, Pull Up Method
