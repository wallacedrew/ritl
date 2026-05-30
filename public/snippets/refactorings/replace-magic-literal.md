---
name: replace-magic-literal
description: Apply Replace Magic Literal when you see Mysterious Name, Comments. Each domain value has a named constant at one declaration site; every usage resolves through the constant's name, and the value's meaning loads with the name instead of being inferred from context at every literal occurrence.
---

# Apply: 43 — Replace Magic Literal

**Announce first:** name the smell you see and that you're applying Replace Magic Literal before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Replace Magic Literal, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** The agent encounters a bare number or string whose meaning requires loading the surrounding context to interpret; refactoring the value means finding every occurrence by character match.

**Goal:** Each domain value has a named constant at one declaration site; every usage resolves through the constant's name, and the value's meaning loads with the name instead of being inferred from context at every literal occurrence.

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

**Tradeoff:** Each named constant adds an import the agent loads at every consumer; the cost is one file load per consumer file in exchange for one definition site for the value.

**Relief:** Changing the value happens at one constant declaration; the agent does not grep for every literal occurrence and verify each by hand, and generated code that references the constant by name picks up the new value at the next build.

**Trap:** Naming every literal — including indices, loop bounds, and obvious status codes — bloats the agent's mental constant table without comprehension gain.

**Removes smells:** Mysterious Name, Comments
