---
name: move-statements-to-callers
description: Apply Move Statements to Callers when you see Divergent Change. The function's body addresses one responsibility; callers express their differences at the call site.
---

# Apply: 45 — Move Statements to Callers

**Symptom:** The agent finds a function body whose statements vary by caller context — logging contexts, post-processing flags, metric labels baked into one body via branches.

**Goal:** The function's body addresses one responsibility; callers express their differences at the call site.

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

**Pressure:** Adding a new caller forces extending the function's branches; the agent must reason about which branch applies and verify branch coverage at every site.

**Tradeoff:** If most callers want the moved statements, the agent now sees duplicated boilerplate at every call site — the inverse smell.

**Relief:** The function's contract narrows to its single responsibility; callers express variation explicitly; the agent reasons about one body and one branch per caller.

**Trap:** Pushing statements to callers when most callers want them creates duplication the agent must keep in sync across every site — substitutes one smell for another.

**Removes smells:** Divergent Change
