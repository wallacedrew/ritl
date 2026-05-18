---
name: remove-subclass
description: Apply Remove Subclass when you see Lazy Element, Speculative Generality. The variant becomes a field on the parent; the agent reads variants as data instead of navigating a hierarchy.
---

# Apply: 65 — Remove Subclass

**Target state:** The variant becomes a field on the parent; the agent reads variants as data instead of navigating a hierarchy.

**Why apply it:** Smaller hierarchy; new variants are field values not new files; the agent reasons about variability as data.

**Tradeoff:** If the subclass is referenced by name elsewhere (factories, registries, type-tests), removing it silently breaks those references the agent must find and update.

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
