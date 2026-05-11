### Apply: 56 — Change Reference to Value

**Target state:** An object treated as a sharable record (with setters) becomes a value object — immutable, equal by content, replaced rather than mutated.

**Why apply it:** Concurrency hazards disappear; the type system can mark fields readonly; the object can travel safely across boundaries.

**Pitfall:** Comparison semantics shift from identity to equality — every call site that depended on `===` or identity caches needs review.

```js
// Avoid:
class Phone {
  constructor() {
    this.area = null;
    this.number = null;
  }
}
phone.area = "617";

// Prefer:
class Phone {
  constructor(area, number) {
    this._area = area;
    this._number = number;
  }
  area() {
    return this._area;
  }
  number() {
    return this._number;
  }
  withArea(area) {
    return new Phone(area, this._number);
  }
}
```

**Removes smells:** Mutable Data
