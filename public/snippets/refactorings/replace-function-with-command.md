---
name: replace-function-with-command
description: Apply Replace Function with Command when you see Long Function. A function with rich internal state becomes an object whose methods can share that state — easier to extract, name, and test in pieces.
---

# Apply: 48 — Replace Function with Command

**Target state:** A function with rich internal state becomes an object whose methods can share that state — easier to extract, name, and test in pieces.

**Why apply it:** Long sequences become labeled steps; tests target each step on the command; subclasses or strategies can vary parts of the algorithm.

**Tradeoff:** Promoting a function to a command adds ceremony (constructor, method calls). Only worth it when the function genuinely needs its own intermediate state or multiple entry points.

```js
// Avoid:
function score(candidate) {
  let total = candidate.experience * 10;
  if (candidate.hasCertifications) total += 25;
  total -= candidate.gaps * 5;
  total += candidate.referrals * 8;
  return total;
}

// Prefer:
class Scorer {
  constructor(candidate) { this.candidate = candidate; }
  execute() {
    return this.base() + this.bonus() - this.penalty();
  }
  base()    { return this.candidate.experience * 10 + (this.candidate.hasCertifications ? 25 : 0); }
  bonus()   { return this.candidate.referrals * 8; }
  penalty() { return this.candidate.gaps * 5; }
}
new Scorer(candidate).execute();
```

**Removes smells:** Long Function
