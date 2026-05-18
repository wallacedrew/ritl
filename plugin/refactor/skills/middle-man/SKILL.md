---
name: middle-man
description: Refuse Middle Man when a class whose methods all delegate straight through to another object — the agent traces every call to the real implementation, paying a hop for no decision. Apply Remove Middle Man, Inline Function.
---

# Refuse: 18 — Middle Man

**Symptom:** A class whose methods all delegate straight through to another object — the agent traces every call to the real implementation, paying a hop for no decision.

**Goal:** Callers talk to the real object directly; the agent's call traces are shorter and the real implementation's location is obvious.

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

**Pressure:** An entire indirection layer the agent must navigate per method; the agent reading code through the middle man re-traces the delegation on every reasoning step.

**Tradeoff:** Direct access exposes the underlying object's full surface to every consumer; the agent loses any encapsulation the middle man was providing (even if mostly cosmetic).

**Relief:** Fewer files; shorter call stacks; the agent's plan-and-execute loop touches the real implementation directly without the passthrough hop.

**Trap:** Deleting a passthrough that was actually doing real work — authorization, validation, auditing — removes a load-bearing layer the agent didn't recognize because the trivial-looking delegation masked it.

**Apply refactorings:** Remove Middle Man, Inline Function, Replace Superclass with Delegate, Replace Subclass with Delegate
