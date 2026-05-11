### Refuse: 01 — Mysterious Name

**Trigger (refuse when you see):** Identifiers that don't reveal intent — names like aFunc(), x, theData, temp, or one-letter loop variables that force every reader to reverse-engineer the code's purpose.

**Cost of leaving it in:** Every reading is a re-comprehension cost; bugs sneak in because what code does diverges from what its name suggests. Compounds in proportion to how many readers (humans + LLMs) touch the file.

**Target shape after refactoring:** Names read as the domain — a function's purpose, a variable's role, a class's responsibility — visible in one glance.

```js
// Smellier:
function calc(d, t) {
  return d * t;
}

// Fresher:
function distance(speed, time) {
  return speed * time;
}
```

**Apply refactorings:** Change Function Declaration, Rename Variable, Rename Field
