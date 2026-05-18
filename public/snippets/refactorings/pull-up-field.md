---
name: pull-up-field
description: Apply Pull Up Field when you see Duplicated Code. The field lives on the shared parent; the agent reasons about one declaration and one ownership story.
---

# Apply: 63 — Pull Up Field

**Target state:** The field lives on the shared parent; the agent reasons about one declaration and one ownership story.

**Why apply it:** One source of truth for the field's type and default; subclasses focus on what they actually specialize.

**Tradeoff:** If subclasses use the field with different defaults, visibility, or semantic role, pulling up creates surprise behavior the agent must constantly disambiguate.

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
