---
name: pull-up-field
description: Apply Pull Up Field when you see Duplicated Code. A field declared identically in two or more subclasses moves to the shared superclass.
---

# Apply: 63 — Pull Up Field

**Target state:** A field declared identically in two or more subclasses moves to the shared superclass.

**Why apply it:** One source of truth for the field's type and default; subclasses focus on what they actually specialize.

**Tradeoff:** Pulling up a field that subclasses use differently (different default, different visibility) creates surprise — verify the field semantics are identical.

```js
// Avoid:
class Manager  extends Employee { _name; }
class Engineer extends Employee { _name; }

// Prefer:
class Employee { _name; }
class Manager  extends Employee {}
class Engineer extends Employee {}
```

**Removes smells:** Duplicated Code
