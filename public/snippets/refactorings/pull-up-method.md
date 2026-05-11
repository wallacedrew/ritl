### Apply: 33 — Pull Up Method

**Target state:** Methods that subclasses implement identically move to the shared superclass.

**Why apply it:** One implementation, one place to fix; subclasses focus on what's actually different.

**Pitfall:** If the methods only superficially resemble each other, pulling up creates a fake-shared abstraction — unify only when behavior is actually identical.

```js
// Avoid:
class Manager  extends Employee { name() { return this._name; } }
class Engineer extends Employee { name() { return this._name; } }

// Prefer:
class Employee { name() { return this._name; } }
class Manager  extends Employee {}
class Engineer extends Employee {}
```

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces
