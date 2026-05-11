### Apply: 36 — Extract Superclass

**Target state:** Two classes with substantial shared structure get a common parent that owns the shared bits.

**Why apply it:** Bug fixes and new shared behavior land in one place; the relationship between the classes is documented in code.

**Pitfall:** Inheritance is inflexible — if the duplication is shallow, prefer Extract Class (composition) over Extract Superclass.

```js
// Avoid:
class Employee {
  name;
  id;
  salary;
}
class Department {
  name;
  id;
  budget;
}

// Prefer:
class Party {
  name;
  id;
}
class Employee extends Party {
  salary;
}
class Department extends Party {
  budget;
}
```

**Removes smells:** Duplicated Code, Alternative Classes with Different Interfaces
