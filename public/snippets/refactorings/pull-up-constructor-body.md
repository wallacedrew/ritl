---
name: pull-up-constructor-body
description: Apply Pull Up Constructor Body when you see Duplicated Code. The shared init lives in the parent's constructor and is called via super; the agent reasons about one initialization path.
---

# Apply: 62 — Pull Up Constructor Body

**Target state:** The shared init lives in the parent's constructor and is called via super; the agent reasons about one initialization path.

**Why apply it:** One canonical init; new subclasses inherit for free; the agent reasons about parent-state setup in one place.

**Tradeoff:** If only some subclasses share the init logic, pulling it up forces the others to override or opt out; the agent verifying must check whether the shared init is genuinely common.

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

**Removes smells:** Duplicated Code
