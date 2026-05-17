---
name: split-variable
description: Apply Split Variable when you see Mysterious Name, Mutable Data. Each variable has one role; reassignment patterns reflect distinct purposes rather than reused storage.
---

# Apply: 18 — Split Variable

**Target state:** Each variable has one role; reassignment patterns reflect distinct purposes rather than reused storage.

**Why apply it:** Names match purpose; the type system can narrow each role; refactoring each use becomes local.

**Tradeoff:** If the two uses were actually coupled — shared init or synchronized update — splitting them invites drift the single mutation kept in sync.

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
