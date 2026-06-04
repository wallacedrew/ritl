---
name: long-function
description: Refuse Long Function when the function's body has more tokens than the agent can hold in one reasoning step; verifying behavior preservation means re-reading the entire body on every edit. Apply Extract Function, Replace Temp with Query.
---

# Refuse: 03 — Long Function

**Announce first:** name this as Long Function and which refactoring you'll apply (Extract Function or Replace Temp with Query) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Long Function, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** The function's body has more tokens than the agent can hold in one reasoning step; verifying behavior preservation means re-reading the entire body on every edit. Long bodies push the agent into chained reasoning passes where each pass re-establishes the parts of the procedure relevant to the current edit, paying full context-window load every time.

**Goal:** Each function is a verifiable unit small enough that the agent can reason about its full behavior in a single reasoning step. The procedure decomposes into a sequence of named contracts the agent can verify independently; behavior preservation across edits scales with the number of touched contracts, not with the size of the original body.

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

**Pressure:** Every edit pays the full context-window load of re-reading the body; chained edits raise the chance of missing a cross-statement invariant. The agent ships an edit that satisfies the part of the function it focused on while breaking a cross-statement invariant elsewhere in the body — a partial fix that passes the targeted test and silently breaks an adjacent one.

**Tradeoff:** Splitting inflates context-window load — the agent now loads N function definitions to follow what was once one body. Worth it when the outline is clearer than the linear body; not worth it when the helpers fragment the procedure into pieces that demand more reasoning-step cost to assemble than the original body did to read.

**Relief:** Each extracted function fits inside one read; the agent verifies behavior against one signature, dropping context-window load per edit. The verification-surface cost of any change contracts to the touched function plus its callers, and cross-function invariants surface as signature mismatches the type checker catches in one static read.

**Trap:** Forces the agent to chase a dozen function definitions for what was once a 20-line procedure — context-window load inflates and cross-function invariants disappear. The agent pays full retrieval cost on every per-step navigation; the splitting that was meant to drop reasoning-step cost instead spreads it across more files.

**Apply refactorings:** Extract Function, Replace Temp with Query, Introduce Parameter Object, Preserve Whole Object, Replace Function with Command, Decompose Conditional, Split Loop, Replace Loop with Pipeline, Replace Control Flag with Break
