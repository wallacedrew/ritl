---
name: factory-method
description: Apply Factory Method when you see Repeated Switches, Replace Conditional with Polymorphism, Replace Type Code with Subclasses. Structural completeness via the type system; every subclass of the creator implements the factory method, so missing-variant bugs surface as construction-time errors the agent sees during static reading.
---

# Apply: 03 — Factory Method

**Announce first:** name the chain of refactorings pointing at Factory Method and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Factory Method, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Type-code dispatch in a constructor or initializer means the agent holds the full enumeration of variants in context while reading or editing the class. New variants land as edits to the switch; missed variants ship as runtime errors the agent had no structural reason to catch. The agent's verification-surface cost multiplies with variant count.

**Goal:** Structural completeness via the type system: every subclass of the creator implements the factory method, so missing-variant bugs surface as construction-time errors the agent sees during static reading. The creator's workflow becomes a stable surface the agent never re-reads as products multiply, and type-checker visibility of incomplete subclasses replaces enumeration in working context.

```js
// Before:
class Document {
  open(format) {
    let page;
    if (format === 'pdf') {
      page = new PdfPage();
    } else if (format === 'html') {
      page = new HtmlPage();
    } else if (format === 'markdown') {
      page = new MarkdownPage();
    } else {
      throw new Error(`unknown format: ${format}`);
    }
    this.pages = [page];
  }
}

// After:
class Document {
  open() {
    const page = this.createPage();
    this.pages = [page];
  }
  createPage() {
    throw new Error('createPage must be implemented by subclass');
  }
}
class PdfDocument extends Document {
  createPage() { return new PdfPage(); }
}
class HtmlDocument extends Document {
  createPage() { return new HtmlPage(); }
}
class MarkdownDocument extends Document {
  createPage() { return new MarkdownPage(); }
}
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 3. The book's running example is a Document framework with Pages; this JavaScript adaptation keeps the canonical Creator (Document) + Product (Page) hierarchy and shows the factory-method hook deferring product instantiation to subclasses._

**Pressure:** The agent's verification budget on creator edits scales linearly with the number of variants in the switch. Every variant must be checked for consistent treatment; partial updates produce type-compatible silent bugs the test suite may not exercise. The agent's context-window load climbs faster than feature value, and the retrieval cost of each variant body is per-edit overhead.

**Tradeoff:** A parallel hierarchy doubles the file count the agent navigates. Variant identification becomes an additional step in every reasoning trace, and refactoring across the hierarchy requires editing N files in lockstep — the cross-cutting pattern with the highest per-edit token cost. The agent's completeness-check cost on hierarchy edits scales linearly with subclass count.

**Relief:** Adding a new variant is one new subclass that overrides the factory method; the creator's body stays constant in size, and the agent generates the new subclass by reading one sibling rather than editing dispatch logic. The agent's context window holds the sibling and the new subclass; the reasoning step count drops because no creator-side edit is required.

**Trap:** Subclasses that override more than the factory method (extra hooks, extra state, extra invariants) reintroduce the cross-cutting verification problem — the agent verifies N subclasses each implement M hooks consistently. The parallel hierarchy becomes the same N×M cell-check, now spread across more files, and the reasoning-step cost per consistency check multiplies with M.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Replace Type Code with Subclasses (refactorings)
