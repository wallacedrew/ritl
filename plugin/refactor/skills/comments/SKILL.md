---
name: comments
description: Refuse Comments when comments explaining what the next block of code does, what a function returns, or how a parameter is meant to be used. Apply Extract Function, Change Function Declaration.
---

# Refuse: 24 — Comments

**Trigger (refuse when you see):** Comments explaining what the next block of code does, what a function returns, or how a parameter is meant to be used.

**Cost of leaving it in:** The code didn't reveal its intent — the comment is patching an unnamed function or unclear variable; comment and code drift over time.

**Target shape after refactoring:** Names of functions, variables, and types tell the reader what the comment was trying to say. Comments survive only when WHY is non-obvious.

```js
// Smellier:
// charge the customer's stored payment method, including tax
charge(c, t * 1.1);

// Fresher:
chargeWithTax(customer, total);
```

**Apply refactorings:** Extract Function, Change Function Declaration, Introduce Assertion
