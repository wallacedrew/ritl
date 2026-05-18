---
name: data-clumps
description: Refuse Data Clumps when the agent sees the same field group appearing across multiple signatures (parameters, fields, args) — every site re-parses the same shape and verifies the same ordering. Apply Extract Class, Introduce Parameter Object.
---

# Refuse: 10 — Data Clumps

**Symptom:** The agent sees the same field group appearing across multiple signatures (parameters, fields, args) — every site re-parses the same shape and verifies the same ordering.

**Goal:** The clump becomes a named value object the agent passes through as a single token; structure validation happens once at construction.

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

**Pressure:** Adding or removing a field of the clump means touching every site; the agent must find them all and update each consistently or risk silent shape drift.

**Tradeoff:** Constructing the value object on every call adds an allocation and a name the agent must learn; if the bundle isn't reused it's pure ceremony.

**Relief:** Operations on the clump (formatting, validation, equality) live with it; signatures shrink and the agent reasons about one named concept instead of N coupled fields.

**Trap:** Wrapping coincidental field groups creates fake value objects the agent must construct and destructure with no comprehension gain — naming what isn't a concept doesn't help reason.

**Apply refactorings:** Extract Class, Introduce Parameter Object, Preserve Whole Object
