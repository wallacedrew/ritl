---
name: move-statements-into-function
description: Apply Move Statements into Function when you see Duplicated Code. The function owns its setup and follow-up; the agent verifies behavior at the function definition instead of auditing every call site.
---

# Apply: 44 — Move Statements into Function

**Target state:** The function owns its setup and follow-up; the agent verifies behavior at the function definition instead of auditing every call site.

**Why apply it:** The agent reasons about the function's full contract from its definition; consistency is enforced by the function, not by convention.

**Tradeoff:** If some callers genuinely don't want the moved behavior, the function grows a flag argument and the agent must reason about which mode each caller wants.

```js
// Avoid:
log('start fetch');
const data  = fetch(url);
log('start fetch');
const data2 = fetch(url2);

// Prefer:
function fetchLogged(url) {
  log('start fetch');
  return fetch(url);
}
```

**Removes smells:** Duplicated Code
