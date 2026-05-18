---
name: move-statements-to-callers
description: Apply Move Statements to Callers when you see Divergent Change. The function's body addresses one responsibility; callers express their differences at the call site.
---

# Apply: 45 — Move Statements to Callers

**Target state:** The function's body addresses one responsibility; callers express their differences at the call site.

**Why apply it:** The function's contract narrows to its single responsibility; callers express variation explicitly; the agent reasons about one body and one branch per caller.

**Tradeoff:** If most callers want the moved statements, the agent now sees duplicated boilerplate at every call site — the inverse smell.

```js
// Avoid:
function emit(line) {
  log.write(line);
  metrics.tick();
}

// Prefer:
function emit(line) { log.write(line); }
emit('startup');
metrics.tick();
```

**Removes smells:** Divergent Change
