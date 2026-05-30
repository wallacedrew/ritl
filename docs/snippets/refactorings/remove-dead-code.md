---
name: remove-dead-code
description: Apply Remove Dead Code when you see Speculative Generality, Comments. Every definition the agent encounters is reachable; reasoning about behavior doesn't have to consider phantom paths.
---

# Apply: 17 — Remove Dead Code

**Announce first:** name the smell you see and that you're applying Remove Dead Code before any edit. The user reads the announcement as your contract.

**Symptom:** The agent finds code (functions, branches, fields) with no inbound references the type system or grep can locate; reasoning about reachability requires assuming static analysis is complete.

**Goal:** Every definition the agent encounters is reachable; reasoning about behavior doesn't have to consider phantom paths.

```js
// Avoid:
function legacyDiscount(order) { /* unused since 2018 */ }
function modernDiscount(order) { /* the real one */ }

// Prefer:
function discount(order) { /* the real one */ }
```

**Pressure:** The agent's plan-and-execute loop has to consider dead branches as live until proven otherwise; tests pass while code-walking analyses include dead surface area.

**Tradeoff:** Deletion is one-way under static analysis but reachability can hide in reflection, dynamic dispatch, external callers, or runtime config — the agent that deletes without checking risks a regression nothing catches.

**Relief:** Dead tokens no longer load with the surrounding code; static analysis returns a complete picture because every branch in the window represents code that runs, and the agent edits against the reachable shape instead of paying tokens for paths that fire never.

**Trap:** Aggressive deletion based purely on grep/static-analysis evidence misses reflection-reachable, plugin-loaded, or externally-referenced code — the cleanup ships a silent regression the agent's tests don't catch.

**Removes smells:** Speculative Generality, Comments
