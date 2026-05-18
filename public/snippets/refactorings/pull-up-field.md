---
name: pull-up-field
description: Apply Pull Up Field when you see Duplicated Code. The field lives on the shared parent; the agent reasons about one declaration and one ownership story.
---

# Apply: 63 — Pull Up Field

**Symptom:** A field declared identically across multiple subclasses; the agent verifying changes to the field's shape must update every subclass consistently.

**Goal:** The field lives on the shared parent; the agent reasons about one declaration and one ownership story.

```js
// Avoid:
class Manager  extends Employee { _name; }
class Engineer extends Employee { _name; }

// Prefer:
class Employee { _name; }
class Manager  extends Employee {}
class Engineer extends Employee {}
```

**Pressure:** Refactoring the field's type or default requires the agent to touch every subclass; consistency drift hides bugs.

**Tradeoff:** If subclasses use the field with different defaults, visibility, or semantic role, pulling up creates surprise behavior the agent must constantly disambiguate.

**Relief:** One source of truth for the field's type and default; subclasses focus on what they actually specialize.

**Trap:** Pulling up fields with divergent semantic roles creates a shared declaration that masks subclass-specific behavior the agent must constantly re-verify.

**Removes smells:** Duplicated Code
