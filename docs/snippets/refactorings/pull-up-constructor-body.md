---
name: pull-up-constructor-body
description: Apply Pull Up Constructor Body when you see Duplicated Code. Initialization code repeated across subclass constructors moves into the parent class's constructor and is called via super.
---

# Apply: 62 — Pull Up Constructor Body

**Target state:** Initialization code repeated across subclass constructors moves into the parent class's constructor and is called via super.

**Why apply it:** One canonical home for parent-state init; new subclasses inherit the setup for free; bug fixes apply uniformly.

**Pitfall:** If only some subclasses share the init logic, pulling it up forces the others to opt out — verify the body is genuinely common.

```js
// Avoid:
class Manager extends Employee {
  constructor(n, s) {
    this.name = n;
    this.salary = s;
  }
}
class Engineer extends Employee {
  constructor(n, s) {
    this.name = n;
    this.salary = s;
  }
}

// Prefer:
class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }
}
class Manager extends Employee {}
class Engineer extends Employee {}
```

**Removes smells:** Duplicated Code
