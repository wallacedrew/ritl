---
name: refused-bequest
description: Refuse Refused Bequest when a subclass overriding parent methods to no-ops, throwing 'unsupported', or quietly ignoring inherited behavior — the agent cannot trust polymorphic calls on parent-typed references. Apply Push Down Method, Push Down Field.
---

# Refuse: 23 — Refused Bequest

**Symptom:** A subclass overriding parent methods to no-ops, throwing 'unsupported', or quietly ignoring inherited behavior — the agent cannot trust polymorphic calls on parent-typed references.

**Goal:** Sharing happens via composition (a held delegate) instead of forced inheritance; every reference type honors its contract.

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

**Pressure:** Liskov violations: the agent cannot trust subclass instances to honor the parent contract, so polymorphism becomes a trap that the agent must defensively check at every call site.

**Tradeoff:** Composition is more verbose at construction; the agent loses syntactic polymorphism and must verify behavior through explicit delegation calls instead of relying on inheritance dispatch.

**Relief:** Each class has only what it needs; the agent's polymorphic reasoning becomes trustworthy because every reference type honors its declared contract.

**Trap:** Replacing every inheritance relationship with composition, including ones where Liskov genuinely holds, pays construction verbosity at every site without buying any safety the original inheritance didn't provide.

**Apply refactorings:** Push Down Method, Push Down Field, Replace Subclass with Delegate, Replace Superclass with Delegate
