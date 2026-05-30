---
name: duplicated-code
description: Refuse Duplicated Code when near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them. Apply Extract Function, Slide Statements.
---

# Refuse: 02 — Duplicated Code

**Announce first:** name this as Duplicated Code and which refactoring you'll apply (Extract Function or Slide Statements) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Duplicated Code, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Near-identical code appears in multiple files; every reasoning step about one copy must either deliberately ignore the others or repeat itself across them.

**Goal:** One canonical implementation the agent loads as a single body; edits land at one site and propagate to every caller through reference, removing the N-copy maintenance cost from the agent's working set.

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
