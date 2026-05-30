---
name: refused-bequest
description: Refuse Refused Bequest when a subclass overrides parent methods with no-ops or 'unsupported' throws; code generated against the parent's interface that calls the inherited method against this subclass produces a runtime failure the type checker accepted. Apply Push Down Method, Push Down Field.
---

# Refuse: 23 — Refused Bequest

**Announce first:** name this as Refused Bequest and which refactoring you'll apply (Push Down Method or Push Down Field) before any edit. The user reads the announcement as your contract.

**Symptom:** A subclass overrides parent methods with no-ops or 'unsupported' throws; code generated against the parent's interface that calls the inherited method against this subclass produces a runtime failure the type checker accepted.

**Goal:** Behavior reuse runs through a held collaborator instead of through inheritance; generated code that calls a method on a reference type runs the method the type's signature promises.

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

**Relief:** Code generated against a reference type's interface executes the methods that type defines; calls dispatched against the type signature do not silently fall through to no-op overrides.

**Trap:** Replacing inheritance with composition on hierarchies where every subclass honors the parent's contract adds forwarding methods at every site without changing what the agent's generated calls do; the tokens spent on the rewrite buy no behavioral guarantee the inheritance did not already provide.

**Apply refactorings:** Push Down Method, Push Down Field, Replace Subclass with Delegate, Replace Superclass with Delegate
