---
name: replace-conditional-logic-with-strategy
description: Apply Replace Conditional Logic with Strategy when you see Repeated Switches, Replace Conditional with Polymorphism, Decompose Conditional. Each variant lives in its own class; the agent can verify one strategy's behavior without loading the others.
---

# Apply: 18 — Replace Conditional Logic with Strategy

**Symptom:** A method whose body the agent must trace through a chain of branches to determine what runs. Each branch hides domain logic; verifying behavior requires loading every branch in scope on every edit.

**Goal:** Each variant lives in its own class; the agent can verify one strategy's behavior without loading the others. The dispatch site is a one-line call that needs no per-variant reasoning.

```js
// Before:
class Loan {
  capital() {
    if (this.expiry === null && this.maturity !== null) {
      // term loan
      return this.commitment * this.duration() * this.riskFactor();
    }
    if (this.expiry !== null && this.maturity === null) {
      if (this.unusedPercentage !== 1.0) {
        // revolver
        return this.commitment * this.unusedPercentage * this.duration() * this.riskFactor();
      }
      // advised line
      return this.outstandingRiskAmount() * this.duration()
        + this.unusedRiskAmount() * this.duration() * this.unusedPercentage;
    }
    return 0;
  }
}

// After:
class Loan {
  constructor(strategy) {
    this.capitalStrategy = strategy;
  }
  capital() {
    return this.capitalStrategy.capital(this);
  }
}

class TermLoanStrategy {
  capital(loan) {
    return loan.commitment * loan.duration() * loan.riskFactor();
  }
}

class RevolverStrategy {
  capital(loan) {
    return loan.commitment * loan.unusedPercentage * loan.duration() * loan.riskFactor();
  }
}

class AdvisedLineStrategy {
  capital(loan) {
    return loan.outstandingRiskAmount() * loan.duration()
      + loan.unusedRiskAmount() * loan.duration() * loan.unusedPercentage;
  }
}
```

_Example source: Adapted from Joshua Kerievsky's loan-calculator example in Refactoring to Patterns (Addison-Wesley, 2004). The Java original is translated to JavaScript and the three loan kinds are preserved as TermLoan, Revolver, and AdvisedLine strategies — same shape, different language._

**Pressure:** Every edit to one branch re-loads the entire conditional. Cross-branch invariants compound context cost; reasoning about which branch fires when requires holding the type-code rules in working memory across the full method body.

**Tradeoff:** Strategy fragments related logic across files, increasing context-load cost when reasoning about the system end-to-end. Vtable dispatch obscures static call-graph analysis — the agent has to enumerate strategy classes by hand.

**Relief:** Each strategy is independently verifiable. Adding a variant is one new file, not a multi-file change. The dispatching site stays trivial regardless of variant count; per-variant tests pin exactly the behavior they own.

**Trap:** Splitting a small set of one-line cases into one-method strategy classes forces the agent to load N files to reconstruct what one conditional once expressed in one file; context cost multiplies without a corresponding reduction in per-edit scope.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Decompose Conditional (refactorings)
