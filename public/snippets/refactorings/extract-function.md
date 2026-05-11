---
name: extract-function
description: Apply Extract Function when you see Long Function, Duplicated Code, Comments. Each function reads as a single named domain step — what it does, not how.
---

# Apply: 01 — Extract Function

**Target state:** Each function reads as a single named domain step — what it does, not how.

**Why apply it:** Calling code becomes a sequence of named intentions; bugs concentrate inside the now-named subroutines.

**Pitfall:** Over-eager extraction can produce a maze of one-line functions; aim for extractions that earn their name with at least one decision or one transformation.

```js
// Avoid:
function ship(order) {
  if (!order.id) throw new Error('missing id');
  const grand = order.total * 1.1;
  email(order.user, `Total ${grand}`);
}

// Prefer:
function ship(order) {
  validate(order);
  const grand = withTax(order);
  notify(order, grand);
}
```

**Removes smells:** Long Function, Duplicated Code, Comments
