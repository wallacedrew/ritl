---
name: repeated-switches
description: Refuse Repeated Switches when the agent finds the same switch (or if/else chain) over a type code in multiple files; adding a new case requires the agent to grep for every site and update each consistently. Apply Replace Conditional with Polymorphism.
---

# Refuse: 12 — Repeated Switches

**Trigger (refuse when you see):** The agent finds the same switch (or if/else chain) over a type code in multiple files; adding a new case requires the agent to grep for every site and update each consistently.

**Cost of leaving it in:** Dispatch logic duplicates across files; new cases are easy to miss; chained edits across all switch sites compound the agent's review burden per change.

**Target shape after refactoring:** Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type checker tells it what's still missing.

```js
// Smellier:
switch (event.kind) {
  case 'click': return onClick(event);
  case 'key':   return onKey(event);
  case 'drag':  return onDrag(event);
}

// Fresher:
event.handle(); // ClickEvent, KeyEvent, DragEvent each implement handle()
```

**Apply refactorings:** Replace Conditional with Polymorphism
