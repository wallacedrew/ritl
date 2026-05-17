---
name: data-clumps
description: Refuse Data Clumps when the agent sees the same field group appearing across multiple signatures (parameters, fields, args) — every site re-parses the same shape and verifies the same ordering. Apply Extract Class, Introduce Parameter Object.
---

# Refuse: 10 — Data Clumps

**Trigger (refuse when you see):** The agent sees the same field group appearing across multiple signatures (parameters, fields, args) — every site re-parses the same shape and verifies the same ordering.

**Cost of leaving it in:** Adding or removing a field of the clump means touching every site; the agent must find them all and update each consistently or risk silent shape drift.

**Target shape after refactoring:** The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.

```js
// Smellier:
function send(name, email, street, city, zip) {
  // ...
}

// Fresher:
class Address { /* street, city, zip */ }
function send(name, email, address) {
  // ...
}
```

**Apply refactorings:** Extract Class, Introduce Parameter Object, Preserve Whole Object
