### Refuse: 23 — Refused Bequest

**Trigger (refuse when you see):** A subclass inherits methods or fields it doesn't actually use — overriding to no-ops, throwing 'unsupported', or just ignoring the inheritance.

**Cost of leaving it in:** Liskov violations: callers can't trust subclass instances to honor the parent contract; polymorphism becomes a trap.

**Target shape after refactoring:** Sharing happens through composition (a delegate object) rather than forced inheritance.

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
