### Refuse: 19 — Insider Trading

**Trigger (refuse when you see):** Modules reach into each other's internals to coordinate behavior, bypassing public interfaces.

**Cost of leaving it in:** Coupling at the implementation level — refactoring one breaks the other in non-obvious ways.

**Target shape after refactoring:** Cooperation happens through narrow, explicit interfaces; secrets stay secret.

```js
// Smellier:
class A {
  _data;
}
class B {
  read(a) {
    return a._data.value;
  }
}

// Fresher:
class A {
  value() {
    return this._data.value;
  }
}
class B {
  read(a) {
    return a.value();
  }
}
```

**Apply refactorings:** Move Function, Move Field, Hide Delegate, Replace Subclass with Delegate, Replace Superclass with Delegate
