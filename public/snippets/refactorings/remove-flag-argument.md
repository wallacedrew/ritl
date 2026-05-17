---
name: remove-flag-argument
description: Apply Remove Flag Argument when you see Long Parameter List. Each flag value becomes its own well-named function; callers say what they mean rather than passing booleans.
---

# Apply: 29 — Remove Flag Argument

**Target state:** Each flag value becomes its own well-named function; callers say what they mean rather than passing booleans.

**Why apply it:** Call sites read fluently; new variations land as new functions instead of new switch cases.

**Tradeoff:** Two replacement functions with similar bodies introduce duplication — pair this with Extract Function for shared internals.

```js
// Avoid:
function setDimension(name, value) {
  if (name === 'height') /* ... */
  else if (name === 'width') /* ... */
}

// Prefer:
function setHeight(value) { /* ... */ }
function setWidth(value)  { /* ... */ }
```

**Removes smells:** Long Parameter List
