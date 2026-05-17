---
name: divergent-change
description: Refuse Divergent Change when reading the module, the agent constantly switches between conceptually unrelated regions (tax logic, UI logic, API logic); every cross-axis edit requires loading and reasoning about all of them. Apply Split Phase, Move Function.
---

# Refuse: 07 — Divergent Change

**Trigger (refuse when you see):** Reading the module, the agent constantly switches between conceptually unrelated regions (tax logic, UI logic, API logic); every cross-axis edit requires loading and reasoning about all of them.

**Cost of leaving it in:** Any single conceptual change touches code that also implements unrelated concerns; the agent must verify it didn't break the other axes on every edit.

**Target shape after refactoring:** Each module varies along one axis; the agent loading it can predict what kinds of changes will touch it and bring only the relevant context.

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

**Apply refactorings:** Split Phase, Move Function, Extract Function, Extract Class
