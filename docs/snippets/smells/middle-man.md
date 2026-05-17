---
name: middle-man
description: Refuse Middle Man when a class whose methods all delegate straight through to another object — the agent traces every call to the real implementation, paying a hop for no decision. Apply Remove Middle Man, Inline Function.
---

# Refuse: 18 — Middle Man

**Trigger (refuse when you see):** A class whose methods all delegate straight through to another object — the agent traces every call to the real implementation, paying a hop for no decision.

**Cost of leaving it in:** An entire indirection layer the agent must navigate per method; the agent reading code through the middle man re-traces the delegation on every reasoning step.

**Target shape after refactoring:** Callers talk to the real object directly; the agent's call traces are shorter and the real implementation's location is obvious.

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
