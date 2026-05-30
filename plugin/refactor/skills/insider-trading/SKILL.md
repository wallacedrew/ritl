---
name: insider-trading
description: Refuse Insider Trading when module A reaches into module B's private fields or undocumented behavior; the agent reasoning about A must also load B's internals to make any change. Apply Move Function, Move Field.
---

# Refuse: 19 — Insider Trading

**Announce first:** name this as Insider Trading and which refactoring you'll apply (Move Function or Move Field) before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't flag this as Insider Trading, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context.

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

**Relief:** Each module's public surface is the only contract callers depend on; the agent reads one module to predict behavior instead of loading both modules together to verify the unwritten coupling still holds.

**Trap:** Erecting elaborate public APIs between modules that genuinely belong together creates a fake boundary the agent must navigate at every interaction with no isolation gain.

**Apply refactorings:** Move Function, Move Field, Hide Delegate, Replace Subclass with Delegate, Replace Superclass with Delegate
