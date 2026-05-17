---
name: replace-error-code-with-exception
description: Apply Replace Error Code with Exception when you see Comments. Numeric or string error codes that callers must remember to check are replaced with exceptions that propagate by default.
---

# Apply: 60 — Replace Error Code with Exception

**Target state:** Numeric or string error codes that callers must remember to check are replaced with exceptions that propagate by default.

**Why apply it:** Forgetting to check no longer silently swallows the error; the type system marks the failure path; cleanup happens via finally / try-with.

**Tradeoff:** Exceptions for predictable conditions misuse the mechanism — only convert codes that represent genuine, exceptional, unrecoverable failures.

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
