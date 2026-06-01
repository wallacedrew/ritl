---
name: replace-onemany-distinctions-with-composite
description: Apply Replace One/Many Distinctions With Composite when you see Repeated Switches, Replace Conditional with Polymorphism, Extract Class. Polymorphic dispatch on the value's type; the agent verifies each subtype's implementation in isolation.
---

# Apply: 89 — Replace One/Many Distinctions With Composite

**Announce first:** name the chain of refactorings pointing at Replace One/Many Distinctions With Composite and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Replace One/Many Distinctions With Composite, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Per-operation `Array.isArray` branches the agent must verify match across N operations. The agent cannot statically guarantee that every operation handles both shapes consistently; subtle inconsistencies surface only when a one-only operation receives a many value.

**Goal:** Polymorphic dispatch on the value's type; the agent verifies each subtype's implementation in isolation. Per-operation analysis no longer requires holding 'what shape is this value?' in working memory.

```js
// Before:
// Every operation branches on whether the value is one or many.
class Form {
  setValue(name, valueOrValues) {
    if (Array.isArray(valueOrValues)) {
      this.fields[name] = valueOrValues.map((v) => sanitize(v));
    } else {
      this.fields[name] = sanitize(valueOrValues);
    }
  }
  getDisplay(name) {
    const value = this.fields[name];
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  }
  isMultivalued(name) {
    return Array.isArray(this.fields[name]);
  }
}

// After:
// Both single and many implement the same Field interface; callers stop branching.
class Field {
  asString() { throw new Error('abstract'); }
  isMultivalued() { return false; }
}
class SingleField extends Field {
  constructor(raw) {
    super();
    this.value = sanitize(raw);
  }
  asString() { return this.value; }
}
class MultiField extends Field {
  constructor(items) {
    super();
    this.children = items.map((item) => new SingleField(item));
  }
  asString() { return this.children.map((child) => child.asString()).join(', '); }
  isMultivalued() { return true; }
}

class Form {
  setValue(name, field) {
    this.fields[name] = field; // already a SingleField or MultiField
  }
  getDisplay(name) {
    return this.fields[name].asString();
  }
  isMultivalued(name) {
    return this.fields[name].isMultivalued();
  }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 9. The book uses a graphics-system Shape/Group example; this JavaScript version uses form Field/MultiField — the same Composite shape applied to a one-or-many distinction._

**Pressure:** One-vs-many branch checks duplicate across every consumer; the agent's per-edit verification cost scales with operation count. Static type information is shallow when JavaScript allows both shapes to flow through the same variable.

**Tradeoff:** Composite spreads behaviour across a type hierarchy; the agent must traverse subtypes to know what a method does for a given value. Subtype construction at boundaries is itself a place the agent must verify the one-vs-many decision lands correctly.

**Relief:** Adding a new operation is one method on the Composite interface plus one implementation per subtype; the type checker confirms every subtype implements the operation, and operation bodies no longer branch on one-versus-many because the Composite handles the shape.

**Trap:** A Composite applied to a distinction that is actually load-bearing context (e.g., when callers need to know cardinality to render differently) ends up restoring the `if (isMulti)` branches at the call site, just with `.isMultivalued()` instead of `Array.isArray`. The pattern pays when callers genuinely don't care which shape they have.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Extract Class (refactorings)
