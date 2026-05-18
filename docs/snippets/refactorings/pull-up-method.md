---
name: pull-up-method
description: Apply Pull Up Method when you see Duplicated Code, Alternative Classes with Different Interfaces. The method lives on the shared superclass; the agent reasons about one implementation that all subclasses inherit.
---

# Apply: 33 — Pull Up Method

**Symptom:** Two or more subclasses implement the same method identically; the agent verifying behavior must check every subclass and confirm they actually agree.

**Goal:** The method lives on the shared superclass; the agent reasons about one implementation that all subclasses inherit.

```js
// Avoid:
class Manager  extends Employee { name() { return this._name; } }
class Engineer extends Employee { name() { return this._name; } }

// Prefer:
class Employee { name() { return this._name; } }
class Manager  extends Employee {}
class Engineer extends Employee {}
```

**Pressure:** Bug fixes must land in every copy; the agent verifying consistency must update every subclass and risk drift.

**Tradeoff:** If the methods only superficially resemble each other (same name, different semantics), pulling up creates a fake-shared abstraction the agent must constantly disambiguate.

**Relief:** One implementation; the agent reasons about one place for the shared behavior; subclasses focus on what's actually different.

**Trap:** Pulling up superficially-similar methods creates fake-shared behavior the agent must constantly verify means the same thing across subclasses.

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces
