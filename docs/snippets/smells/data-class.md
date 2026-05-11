### Refuse: 22 — Data Class

**Trigger (refuse when you see):** A class that holds fields with getters and setters but no behavior — and consumers do all the operations on it externally.

**Cost of leaving it in:** Domain logic gets scattered to consumers; the class's data invariants aren't enforced; encapsulation is theater.

**Target shape after refactoring:** Behavior that belongs with the data lives on the class; the class becomes a real domain object.

```js
// Smellier:
class Address {
  street;
  city;
  zip;
}
function format(a) {
  return `${a.street}, ${a.city} ${a.zip}`;
}

// Fresher:
class Address {
  format() {
    return `${this.street}, ${this.city} ${this.zip}`;
  }
}
```

**Apply refactorings:** Encapsulate Record, Remove Setting Method, Move Function, Extract Function, Split Phase
