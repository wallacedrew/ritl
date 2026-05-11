---
name: preserve-whole-object
description: Apply Preserve Whole Object when you see Long Parameter List, Data Clumps. Instead of pulling several values out of an object to pass them in, pass the object itself.
---

# Apply: 30 — Preserve Whole Object

**Target state:** Instead of pulling several values out of an object to pass them in, pass the object itself.

**Why apply it:** Signatures shrink; adding a needed field is internal; consumers don't have to plumb new arguments through.

**Pitfall:** Passing the whole object adds coupling to its full surface — only do this when the called function might reasonably need other parts of the object.

```js
// Avoid:
if (room.lowTemp < range.low || room.highTemp > range.high) { /* ... */ }

// Prefer:
if (range.includes(room)) { /* ... */ }
```

**Removes smells:** Long Parameter List, Data Clumps
