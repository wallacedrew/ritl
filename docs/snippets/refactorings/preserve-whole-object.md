---
name: preserve-whole-object
description: Apply Preserve Whole Object when you see Long Parameter List, Data Clumps. The function takes the object; the agent updates one place when the function needs new fields.
---

# Apply: 30 — Preserve Whole Object

**Target state:** The function takes the object; the agent updates one place when the function needs new fields.

**Why apply it:** Signatures shrink; adding a needed field is an internal change; the agent reasons about one parameter at every call.

**Tradeoff:** Passing the whole object couples the function to the object's full surface; the agent reasoning about the function must consider what other fields it might quietly read.

```js
// Avoid:
if (room.lowTemp < range.low || room.highTemp > range.high) { /* ... */ }

// Prefer:
if (range.includes(room)) { /* ... */ }
```

**Removes smells:** Long Parameter List, Data Clumps
