---
name: repeated-switches
description: Refuse Repeated Switches when the agent finds the same switch (or if/else chain) over a type code in multiple files; adding a new case requires the agent to grep for every site and update each consistently. Apply Replace Conditional with Polymorphism.
---

# Refuse: 12 — Repeated Switches

**Symptom:** The agent finds the same switch (or if/else chain) over a type code in multiple files; adding a new case requires the agent to grep for every site and update each consistently.

**Goal:** Each case is a class implementing a shared interface; the agent adds a new case by adding one class, and the type checker tells it what's still missing.

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

**Pressure:** Dispatch logic duplicates across files; new cases are easy to miss; chained edits across all switch sites compound the agent's review burden per change.

**Tradeoff:** Polymorphic dispatch is implicit at call sites — the agent can no longer see the full set of branches in one place and must enumerate subclasses across files to reason about behavior.

**Relief:** Adding a new variant is mechanical and the type checker enforces completeness; the agent's plan-and-execute loop for new cases is bounded.

**Trap:** Replacing every switch with polymorphism, even ones with two stable cases, creates a class hierarchy the agent must navigate without buying any extension flexibility.

**Apply refactorings:** Replace Conditional with Polymorphism
