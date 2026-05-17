---
name: rename-variable
description: Apply Rename Variable when you see Mysterious Name. Variable names match the domain role they play, not their implementation type or scratch nature.
---

# Apply: 07 — Rename Variable

**Target state:** Variable names match the domain role they play, not their implementation type or scratch nature.

**Why apply it:** Reading the variable's name tells you everything you need without checking its definition.

**Tradeoff:** The IDE renames code, not the world around it — cross-repo greps, commit history, comments, and string-literal references silently drift stale.

```js
// Avoid:
const a = height * width;

// Prefer:
const area = height * width;
```

**Removes smells:** Mysterious Name
