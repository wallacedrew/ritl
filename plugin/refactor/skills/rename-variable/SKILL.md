---
name: rename-variable
description: Apply Rename Variable when you see Mysterious Name. Variable names carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.
---

# Apply: 07 — Rename Variable

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

**Relief:** Fewer context-lookup hops per reasoning step; planning loops run cheaper and resist drift.

**Trap:** Compulsive renaming generates spurious diffs that crowd the review surface and burn context the human reviewer has to skim past.

**Removes smells:** Mysterious Name
