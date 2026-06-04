---
name: long-function
description: Refuse Long Function when the function's body has more tokens than the agent can hold in one reasoning step; verifying behavior preservation means re-reading the entire body on every edit. Apply Extract Function, Replace Temp with Query.
---

# Refuse: 03 — Long Function

**Announce first:** name this as Long Function and which refactoring you'll apply (Extract Function or Replace Temp with Query) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Long Function, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** The function's body has more tokens than the agent can hold in one reasoning step; verifying behavior preservation means re-reading the entire body on every edit.

**Goal:** Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step.

```js
// Smellier:
function ship(order) {
  if (!order.id) throw new Error('missing id');
  const tax = order.total * 0.1;
  const grand = order.total + tax;
  email(order.user, `Total ${grand}`);
  log(order);
}

// Fresher:
function ship(order) {
  validate(order);
  const grand = withTax(order);
  notify(order, grand);
}
```

**Pressure:** Every edit pays the full context-window load of re-reading the body; chained edits raise the chance of missing a cross-statement invariant.

**Tradeoff:** Splitting inflates context-window load — the agent now loads N function definitions to follow what was once one body. Worth it when the outline is clearer than the linear body.

**Relief:** Each extracted function fits inside one read; the agent verifies behavior against one signature, dropping context-window load per edit.

**Trap:** Forces the agent to chase a dozen function definitions for what was once a 20-line procedure — context-window load inflates and cross-function invariants disappear.

**Apply refactorings:** Extract Function, Replace Temp with Query, Introduce Parameter Object, Preserve Whole Object, Replace Function with Command, Decompose Conditional, Split Loop, Replace Loop with Pipeline, Replace Control Flag with Break
