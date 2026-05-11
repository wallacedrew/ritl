### Apply: 49 — Replace Command with Function

**Target state:** A command object whose execute() does everything in one shot collapses back to a plain function.

**Why apply it:** Fewer files, fewer constructors, less indirection — the caller sees one function instead of build-then-execute.

**Pitfall:** If the command holds genuinely useful intermediate state, flattening to a function regrows the temps it eliminated — confirm there's no real reuse first.

```js
// Avoid:
class ChargeCalculator {
  constructor(c, o) {
    this.c = c;
    this.o = o;
  }
  execute() {
    return this.c.base + this.o.tax;
  }
}
new ChargeCalculator(c, o).execute();

// Prefer:
function charge(c, o) {
  return c.base + o.tax;
}
charge(c, o);
```

**Removes smells:** Speculative Generality, Lazy Element
