---
name: middle-man
description: Refuse Middle Man when a class whose methods all delegate straight through to another object — no decisions, no transformations. Apply Remove Middle Man, Inline Function.
---

# Refuse: 18 — Middle Man

**Trigger (refuse when you see):** A class whose methods all delegate straight through to another object — no decisions, no transformations.

**Cost of leaving it in:** An entire layer of indirection that adds no value; readers must follow every call to the real implementation.

**Target shape after refactoring:** Callers talk directly to the real object; trivial passthroughs are deleted.

```js
// Smellier:
class Manager {
  reports() {
    return this.team.members();
  }
}

// Fresher:
// Expose team directly when the wrapper adds nothing.
manager.team.members();
```

**Apply refactorings:** Remove Middle Man, Inline Function, Replace Superclass with Delegate, Replace Subclass with Delegate
