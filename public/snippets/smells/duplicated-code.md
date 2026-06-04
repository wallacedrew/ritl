---
name: duplicated-code
description: Refuse Duplicated Code when near-identical code in multiple files; each copy the agent reads adds tokens to the context window without adding new information, and copies the agent doesn't read stay unverified. Apply Extract Function, Slide Statements.
---

# Refuse: 02 — Duplicated Code

**Announce first:** name this as Duplicated Code and which refactoring you'll apply (Extract Function or Slide Statements) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Duplicated Code, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Near-identical code in multiple files; each copy the agent reads adds tokens to the context window without adding new information, and copies the agent doesn't read stay unverified. The same structural pattern appears N times, but the agent's reasoning depends on knowing which copy is canonical and which copies have drifted — none of which is structurally signaled.

**Goal:** One canonical version the agent reads once; edits go in one place, every caller picks them up through the shared reference, and the token cost of N copies disappears. Subsequent reasoning passes load one definition instead of N; the agent's per-edit verification surface shrinks to the single canonical site plus its callers.

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

**Pressure:** The agent edits only the copy currently in its context window; copies outside the window stay unread and ship stale behind unit tests that test only the edited copy. The user receives correct behavior on the code path the edit covered and stale behavior everywhere else — a silent partial fix shipped as a complete one.

**Tradeoff:** Replaces N copies of the same code with one shared definition the agent reads once; if the abstraction is wrong, every exception ships as a branch the agent has to load — extra token cost at every call site. Wrong abstractions inflate the per-call reasoning step count and reintroduce the partial-fix risk the deduplication was meant to remove.

**Relief:** Bug fixes and new features land in one place; the agent loads one definition per edit instead of N, paying token cost once instead of N times. The verification surface contracts to one function and its callers, dropping completeness-check cost to the size of one dispatch graph rather than the entire family of duplicate sites.

**Trap:** Merging superficially-similar code forces a flag or type tag into the shared body; later divergences ship as branches the agent loads at every call site, and edits land on the wrong branch when the flag isn't visible from the caller. The agent pays full verification-surface cost on every edit; the merge produced a structural promise the implementation cannot keep.

**Apply refactorings:** Extract Function, Slide Statements, Pull Up Method
