---
name: introduce-special-case
description: Apply Introduce Special Case when you see Repeated Switches, Comments. A repeating null-or-special check becomes a Null Object (or Special Case) that responds sensibly to the same interface.
---

# Apply: 25 — Introduce Special Case

**Target state:** A repeating null-or-special check becomes a Null Object (or Special Case) that responds sensibly to the same interface.

**Why apply it:** Callers stop branching on identity; the special behavior lives in one place.

**Pitfall:** Adds a tiny class for one case; only worthwhile when the special case appears in 2+ consumers.

```js
// Avoid:
const name = customer === 'unknown' ? 'occupant' : customer.name;

// Prefer:
const name = customer.name; // UnknownCustomer.name returns 'occupant'
```

**Removes smells:** Repeated Switches, Comments
