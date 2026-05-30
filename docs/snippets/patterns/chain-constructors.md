---
name: chain-constructors
description: Apply Chain Constructors when you see Duplicated Code, Extract Function, Combine Functions into Class. One construction path the agent reads to know what a fully-initialized object looks like; all other paths are one-line delegations the agent can skip past during reasoning.
---

# Apply: 01 — Chain Constructors

**Announce first:** name the chain of refactorings pointing at Chain Constructors and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** Multiple construction paths the agent must scan in parallel to confirm field initialization is consistent. Behavioral preservation on every field-related edit requires verifying every path, multiplying context cost by path count.

**Goal:** One construction path the agent reads to know what a fully-initialized object looks like; all other paths are one-line delegations the agent can skip past during reasoning. Field-set drift is impossible by construction.

```js
// Before:
class Loan {
  static newTermLoan(commitment, customer, maturity) {
    const loan = new Loan();
    if (commitment < 0) throw new Error('commitment must be non-negative');
    loan.commitment = commitment;
    loan.customer = customer;
    loan.maturity = maturity;
    loan.expiry = null;
    loan.unusedPercentage = 0.0;
    return loan;
  }
  static newRevolver(commitment, customer, expiry) {
    const loan = new Loan();
    if (commitment < 0) throw new Error('commitment must be non-negative');
    loan.commitment = commitment;
    loan.customer = customer;
    loan.maturity = null;
    loan.expiry = expiry;
    loan.unusedPercentage = 1.0;
    return loan;
  }
  static newAdvisedLine(commitment, customer, expiry) {
    const loan = new Loan();
    if (commitment < 0) throw new Error('commitment must be non-negative');
    loan.commitment = commitment;
    loan.customer = customer;
    loan.maturity = null;
    loan.expiry = expiry;
    loan.unusedPercentage = 0.5;
    return loan;
  }
}

// After:
class Loan {
  constructor(commitment, customer, expiry, maturity, unusedPercentage) {
    if (commitment < 0) throw new Error('commitment must be non-negative');
    this.commitment = commitment;
    this.customer = customer;
    this.expiry = expiry;
    this.maturity = maturity;
    this.unusedPercentage = unusedPercentage;
  }
  static newTermLoan(commitment, customer, maturity) {
    return new Loan(commitment, customer, null, maturity, 0.0);
  }
  static newRevolver(commitment, customer, expiry) {
    return new Loan(commitment, customer, expiry, null, 1.0);
  }
  static newAdvisedLine(commitment, customer, expiry) {
    return new Loan(commitment, customer, expiry, null, 0.5);
  }
}
```

_Example source: Adapted from Joshua Kerievsky's Loan-class example in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The Java original used overloaded constructors; this JavaScript translation uses static creation methods delegating to one canonical constructor — same shape, same single-point-of-initialization payoff._

**Pressure:** N construction paths × M fields = N×M cells the agent must verify match on every field-related edit. Field additions cascade across all paths; per-path duplication consumes context budget that could be spent on the calling code.

**Tradeoff:** A long canonical parameter list is itself a context-load tax — the agent must remember positional argument order on every reading of a delegating factory. Wrong-position bugs become subtler than missing-field bugs.

**Relief:** Each variant constructor delegates to the canonical one; adding a new field touches the canonical constructor once and every variant inherits the change, and tests against the canonical body cover all variants transitively.

**Trap:** The canonical constructor balloons into a many-parameter signature where the agent loses track of which combinations are legal. Context cost moves from per-path duplication to per-parameter combination explosion; a parameter object or named-argument shape becomes overdue.

**Triggered by:** Duplicated Code (smells), Extract Function (refactorings), Combine Functions into Class (refactorings)
