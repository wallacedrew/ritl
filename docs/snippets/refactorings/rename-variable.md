---
name: rename-variable
description: Apply Rename Variable when you see Mysterious Name. Variable names carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.
---

# Apply: 07 — Rename Variable

**Target state:** Variable names carry enough disambiguating information that the agent can reason about each symbol without a lookup hop.

**Why apply it:** Fewer context-lookup hops per reasoning step; planning loops run cheaper and resist drift.

**Tradeoff:** Renames invalidate cached associations — commit history, RAG snippets, embedding indexes, and prior conversation context all carry the old name until they refresh.

```js
// Avoid:
const a = height * width;

// Prefer:
const area = height * width;
```

**Removes smells:** Mysterious Name
