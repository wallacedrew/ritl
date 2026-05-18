---
name: replace-function-with-command
description: Apply Replace Function with Command when you see Long Function. Sub-steps become named methods sharing state via fields; the agent reasons about each step in isolation and extracts/tests them independently.
---

# Apply: 48 — Replace Function with Command

**Target state:** Sub-steps become named methods sharing state via fields; the agent reasons about each step in isolation and extracts/tests them independently.

**Why apply it:** Each sub-step becomes a named method on the command; the agent extracts and tests them in pieces without rewiring shared state.

**Tradeoff:** Command ceremony (constructor + execute + named private methods) is overhead for functions without genuine multi-step state; the agent now navigates a class where one function used to suffice.

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
