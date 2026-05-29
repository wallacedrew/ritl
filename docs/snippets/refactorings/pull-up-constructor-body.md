---
name: pull-up-constructor-body
description: Apply Pull Up Constructor Body when you see Duplicated Code. Shared initialization lives in the parent's constructor and runs via super; subclass constructors hold only their specific setup, and the agent reads one canonical init for parent-state setup.
---

# Apply: 62 — Pull Up Constructor Body

**Symptom:** Multiple subclass constructors initialize the same parent fields with the same logic; the agent verifying constructors must check every subclass for consistency.

**Goal:** Shared initialization lives in the parent's constructor and runs via super; subclass constructors hold only their specific setup, and the agent reads one canonical init for parent-state setup.

```js
// Avoid:
class Manager  extends Employee { constructor(n, s) { this.name = n; this.salary = s; } }
class Engineer extends Employee { constructor(n, s) { this.name = n; this.salary = s; } }

// Prefer:
class Employee {
  constructor(name, salary) { this.name = name; this.salary = salary; }
}
class Manager  extends Employee {}
class Engineer extends Employee {}
```

**Pressure:** Bug fixes in init logic must land in every subclass; the agent must update each consistently or risk silent drift.

**Tradeoff:** Subclasses that need different parent-state setup pay the cost of overriding the pulled-up init or passing flags through super; the agent reading those overrides loads both the parent's shared init and the subclass's override to predict what runs.

**Relief:** New subclasses inherit the parent's init without re-declaring it; edits to the shared setup land in one constructor and the agent loads one body to verify the change instead of N near-identical subclass constructors.

**Trap:** Pulling up init logic only some subclasses need forces the others to override with awkward opt-outs the agent must reason about.

**Removes smells:** Duplicated Code
