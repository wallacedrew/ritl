---
name: remove-dead-code
description: Apply Remove Dead Code when you see Speculative Generality, Comments. Every line in the codebase is reachable and used; readers don't waste cycles on phantom branches.
---

# Apply: 17 — Remove Dead Code

**Target state:** Every line in the codebase is reachable and used; readers don't waste cycles on phantom branches.

**Why apply it:** Smaller surface, faster reading, fewer false leads when debugging.

**Pitfall:** Code that looks dead may be reachable via reflection, dynamic dispatch, or external callers — delete in version control where it can be recovered.

```js
// Avoid:
function legacyDiscount(order) {
  /* unused since 2018 */
}
function modernDiscount(order) {
  /* the real one */
}

// Prefer:
function discount(order) {
  /* the real one */
}
```

**Removes smells:** Speculative Generality, Comments
