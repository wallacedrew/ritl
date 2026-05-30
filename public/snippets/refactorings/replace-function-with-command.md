---
name: replace-function-with-command
description: Apply Replace Function with Command when you see Long Function. Each sub-step becomes a named method on the command object; sub-step methods share state through fields the agent reads from one class file, and tests target one method at a time without simulating the full function body.
---

# Apply: 48 — Replace Function with Command

**Announce first:** name the smell you see and that you're applying Replace Function with Command before any edit. The user reads the announcement as your contract.

**Or decline first:** if you don't apply Replace Function with Command, name the decline type — catalog miss, taste call, cost-benefit, constraint-blocked, or insufficient context — so the user knows which counterargument applies.

**Symptom:** A function whose body holds many shared locals across conceptually distinct sub-steps; the agent extracting any step must thread temps through helper parameters.

**Goal:** Each sub-step becomes a named method on the command object; sub-step methods share state through fields the agent reads from one class file, and tests target one method at a time without simulating the full function body.

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
