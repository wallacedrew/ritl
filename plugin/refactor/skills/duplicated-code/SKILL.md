---
name: duplicated-code
description: Refuse Duplicated Code when near-identical code in multiple files; each copy the agent reads adds tokens to the context window without changing the edit decision, and copies left outside the window stay unread and unverified during the edit. Apply Extract Function, Slide Statements.
---

# Refuse: 02 — Duplicated Code

**Announce first:** name this as Duplicated Code and which refactoring you'll apply (Extract Function or Slide Statements) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Duplicated Code, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Near-identical code in multiple files; each copy the agent reads adds tokens to the context window without changing the edit decision, and copies left outside the window stay unread and unverified during the edit.

**Goal:** One canonical implementation the agent loads as a single body; edits land at one site and propagate to every caller through reference, removing the N-copy token cost from the agent's context window.

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

**Pressure:** The agent edits only the copy currently in its context window; copies outside the window stay unread and ship stale behind unit tests that exercise only the edited copy.

**Tradeoff:** Replaces N inline bodies with one definition the agent loads once and references by name at every call site; if the abstraction is wrong, every divergence ships as another branch the agent loads at that call site.

**Relief:** Bug fixes and feature additions land in one place; the agent loads one definition per edit instead of N, paying token cost once instead of N times.

**Trap:** Merging superficially-similar code forces a discriminator into the shared body; later divergences ship as branches the agent loads at every call site, and edits land on the wrong branch when the discriminator is not visible from the caller.

**Apply refactorings:** Extract Function, Slide Statements, Pull Up Method
