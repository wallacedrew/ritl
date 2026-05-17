---
name: comments
description: Refuse Comments when comments explaining what the next block does or what a function returns; the agent loading the comment plus the code carries two sources of truth that may have drifted apart. Apply Extract Function, Change Function Declaration.
---

# Refuse: 24 — Comments

**Trigger (refuse when you see):** Comments explaining what the next block does or what a function returns; the agent loading the comment plus the code carries two sources of truth that may have drifted apart.

**Cost of leaving it in:** The code didn't reveal its intent so the comment is patching an unnamed function or unclear variable; the agent must reconcile both sources and risk acting on the stale one.

**Target shape after refactoring:** Names tell the agent what the comment was trying to say; comments survive only when they document a non-obvious WHY (hidden constraint, invariant, workaround).

```js
// Smellier:
// charge the customer's stored payment method, including tax
charge(c, t * 1.1);

// Fresher:
chargeWithTax(customer, total);
```

**Apply refactorings:** Extract Function, Change Function Declaration, Introduce Assertion
