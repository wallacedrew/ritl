---
name: replace-loop-with-pipeline
description: Apply Replace Loop with Pipeline when you see Loops. Transformations read as named operation sequences (filter, map, reduce); the agent recognizes the shape without simulating the loop.
---

# Apply: 16 — Replace Loop with Pipeline

**Target state:** Transformations read as named operation sequences (filter, map, reduce); the agent recognizes the shape without simulating the loop.

**Why apply it:** Intent is readable; the agent reasons about each pipeline stage independently with type signatures documenting the transformation.

**Tradeoff:** Pipeline form adds per-element call overhead and forces the agent to track intermediate collection types through the chain; for hot paths the runtime cost matters.

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
