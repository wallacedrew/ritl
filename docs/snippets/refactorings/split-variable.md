### Apply: 18 — Split Variable

**Target state:** Each variable has one role; reassignment patterns reflect distinct purposes rather than reused storage.

**Why apply it:** Names match purpose; the type system can narrow each role; refactoring each use becomes local.

**Pitfall:** Two distinct uses of one variable share a single update pattern that may have hidden coupling — verify each use is genuinely independent.

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
