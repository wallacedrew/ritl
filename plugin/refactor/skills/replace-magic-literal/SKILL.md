---
name: replace-magic-literal
description: Apply Replace Magic Literal when you see Mysterious Name, Comments. Bare numbers and strings that encode domain concepts become named constants whose name says what the value represents.
---

# Apply: 43 — Replace Magic Literal

**Target state:** Bare numbers and strings that encode domain concepts become named constants whose name says what the value represents.

**Why apply it:** Searches by domain term find every callsite; changing the value is one edit; the constant invites code-side documentation when it's truly load-bearing.

**Pitfall:** Naming every literal can drown the file in trivia — only name literals that carry domain meaning the surrounding code can't speak.

```js
// Avoid:
function trip(distance) {
  return distance * 1.609;
}

// Prefer:
const KM_PER_MILE = 1.609;
function trip(distance) {
  return distance * KM_PER_MILE;
}
```

**Removes smells:** Mysterious Name, Comments
