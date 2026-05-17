---
name: insider-trading
description: Refuse Insider Trading when module A reaches into module B's private fields or undocumented behavior; the agent reasoning about A must also load B's internals to make any change. Apply Move Function, Move Field.
---

# Refuse: 19 — Insider Trading

**Trigger (refuse when you see):** Module A reaches into module B's private fields or undocumented behavior; the agent reasoning about A must also load B's internals to make any change.

**Cost of leaving it in:** Refactoring one module silently breaks the other in ways the type system doesn't catch; the agent must trace cross-module assumptions on every edit.

**Target shape after refactoring:** Cooperation flows through a narrow named interface the agent can read once; A's reasoning context excludes B's implementation details.

```js
// Smellier:
class A { _data; }
class B {
  read(a) {
    return a._data.value;
  }
}

// Fresher:
class A { value() { return this._data.value; } }
class B { read(a) { return a.value(); } }
```

**Apply refactorings:** Move Function, Move Field, Hide Delegate, Replace Subclass with Delegate, Replace Superclass with Delegate
