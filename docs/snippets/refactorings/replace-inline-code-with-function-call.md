---
name: replace-inline-code-with-function-call
description: Apply Replace Inline Code with Function Call when you see Duplicated Code. One canonical implementation the agent loads once and references everywhere; the name labels the intent at every call site.
---

# Apply: 46 — Replace Inline Code with Function Call

**Symptom:** The agent finds inline code that reproduces the body of a named function elsewhere in the codebase; consistency depends on both implementations staying in sync.

**Goal:** One canonical implementation the agent loads once and references everywhere; the name labels the intent at every call site.

```js
// Avoid:
const inRange = candidate >= low && candidate <= high;

// Prefer:
const inRange = between(candidate, low, high);
```

**Pressure:** Two implementations drift over time; the agent verifying changes must update both or risk inconsistency the type checker doesn't catch.

**Tradeoff:** If the existing function's name doesn't quite match the local intent, the agent reads the call site as a near-miss and must verify the semantic match at every replacement.

**Relief:** The agent reasons about one definition; future improvements reach every site that used to inline; consistency is enforced by reference.

**Trap:** Replacing inline code with a call to a poorly-named function smears semantic mismatch across the codebase — the agent must constantly verify that the function's name still describes the local use.

**Removes smells:** Duplicated Code
