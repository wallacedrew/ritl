### Refuse: 02 — Duplicated Code

**Trigger (refuse when you see):** The same code structure appears in two or more places — same shape with cosmetic variations, or copy-paste-modify patterns that drift over time.

**Cost of leaving it in:** Bugs need to be fixed in every copy; behavior diverges as copies age, multiplying maintenance cost.

**Target shape after refactoring:** One canonical home per behavior, with parameters for the variations.

```js
// Smellier:
function totalUSD(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
function totalEUR(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

// Fresher:
function lineTotal(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}
```

**Apply refactorings:** Extract Function, Slide Statements, Pull Up Method
