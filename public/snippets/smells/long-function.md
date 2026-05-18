---
name: long-function
description: Refuse Long Function when a function whose token count exceeds the agent's reliable chunk-reasoning budget; verifying behavior preservation requires re-reading the entire span on every edit. Apply Extract Function, Replace Temp with Query.
---

# Refuse: 03 — Long Function

**Symptom:** A function whose token count exceeds the agent's reliable chunk-reasoning budget; verifying behavior preservation requires re-reading the entire span on every edit.

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

**Pressure:** Every edit pays full re-read cost; chained changes compound context usage and increase the chance of missing a cross-statement invariant.

**Tradeoff:** Splitting inflates context-window usage at orchestration time — the agent now loads N function definitions to follow what was once one body. Worth it when the orchestration outline is clearer than the linear body.

**Relief:** Smaller diff surface per commit; behavior preservation verifiable per refactoring step; chained orchestrations work from named subroutines instead of re-derived semantics.

**Trap:** Forces the agent to chase a dozen function definitions for what was once a 20-line procedure — context cost inflates and cross-function invariants disappear.

**Apply refactorings:** Extract Function, Replace Temp with Query, Introduce Parameter Object, Preserve Whole Object, Replace Function with Command, Decompose Conditional, Split Loop, Replace Loop with Pipeline, Replace Control Flag with Break
