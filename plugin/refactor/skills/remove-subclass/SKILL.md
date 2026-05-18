---
name: remove-subclass
description: Apply Remove Subclass when you see Lazy Element, Speculative Generality. The variant becomes a field on the parent; the agent reads variants as data instead of navigating a hierarchy.
---

# Apply: 65 — Remove Subclass

**Symptom:** Empty subclasses that encode a type code without behavior; the agent navigating the hierarchy traverses indirection for what could be a field.

**Goal:** The variant becomes a field on the parent; the agent reads variants as data instead of navigating a hierarchy.

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

**Pressure:** Every new variant is a new file the agent must create; the hierarchy ceremony costs reasoning without behavior payoff.

**Tradeoff:** If the subclass is referenced by name elsewhere (factories, registries, type-tests), removing it silently breaks those references the agent must find and update.

**Relief:** Smaller hierarchy; new variants are field values not new files; the agent reasons about variability as data.

**Trap:** Removing subclasses referenced by factories, registries, or type-tests breaks those references — the agent must find every such consumer before deletion.

**Removes smells:** Lazy Element, Speculative Generality
