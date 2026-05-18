---
name: insider-trading
description: Refuse Insider Trading when module A reaches into module B's private fields or undocumented behavior; the agent reasoning about A must also load B's internals to make any change. Apply Move Function, Move Field.
---

# Refuse: 19 — Insider Trading

**Symptom:** Module A reaches into module B's private fields or undocumented behavior; the agent reasoning about A must also load B's internals to make any change.

**Goal:** Cooperation flows through a narrow named interface the agent can read once; A's reasoning context excludes B's implementation details.

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

**Pressure:** Refactoring one module silently breaks the other in ways the type system doesn't catch; the agent must trace cross-module assumptions on every edit.

**Tradeoff:** Defining a real public interface adds a contract the agent must respect at both ends; until the interface stabilizes, every change forces synchronized edits across both modules.

**Relief:** Module boundaries become real seams the agent can reason about independently; tests exercise the public surface and refactoring stays local.

**Trap:** Erecting elaborate public APIs between modules that genuinely belong together creates a fake boundary the agent must navigate at every interaction with no isolation gain.

**Apply refactorings:** Move Function, Move Field, Hide Delegate, Replace Subclass with Delegate, Replace Superclass with Delegate
