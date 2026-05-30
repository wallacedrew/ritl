---
name: pull-up-method
description: Apply Pull Up Method when you see Duplicated Code, Alternative Classes with Different Interfaces. The method lives on the parent with one implementation; queries about behavior across subclasses load one method body instead of paying the token cost of loading N near-identical bodies.
---

# Apply: 33 — Pull Up Method

**Announce first:** name the smell you see and that you're applying Pull Up Method before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Pull Up Method, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** Two or more subclasses implement the same method identically; the agent verifying behavior must check every subclass and confirm they actually agree.

**Goal:** The method lives on the parent with one implementation; queries about behavior across subclasses load one method body instead of paying the token cost of loading N near-identical bodies.

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

**Relief:** Edits to the shared behavior land in one parent method; the agent does not load N subclass bodies to verify they still agree, and generated code that calls the method from any subclass dispatches to the same implementation.

**Trap:** Pulling up methods that share a name but not behavior produces one parent method the agent reads as canonical; generated code that calls the method from any subclass runs the parent's behavior, dropping the subclass-specific work the original separate methods performed.

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces
