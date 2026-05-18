---
name: duplicated-code
description: Refuse Duplicated Code when near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them. Apply Extract Function, Slide Statements.
---

# Refuse: 02 — Duplicated Code

**Symptom:** Near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them.

**Goal:** One canonical implementation the agent loads once and reasons about once, with variation parameterized at the call site.

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

**Pressure:** Edits propagate by hand across copies; the agent must remember to find every clone or ship inconsistent behavior that silently passes unit tests targeting only one copy.

**Tradeoff:** The shared form introduces an indirection the agent must trace through; if the abstraction is wrong, every divergence becomes an exception that complicates reasoning at every call site.

**Relief:** Bug fixes and feature additions land in one place; the agent's plan-and-execute loop touches one definition instead of N.

**Trap:** Over-eager merging of superficially-similar code creates a leaky abstraction the agent must constantly special-case — reasoning becomes harder than reasoning about the original copies.

**Apply refactorings:** Extract Function, Slide Statements, Pull Up Method
