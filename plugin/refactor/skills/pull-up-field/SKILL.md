---
name: pull-up-field
description: Apply Pull Up Field when you see Duplicated Code. The field lives on the parent with one declaration; reading any subclass's storage resolves through inheritance to the parent's one field instead of paying the cost of loading every subclass to verify the declaration matches.
---

# Apply: 63 — Pull Up Field

**Announce first:** name the smell you see and that you're applying Pull Up Field before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Pull Up Field, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A field declared identically across multiple subclasses; the agent verifying changes to the field's shape must update every subclass consistently.

**Goal:** The field lives on the parent with one declaration; reading any subclass's storage resolves through inheritance to the parent's one field instead of paying the cost of loading every subclass to verify the declaration matches.

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

**Relief:** Changes to the field's type or default land in one parent declaration; generated code that constructs any subclass inherits the field without the agent having to verify that N subclasses still agree on the declaration.

**Trap:** Pulling up a field that subclasses use with different defaults or semantic roles creates one declaration the agent reads as shared; generated code that initializes the field at the parent level misses the subclass-specific values the original separate declarations carried.

**Removes smells:** Duplicated Code
