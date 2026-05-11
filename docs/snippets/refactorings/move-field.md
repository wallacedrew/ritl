### Apply: 13 — Move Field

**Target state:** Each field belongs to the class that owns its lifecycle; cross-class reaching disappears.

**Why apply it:** Class boundaries align with data ownership; mutations are local; refactoring becomes safer.

**Pitfall:** Moving a field disturbs every reader — refactor in tooling-supported steps and add a temporary accessor on the original class while migrating.

```js
// Avoid:
class Customer {
  plan;
  discountRate;
}

// Prefer:
class Plan {
  discountRate;
}
class Customer {
  plan; /* discountRate accessed via plan */
}
```

**Removes smells:** Shotgun Surgery, Insider Trading
