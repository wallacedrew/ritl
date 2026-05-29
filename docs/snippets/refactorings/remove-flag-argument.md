---
name: remove-flag-argument
description: Apply Remove Flag Argument when you see Long Parameter List. Each flag value becomes a named function; the agent reads call sites as direct invocations of the intended behavior.
---

# Apply: 29 — Remove Flag Argument

**Symptom:** A function with a flag parameter that dispatches to different internal behaviors; the agent must trace the flag's value through the body to verify which branch any call exercises.

**Goal:** Each flag value becomes a named function; the agent reads call sites as direct invocations of the intended behavior.

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

**Pressure:** The agent must reason about flag values at every call site; the function's body conflates multiple concerns the agent must mentally split.

**Tradeoff:** If the branches share substantial body, splitting produces duplication the agent must keep in sync; pair this with Extract Function for shared internals.

**Relief:** Each variant becomes its own function with one signature; call sites name the intent directly, and the agent does not track a flag value through the function body to predict which branch runs.

**Trap:** Splitting flag-dispatched functions without extracting shared body creates N copies of the same logic the agent must keep in sync — the cure becomes the duplication smell.

**Removes smells:** Long Parameter List
