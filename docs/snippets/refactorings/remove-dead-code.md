---
name: remove-dead-code
description: Apply Remove Dead Code when you see Speculative Generality, Comments. Every definition the agent encounters is reachable; reasoning about behavior doesn't have to consider phantom paths.
---

# Apply: 17 — Remove Dead Code

**Target state:** Every definition the agent encounters is reachable; reasoning about behavior doesn't have to consider phantom paths.

**Why apply it:** The agent's reasoning context shrinks; static analysis becomes ground truth; planning loops don't waste cycles on phantom paths.

**Tradeoff:** Deletion is one-way under static analysis but reachability can hide in reflection, dynamic dispatch, external callers, or runtime config — the agent that deletes without checking risks a regression nothing catches.

```js
// Avoid:
function legacyDiscount(order) { /* unused since 2018 */ }
function modernDiscount(order) { /* the real one */ }

// Prefer:
function discount(order) { /* the real one */ }
```

**Removes smells:** Speculative Generality, Comments
