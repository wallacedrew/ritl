---
name: move-statements-to-callers
description: Apply Move Statements to Callers when you see Divergent Change. Statements that vary by caller move out of the function so each caller chooses its own setup or follow-up.
---

# Apply: 45 — Move Statements to Callers

**Target state:** Statements that vary by caller move out of the function so each caller chooses its own setup or follow-up.

**Why apply it:** The function's body becomes about its single responsibility; callers express their differences directly.

**Pitfall:** If most callers want the moved statements, you've created duplication — the inverse of Move Statements into Function is only an improvement when callers genuinely differ.

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
