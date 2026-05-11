### Refuse: 07 — Divergent Change

**Trigger (refuse when you see):** One module changes for many unrelated reasons — one part for tax law updates, another for UI changes, another for API shape drift.

**Cost of leaving it in:** Every team's churn lands in the same file; merges become contentious; testing one concern requires understanding all of them.

**Target shape after refactoring:** Each module changes for one reason — the kinds of changes that touch it cluster around a single axis of variation.

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
