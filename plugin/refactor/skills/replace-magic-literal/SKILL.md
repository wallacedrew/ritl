---
name: replace-magic-literal
description: Apply Replace Magic Literal when you see Mysterious Name, Comments. Domain-meaningful values have named constants the agent can reference by name; the constant's name documents what the value represents.
---

# Apply: 43 — Replace Magic Literal

**Target state:** Domain-meaningful values have named constants the agent can reference by name; the constant's name documents what the value represents.

**Why apply it:** The agent reasons about values by name with the type system enforcing valid uses; changing the value is one edit the type checker confirms.

**Tradeoff:** Each new named constant is an import the agent must locate and resolve; over-naming creates a vocabulary the agent must learn for marginal disambiguation benefit.

```js
// Avoid:
function trip(distance) {
  return distance * 1.609;
}

// Prefer:
const KM_PER_MILE = 1.609;
function trip(distance) {
  return distance * KM_PER_MILE;
}
```

**Removes smells:** Mysterious Name, Comments
