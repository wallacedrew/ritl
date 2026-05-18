---
name: replace-error-code-with-exception
description: Apply Replace Error Code with Exception when you see Comments. Failures throw exceptions the agent reasons about as separate control flow; the type system marks the failure path.
---

# Apply: 60 — Replace Error Code with Exception

**Target state:** Failures throw exceptions the agent reasons about as separate control flow; the type system marks the failure path.

**Why apply it:** The agent reasons about success and failure paths separately; cleanup happens via finally / try-with; forgetting to handle no longer silently swallows.

**Tradeoff:** Exceptions for predictable conditions misuse the mechanism; the agent ships try/catch around expected outcomes that should be values.

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

**Removes smells:** Comments
