---
name: comments
description: Refuse Comments when comments explaining what the next block does or what a function returns; the agent loading the comment plus the code carries two sources of truth that may have drifted apart. Apply Extract Function, Change Function Declaration.
---

# Refuse: 24 — Comments

**Symptom:** Comments explaining what the next block does or what a function returns; the agent loading the comment plus the code carries two sources of truth that may have drifted apart.

**Goal:** Names tell the agent what the comment was trying to say; comments survive only when they document a non-obvious WHY (hidden constraint, invariant, workaround).

```js
// Smellier:
// charge the customer's stored payment method, including tax
charge(c, t * 1.1);

// Fresher:
chargeWithTax(customer, total);
```

**Pressure:** The code didn't reveal its intent so the comment is patching an unnamed function or unclear variable; the agent must reconcile both sources and risk acting on the stale one.

**Tradeoff:** Renaming to express the comment's content ripples across consumers (cross-repo greps, embedding indexes, prior conversation context) the agent must accept will drift stale for a window.

**Relief:** The agent trusts names as the source of truth; reasoning steps don't need to cross-reference comments that might be wrong; the code is the documentation.

**Trap:** Deleting every comment in a cleanup pass — including ones documenting hidden constraints, historical context, or invariants names can't express — strips load-bearing context the agent will need later.

**Apply refactorings:** Extract Function, Change Function Declaration, Introduce Assertion
