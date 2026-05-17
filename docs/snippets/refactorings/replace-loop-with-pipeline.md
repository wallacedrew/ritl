---
name: replace-loop-with-pipeline
description: Apply Replace Loop with Pipeline when you see Loops. Filter / map / reduce expresses the transformation as a sequence of named operations; intent jumps off the page.
---

# Apply: 16 — Replace Loop with Pipeline

**Target state:** Filter / map / reduce expresses the transformation as a sequence of named operations; intent jumps off the page.

**Why apply it:** Off-by-one and accumulator bugs vanish; each step is independently testable.

**Tradeoff:** Pipelines add a tiny per-element function-call overhead — usually negligible, but profile if you're in a hot path.

```js
// Avoid:
const seniors = [];
for (const u of users) {
  if (u.age >= 65) seniors.push(u.name);
}

// Prefer:
const seniors = users
  .filter(u => u.age >= 65)
  .map(u => u.name);
```

**Removes smells:** Loops
