### Refuse: 10 — Data Clumps

**Trigger (refuse when you see):** The same group of fields travels together everywhere — (street, city, zip), (start, end), (firstName, lastName) — appearing as parameters, fields, or method args.

**Cost of leaving it in:** Adding or removing a field of the clump means touching every site; the clump's identity is invisible.

**Target shape after refactoring:** The clump becomes a value object with its own name and its own behavior.

```js
// Smellier:
function send(name, email, street, city, zip) {
  // ...
}

// Fresher:
class Address {
  /* street, city, zip */
}
function send(name, email, address) {
  // ...
}
```

**Apply refactorings:** Extract Class, Introduce Parameter Object, Preserve Whole Object
