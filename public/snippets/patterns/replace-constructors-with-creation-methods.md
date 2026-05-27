---
name: replace-constructors-with-creation-methods
description: Apply Replace Constructors With Creation Methods when you see Mysterious Name, Replace Constructor with Factory Function, Change Function Declaration. Each static creation method has a clear, statically-typed signature.
---

# Apply: 19 — Replace Constructors With Creation Methods

**Symptom:** Constructor-overloading-via-sniffing where the agent must reason about argument shapes to know what the constructor does for a given call. Static type information is partial at best; the agent has to read the constructor body to verify which branch fires per call site.

**Goal:** Each static creation method has a clear, statically-typed signature. The agent verifies the canonical constructor's invariants once; per-creation-method behaviour is one named entry point with one return type.

```js
// Before:
// One constructor handling three different intentions through argument-shape sniffing.
class Money {
  constructor(amountOrOther, currency) {
    if (amountOrOther instanceof Money) {
      this.amount = amountOrOther.amount;
      this.currency = amountOrOther.currency;
    } else if (typeof currency === 'string') {
      this.amount = amountOrOther;
      this.currency = currency;
    } else {
      this.amount = amountOrOther;
      this.currency = 'USD';
    }
  }
}

const m1 = new Money(100);            // dollars (default)
const m2 = new Money(100, 'EUR');     // euros
const m3 = new Money(m1);             // copy

// After:
// One canonical constructor; named creation methods carry the intent.
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }
  static dollars(amount) {
    return new Money(amount, 'USD');
  }
  static of(amount, currency) {
    return new Money(amount, currency);
  }
  static copyOf(other) {
    return new Money(other.amount, other.currency);
  }
}

const m1 = Money.dollars(100);
const m2 = Money.of(100, 'EUR');
const m3 = Money.copyOf(m1);
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The book uses a Loan class with overloaded Java constructors; this JavaScript version uses a Money class whose single constructor performed argument-shape sniffing to support three intentions — replaced with named static creation methods._

**Pressure:** Argument-sniffing constructors defeat the agent's ability to statically classify call sites by intent. Per-call-site verification requires reading the receiver's constructor body and reproducing the sniffing logic; cross-call invariants are nearly impossible to enforce statically.

**Tradeoff:** Multiple creation methods expand the class's static API surface; the agent must learn them all to know which to call for a given intent. For agents working from a SKILL or doc rather than full source, the proliferation is a real cost.

**Relief:** Static analysis identifies creation-method usage by name; intent at the call site is statically visible. Diff surface for adding an intent is one new method; the canonical constructor stays narrow.

**Trap:** A wall of nearly-identical static creation methods that differ only in defaults can become harder to scan than one constructor with documented defaults. The pattern's clarity gain depends on each method representing a genuinely distinct intention.

**Triggered by:** Mysterious Name (smells), Replace Constructor with Factory Function (refactorings), Change Function Declaration (refactorings)
