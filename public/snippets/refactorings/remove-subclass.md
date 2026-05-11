### Apply: 65 — Remove Subclass

**Target state:** A subclass whose only purpose was to encode a type code or add nothing collapses back into a field on the parent.

**Why apply it:** Smaller hierarchy; new variants are field values instead of new files; the parent regains its variability point as data.

**Pitfall:** Removing a subclass referenced by name elsewhere (factories, registries) breaks those references — confirm no consumer is type-testing the subclass.

```js
// Avoid:
class Person {}
class Female extends Person {}
class Male   extends Person {}

// Prefer:
class Person {
  constructor(gender) { this.gender = gender; }
}
```

**Removes smells:** Lazy Element, Speculative Generality
