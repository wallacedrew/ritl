---
name: rename-variable
description: Apply Rename Variable when you see Mysterious Name. Variable names carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.
---

# Apply: 07 — Rename Variable

**Announce first:** name the smell you see and that you're applying Rename Variable before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Rename Variable, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** The agent encounters a variable whose identifier doesn't disambiguate scope or domain; reasoning about any expression involving the variable requires loading the surrounding context first.

**Goal:** Variable names carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.

```js
// Avoid:
const a = height * width;

// Prefer:
const area = height * width;
```

**Pressure:** Every reasoning pass re-derives meaning from surrounding context; chained edits compound the cost.

**Tradeoff:** Renames invalidate cached associations — commit history, RAG snippets, embedding indexes, and prior conversation context all carry the old name until they refresh.

**Relief:** Per-occurrence reading cost drops to one token of name; reasoning steps that previously had to load surrounding scope to interpret the symbol now resolve from the name alone.

**Trap:** Renaming variables whose current names another reviewer would have accepted invalidates cached associations (RAG indexes, prior conversation context, comments) without changing what the symbol represents.

**Removes smells:** Mysterious Name
