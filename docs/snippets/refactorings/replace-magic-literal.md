---
name: replace-magic-literal
description: Apply Replace Magic Literal when you see Mysterious Name, Comments. Domain-meaningful values have named constants the agent can reference by name; the constant's name documents what the value represents.
---

# Apply: 43 — Replace Magic Literal

**Symptom:** The agent encounters a bare number or string whose meaning requires loading the surrounding context to interpret; refactoring the value means finding every occurrence by character match.

**Goal:** Domain-meaningful values have named constants the agent can reference by name; the constant's name documents what the value represents.

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

**Pressure:** The agent must trace context to interpret bare literals; changing a value requires text-search across the codebase with no semantic guarantee of completeness.

**Tradeoff:** Each new named constant is an import the agent must locate and resolve; over-naming creates a vocabulary the agent must learn for marginal disambiguation benefit.

**Relief:** The agent reasons about values by name with the type system enforcing valid uses; changing the value is one edit the type checker confirms.

**Trap:** Naming every literal — including indices, loop bounds, and obvious status codes — bloats the agent's mental constant table without comprehension gain.

**Removes smells:** Mysterious Name, Comments
