### Refuse: 13 — Loops

**Trigger (refuse when you see):** Imperative for/while loops obscuring what the loop is producing — filter, map, reduce mixed together by hand.

**Cost of leaving it in:** Reader must mentally execute the loop to learn the result; off-by-one errors and accumulator bugs hide in the body.

**Target shape after refactoring:** The transformation reads as a sequence of named operations: filter, map, reduce.

```js
// Smellier:
const seniors = [];
for (const u of users) {
  if (u.age >= 65) seniors.push(u.name);
}

// Fresher:
const seniors = users.filter((u) => u.age >= 65).map((u) => u.name);
```

**Apply refactorings:** Replace Loop with Pipeline
