### Refuse: 09 — Feature Envy

**Trigger (refuse when you see):** A method on class A reaches deeply into class B's data via getters, then computes something B should compute.

**Cost of leaving it in:** Domain logic lives where it's least expected; B's internals leak through public surfaces just to support A's method.

**Target shape after refactoring:** Methods live with the data they care about — B owns the logic over B's fields.

```js
// Smellier:
class Order {
  totalWeight() {
    return this.items.reduce((s, i) => s + i.unitWeight * i.qty, 0);
  }
}

// Fresher:
class Item  { weight()      { return this.unitWeight * this.qty; } }
class Order { totalWeight() { return this.items.reduce((s, i) => s + i.weight(), 0); } }
```

**Apply refactorings:** Move Function, Extract Function
