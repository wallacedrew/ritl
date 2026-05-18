---
name: pull-up-method
description: Apply Pull Up Method when you see Duplicated Code, Alternative Classes with Different Interfaces. The method lives on the shared superclass; the agent reasons about one implementation that all subclasses inherit.
---

# Apply: 33 — Pull Up Method

**Target state:** The method lives on the shared superclass; the agent reasons about one implementation that all subclasses inherit.

**Why apply it:** One implementation; the agent reasons about one place for the shared behavior; subclasses focus on what's actually different.

**Tradeoff:** If the methods only superficially resemble each other (same name, different semantics), pulling up creates a fake-shared abstraction the agent must constantly disambiguate.

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
