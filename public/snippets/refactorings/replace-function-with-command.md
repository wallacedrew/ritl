---
name: replace-function-with-command
description: Apply Replace Function with Command when you see Long Function. Sub-steps become named methods sharing state via fields; the agent reasons about each step in isolation and extracts/tests them independently.
---

# Apply: 48 — Replace Function with Command

**Symptom:** A function whose body holds many shared locals across conceptually distinct sub-steps; the agent extracting any step must thread temps through helper parameters.

**Goal:** Sub-steps become named methods sharing state via fields; the agent reasons about each step in isolation and extracts/tests them independently.

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

**Pressure:** Every step the agent wants to extract drags shared state through parameter lists; the function's algorithm shape resists decomposition.

**Tradeoff:** Command ceremony (constructor + execute + named private methods) is overhead for functions without genuine multi-step state; the agent now navigates a class where one function used to suffice.

**Relief:** Each sub-step becomes a named method on the command; the agent extracts and tests them in pieces without rewiring shared state.

**Trap:** Promoting every long function to a command — including ones with no genuine shared state — adds class ceremony the agent must navigate without gaining any decomposition advantage.

**Removes smells:** Long Function
