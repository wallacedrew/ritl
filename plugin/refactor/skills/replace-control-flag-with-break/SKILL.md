---
name: replace-control-flag-with-break
description: Apply Replace Control Flag with Break when you see Loops, Long Function. Loops that maintain a boolean to decide when to stop replace it with a direct `break`, `return`, or `continue`.
---

# Apply: 58 — Replace Control Flag with Break

**Target state:** Loops that maintain a boolean to decide when to stop replace it with a direct `break`, `return`, or `continue`.

**Why apply it:** The exit condition appears at the moment it's decided, not as a delayed effect of a flag check; the loop's intent becomes literal.

**Tradeoff:** If the loop body is large, the break can hide the early-exit semantics — extract a function around the loop's body to keep the exit obvious.

```js
// Avoid:
let found = false;
for (const p of people) {
  if (!found && p.name === target) {
    matched = p;
    found = true;
  }
}

// Prefer:
for (const p of people) {
  if (p.name === target) {
    matched = p;
    break;
  }
}
```

**Removes smells:** Loops, Long Function
