---
name: repeated-switches
description: Refuse Repeated Switches when the same switch (or if/else chain) over a type code appears in multiple places — adding a new case means hunting them all down. Apply Replace Conditional with Polymorphism.
---

# Refuse: 12 — Repeated Switches

**Trigger (refuse when you see):** The same switch (or if/else chain) over a type code appears in multiple places — adding a new case means hunting them all down.

**Cost of leaving it in:** Dispatch logic is duplicated across the codebase; new cases are easy to miss; the type-code couple amplifies.

**Target shape after refactoring:** Each case is a class implementing a shared interface; dispatch happens once via a virtual call.

```js
// Smellier:
switch (event.kind) {
  case "click":
    return onClick(event);
  case "key":
    return onKey(event);
  case "drag":
    return onDrag(event);
}

// Fresher:
event.handle(); // ClickEvent, KeyEvent, DragEvent each implement handle()
```

**Apply refactorings:** Replace Conditional with Polymorphism
