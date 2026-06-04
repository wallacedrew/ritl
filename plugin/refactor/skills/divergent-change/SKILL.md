---
name: divergent-change
description: Refuse Divergent Change when reading the module, the agent constantly switches between conceptually unrelated regions (tax logic, UI logic, API logic); every cross-axis edit pays context-window load for all of them. Apply Split Phase, Move Function.
---

# Refuse: 07 — Divergent Change

**Announce first:** name this as Divergent Change and which refactoring you'll apply (Split Phase or Move Function) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Divergent Change, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Reading the module, the agent constantly switches between conceptually unrelated regions (tax logic, UI logic, API logic); every cross-axis edit pays context-window load for all of them.

**Goal:** Each module varies along one axis; the agent reads the axis name from the module and loads only the slice of code relevant to the current edit, keeping context-window load minimal.

```js
// Smellier:
function checkout(cart) {
  const tax = computeTax(cart, jurisdiction); // tax churn
  const html = renderInvoice(cart, tax);      // UI churn
  return postToGateway(html);                 // API churn
}

// Fresher:
function priced(cart) { return { ...cart, tax: computeTax(cart) }; }
function rendered(cart) { return renderInvoice(cart); }
function sent(html)    { return postToGateway(html); }
```

**Pressure:** Any single conceptual change touches code that also implements unrelated concerns; the agent pays verification-surface cost across every axis on every edit.

**Tradeoff:** Splitting introduces a seam between modules; cross-cutting changes now require the agent to load and synchronize edits across both, inflating context-window load for those specific cases.

**Relief:** One axis of change per module means the agent loads exactly the slice of code relevant to the request — minimal context-window load — and concurrent edits along different axes don't interfere.

**Trap:** Splitting on every minor distinction creates a fan-out of tiny modules; the agent pays retrieval cost for every file it loads to reason about any meaningful behavior — assembly cost exceeds the comprehension gain.

**Apply refactorings:** Split Phase, Move Function, Extract Function, Extract Class
