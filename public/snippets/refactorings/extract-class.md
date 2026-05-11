### Apply: 39 — Extract Class

**Target state:** A cohesive sub-concept inside a class becomes its own class with its own name, fields, and methods.

**Why apply it:** Each class has one purpose; tests target the small unit; the parent class shrinks.

**Pitfall:** Premature class extraction adds ceremony — extract when 3+ fields and at least one operation cluster around a single concept that the parent class doesn't own.

```js
// Avoid:
class Person {
  name;
  officeAreaCode;
  officeNumber;
  telephoneNumber() { return `(${this.officeAreaCode}) ${this.officeNumber}`; }
}

// Prefer:
class Phone {
  areaCode;
  number;
  toString() { return `(${this.areaCode}) ${this.number}`; }
}
class Person { name; phone; }
```

**Removes smells:** Data Clumps, Temporary Field, Large Class, Primitive Obsession
