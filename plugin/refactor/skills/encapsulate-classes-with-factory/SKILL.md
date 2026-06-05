---
name: encapsulate-classes-with-factory
description: Apply Encapsulate Classes With Factory when you see Shotgun Surgery, Replace Constructor with Factory Function, Hide Delegate. One factory module the agent verifies once; all construction sites read as named factory calls the agent treats opaquely.
---

# Apply: 69 — Encapsulate Classes With Factory

**Announce first:** name the chain of refactorings pointing at Encapsulate Classes With Factory and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Encapsulate Classes With Factory, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Concrete subclass type names appear at every construction site the agent scans. Renaming or restructuring a subclass requires the agent to enumerate every `new SubclassName(...)` call in scope and update each one; static type-name coupling is brittle across files. The agent's context-window load doubles across every client file just to confirm subclass references are consistent.

**Goal:** One factory module the agent verifies once; all construction sites read as named factory calls the agent treats opaquely. Restructuring the hierarchy is a one-file diff verified locally. The agent's context window holds only the factory and the calling code; the reasoning step count drops because the subclass taxonomy stays inside the factory.

```js
// Before:
// Concrete subclasses exported and constructed by clients everywhere.
export class Loan {
  capital() { throw new Error('abstract'); }
}
export class TermLoan extends Loan {
  constructor(commitment, maturity) { super(); this.commitment = commitment; this.maturity = maturity; }
  capital() { return this.commitment * this.duration() * 0.05; }
}
export class Revolver extends Loan {
  constructor(commitment, expiry) { super(); this.commitment = commitment; this.expiry = expiry; }
  capital() { return this.commitment * 0.7 * this.duration() * 0.05; }
}
export class AdvisedLine extends Loan {
  constructor(commitment, expiry) { super(); this.commitment = commitment; this.expiry = expiry; }
  capital() { return this.outstanding() * this.duration() + this.unused() * this.duration() * 0.5; }
}

// Client code (in many files):
const loan1 = new TermLoan(100000, '2027-01-01');
const loan2 = new Revolver(50000, '2026-06-30');
const loan3 = new AdvisedLine(75000, '2026-06-30');

// After:
// Only Loan is exported. Concrete subclasses stay module-local.
export class Loan {
  static newTermLoan(commitment, maturity) {
    return new TermLoan(commitment, maturity);
  }
  static newRevolver(commitment, expiry) {
    return new Revolver(commitment, expiry);
  }
  static newAdvisedLine(commitment, expiry) {
    return new AdvisedLine(commitment, expiry);
  }
  capital() { throw new Error('abstract'); }
}
class TermLoan extends Loan { /* ... */ }
class Revolver extends Loan { /* ... */ }
class AdvisedLine extends Loan { /* ... */ }

// Client code:
const loan1 = Loan.newTermLoan(100000, '2027-01-01');
const loan2 = Loan.newRevolver(50000, '2026-06-30');
const loan3 = Loan.newAdvisedLine(75000, '2026-06-30');
```

_Example source: Adapted from Joshua Kerievsky's Loan-hierarchy example in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The Java original used package-private constructors and a public factory; this JavaScript translation relies on module-local class declarations to achieve the same hiding of concrete subclasses from clients._

**Pressure:** Every client-side `new SubclassName(...)` couples the call site to the concrete identity. The agent holds the subclass taxonomy in working context across many files just to verify construction sites are consistent with the hierarchy's current shape. The agent's retrieval cost across the client population multiplies with subclass count, and a partial rename produces a runtime construction error.

**Tradeoff:** Factory methods are an extra indirection the agent hops through to know what kind of object a call returns. Static call-graph analysis loses precision; the agent may need to read the factory body to determine which concrete type comes back from a given factory call. The agent's verification-surface cost rises for behaviors that depend on the concrete identity.

**Relief:** The factory holds the construction recipe for every variant at one file; adding a subclass touches the factory plus the new class, and existing callers do not move because they reach for the factory's named methods rather than constructors. The agent's completeness-check cost on hierarchy edits collapses from the client population to the factory itself.

**Trap:** A factory with one method per subclass and no other logic just renames `new` to `factory.new`. The agent's token cost rises by one definition layer without proportional reasoning gain; the encapsulation pays only when the factory can hide non-trivial creation choices, and context-window load on the factory file adds without benefit.

**Triggered by:** Shotgun Surgery (smells), Replace Constructor with Factory Function (refactorings), Hide Delegate (refactorings)
