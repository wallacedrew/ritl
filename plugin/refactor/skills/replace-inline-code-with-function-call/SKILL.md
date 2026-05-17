---
name: replace-inline-code-with-function-call
description: Apply Replace Inline Code with Function Call when you see Duplicated Code. When inline code reproduces what a named function already does, the inline copy is replaced by a call.
---

# Apply: 46 — Replace Inline Code with Function Call

**Target state:** When inline code reproduces what a named function already does, the inline copy is replaced by a call.

**Why apply it:** One canonical implementation; the name labels the intent; future improvements to the function reach every site that used to inline.

**Tradeoff:** If the existing function's name doesn't quite match the local intent, the call site reads as a near-miss; consider Change Function Declaration first.

```js
// Avoid:
const inRange = candidate >= low && candidate <= high;

// Prefer:
const inRange = between(candidate, low, high);
```

**Removes smells:** Duplicated Code
