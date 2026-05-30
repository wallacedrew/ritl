---
name: replace-error-code-with-exception
description: Apply Replace Error Code with Exception when you see Comments. Failures throw exceptions the agent reasons about as separate control flow; the type system marks the failure path.
---

# Apply: 60 — Replace Error Code with Exception

**Announce first:** name the smell you see and that you're applying Replace Error Code with Exception before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Replace Error Code with Exception, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** The agent finds functions returning numeric or string codes for failure; verifying error handling requires the agent to trace every caller and check whether the code is inspected.

**Goal:** Failures throw exceptions the agent reasons about as separate control flow; the type system marks the failure path.

```js
// Avoid:
function withdraw(amount) {
  if (amount > balance) return -1;
  balance -= amount;
  return 0;
}

// Prefer:
function withdraw(amount) {
  if (amount > balance) throw new InsufficientFunds();
  balance -= amount;
}
```

**Pressure:** Every caller is a chance to silently swallow the error; the agent verifying correctness must audit every call site for the check.

**Tradeoff:** Exceptions for predictable conditions misuse the mechanism; the agent ships try/catch around expected outcomes that should be values.

**Relief:** The agent reasons about success and failure paths separately; cleanup happens via finally / try-with; forgetting to handle no longer silently swallows.

**Trap:** Throwing for predictable conditions (not-found, validation failure) makes expected outcomes look like bugs to the agent reading the catch blocks.

**Removes smells:** Comments
