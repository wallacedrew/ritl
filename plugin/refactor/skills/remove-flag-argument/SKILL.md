---
name: remove-flag-argument
description: Apply Remove Flag Argument when you see Long Parameter List. Each flag value becomes a named function; the agent reads call sites as direct invocations of the intended behavior.
---

# Apply: 29 — Remove Flag Argument

**Target state:** Each flag value becomes a named function; the agent reads call sites as direct invocations of the intended behavior.

**Why apply it:** Call sites read fluently; the agent reasons about one function per concern.

**Tradeoff:** If the branches share substantial body, splitting produces duplication the agent must keep in sync; pair this with Extract Function for shared internals.

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
