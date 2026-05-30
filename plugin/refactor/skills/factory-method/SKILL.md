---
name: factory-method
description: Apply Factory Method when you see Repeated Switches, Replace Conditional with Polymorphism, Replace Type Code with Subclasses. Structural completeness via the type system; every subclass of the creator must implement the factory method, so missing-variant bugs surface as construction-time errors the agent can see during static reading.
---

# Apply: 30 — Factory Method

**Announce first:** name the chain of refactorings pointing at Factory Method and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Factory Method, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Type-code dispatch in a constructor or initializer means the agent must hold the full enumeration of variants in working memory while reading or editing the class. New variants land as edits to the switch; missed variants ship as runtime errors the agent had no structural reason to catch.

**Goal:** Structural completeness via the type system: every subclass of the creator must implement the factory method, so missing-variant bugs surface as construction-time errors the agent can see during static reading. The creator's workflow becomes a stable surface the agent never re-reads as products multiply.

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

**Pressure:** The agent's verification budget on creator edits scales linearly with the number of variants in the switch. Every variant must be checked for consistent treatment; partial updates produce type-compatible silent bugs the test suite may not exercise. Context cost climbs faster than feature value.

**Tradeoff:** A parallel hierarchy doubles the file count the agent must navigate to understand the system. 'Which Document am I dealing with?' becomes an additional step in every reasoning trace, and refactoring across the hierarchy requires editing N files in lockstep — exactly the cross-cutting pattern the agent struggles with most.

**Relief:** Adding a new variant is one new subclass that overrides the factory method; the creator's body stays constant in size, and the agent generates the new subclass by reading one sibling instead of editing dispatch logic across the codebase.

**Trap:** Subclasses that override more than the factory method (extra hooks, extra state, extra invariants) reintroduce the cross-cutting verification problem in a different shape — now the agent must verify N subclasses each implement M hooks consistently. The parallel hierarchy becomes the same N×M cell-check problem the switch had, only spread across more files.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Replace Type Code with Subclasses (refactorings)
