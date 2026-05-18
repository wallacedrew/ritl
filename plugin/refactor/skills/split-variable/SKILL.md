---
name: split-variable
description: Apply Split Variable when you see Mysterious Name, Mutable Data. Each variable holds one role with a stable name; the agent reasons about names without tracking reassignment timeline.
---

# Apply: 18 — Split Variable

**Target state:** Each variable holds one role with a stable name; the agent reasons about names without tracking reassignment timeline.

**Why apply it:** The agent reasons about each variable as a stable name; the type system can narrow each role; each use becomes independently refactorable.

**Tradeoff:** If the two uses were actually coupled (shared init, synchronized update), splitting forces the agent to re-derive the coupling across two variables.

```js
// Avoid:
let temp = 2 * (height + width);
console.log(temp);
temp = height * width;
console.log(temp);

// Prefer:
const perimeter = 2 * (height + width);
console.log(perimeter);
const area = height * width;
console.log(area);
```

**Removes smells:** Mysterious Name, Mutable Data
