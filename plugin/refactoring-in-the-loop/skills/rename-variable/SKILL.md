---
name: rename-variable
description: Apply Rename Variable when you see Mysterious Name. Variable names match the domain role they play, not their implementation type or scratch nature.
---

# Apply: 07 — Rename Variable

**Target state:** Variable names match the domain role they play, not their implementation type or scratch nature.

**Why apply it:** Reading the variable's name tells you everything you need without checking its definition.

**Pitfall:** A rename is small but cross-file; ensure your tooling catches every reference (including string templates and comments).

```js
// Avoid:
const a = height * width;

// Prefer:
const area = height * width;
```

**Removes smells:** Mysterious Name
