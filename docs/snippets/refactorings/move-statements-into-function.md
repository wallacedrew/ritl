---
name: move-statements-into-function
description: Apply Move Statements into Function when you see Duplicated Code. The function owns its setup and follow-up; the agent verifies behavior at the function definition instead of auditing every call site.
---

# Apply: 44 — Move Statements into Function

**Symptom:** The agent finds the same setup or follow-up code around every call to a function; consistency depends on every caller remembering the pattern.

**Goal:** The function owns its setup and follow-up; the agent verifies behavior at the function definition instead of auditing every call site.

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

**Pressure:** Every caller is a chance to miss the boilerplate or misorder it; the agent verifying consistency must check every site individually.

**Tradeoff:** If some callers genuinely don't want the moved behavior, the function grows a flag argument and the agent must reason about which mode each caller wants.

**Relief:** The agent reasons about the function's full contract from its definition; consistency is enforced by the function, not by convention.

**Trap:** Moving statements into a function some callers don't want adds a flag argument the agent must thread through every call site — substitutes one boilerplate for another.

**Removes smells:** Duplicated Code
