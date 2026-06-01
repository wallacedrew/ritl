---
name: move-accumulation-to-collecting-parameter
description: Apply Move Accumulation To Collecting Parameter when you see Duplicated Code, Parameterize Function, Substitute Algorithm. One collecting parameter the agent reads as a single mutable accumulator; recursion bodies become small and locally verifiable.
---

# Apply: 79 — Move Accumulation To Collecting Parameter

**Announce first:** name the chain of refactorings pointing at Move Accumulation To Collecting Parameter and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Move Accumulation To Collecting Parameter, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Recursive methods the agent must trace at every level to verify the accumulate-and-merge sequence preserves order and content. Each level allocates and copies; the agent's reasoning about the final result requires composing N merge operations mentally.

**Goal:** One collecting parameter the agent reads as a single mutable accumulator; recursion bodies become small and locally verifiable. Final-result verification is one read of the accumulator, not a recursive trace.

```js
// Before:
// Each node builds a fragment and the parent concatenates.
// The accumulate-then-merge step is duplicated through the recursion.
class Section {
  constructor(title) {
    this.title = title;
    this.children = [];
  }
  toLines() {
    let lines = [this.title];
    for (const child of this.children) {
      lines = lines.concat(child.toLines().map((line) => '  ' + line));
    }
    return lines;
  }
}

const output = root.toLines();

// After:
// One collecting parameter; each node writes directly into it.
class Section {
  constructor(title) {
    this.title = title;
    this.children = [];
  }
  printTo(lines, indent = '') {
    lines.push(indent + this.title);
    for (const child of this.children) {
      child.printTo(lines, indent + '  ');
    }
  }
}

const output = [];
root.printTo(output);
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 8. The book uses a recursive tag-printing example with a StringBuffer collecting parameter; this JavaScript version uses a Section composite collecting lines into an array — same pattern, idiomatic JS host._

**Pressure:** Per-step intermediate allocations multiply both runtime cost and reasoning cost — the agent must verify each level's merge logic is consistent with the others. Memory churn on deep recursions is invisible until profiling surfaces it.

**Tradeoff:** Mutable accumulators defeat the agent's static reasoning about purity. Method signatures change semantics — what looked like a query now mutates a parameter; static-analysis tools that classify methods as pure must be retaught. Tests must verify the accumulator's final state, not the method's return value.

**Relief:** Recursion bodies shrink; verification of correctness localizes to one append-per-level; static reasoning about the algorithm's shape becomes straightforward. The traversal is observable through one accumulator snapshot.

**Trap:** An accumulator that escapes the traversal is a shared mutable reference the agent must trace through subsequent code to verify safety. The pattern's verifiability gain inside the traversal is partially undone by the safety analysis required outside it.

**Triggered by:** Duplicated Code (smells), Parameterize Function (refactorings), Substitute Algorithm (refactorings)
