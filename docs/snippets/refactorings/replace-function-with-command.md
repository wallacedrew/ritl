### Apply: 48 — Replace Function with Command

**Target state:** A function with rich internal state becomes an object whose methods can share that state — easier to extract, name, and test in pieces.

**Why apply it:** Long sequences become labeled steps; tests target each step on the command; subclasses or strategies can vary parts of the algorithm.

**Pitfall:** Promoting a function to a command adds ceremony (constructor, method calls). Only worth it when the function genuinely needs its own intermediate state or multiple entry points.

```js
// Avoid:
function score(c) {
  // fifty lines using ten locals
}

// Prefer:
class Scorer {
  constructor(c) {
    /* fields */
  }
  execute() {
    return this.compose();
  }
  // named private steps
}
```

**Removes smells:** Long Function
