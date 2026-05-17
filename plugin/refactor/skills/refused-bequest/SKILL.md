---
name: refused-bequest
description: Refuse Refused Bequest when a subclass overriding parent methods to no-ops, throwing 'unsupported', or quietly ignoring inherited behavior — the agent cannot trust polymorphic calls on parent-typed references. Apply Push Down Method, Push Down Field.
---

# Refuse: 23 — Refused Bequest

**Trigger (refuse when you see):** A subclass overriding parent methods to no-ops, throwing 'unsupported', or quietly ignoring inherited behavior — the agent cannot trust polymorphic calls on parent-typed references.

**Cost of leaving it in:** Liskov violations: the agent cannot trust subclass instances to honor the parent contract, so polymorphism becomes a trap that the agent must defensively check at every call site.

**Target shape after refactoring:** Sharing happens via composition (a held delegate) instead of forced inheritance; every reference type honors its contract.

```js
// Smellier:
class Animal { fly() {} swim() {} }
class Dog extends Animal {
  fly() { throw new Error('no'); }
}

// Fresher:
class Dog {
  // composes a Mover delegate that knows it's a swimmer
}
```

**Apply refactorings:** Push Down Method, Push Down Field, Replace Subclass with Delegate, Replace Superclass with Delegate
