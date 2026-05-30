---
name: introduce-polymorphic-creation-with-factory-method
description: Apply Introduce Polymorphic Creation With Factory Method when you see Repeated Switches, Replace Conditional with Polymorphism, Replace Constructor with Factory Function. Each subclass's Factory Method is locally verifiable; the base algorithm has no construction-conditional for the agent to load.
---

# Apply: 11 — Introduce Polymorphic Creation With Factory Method

**Announce first:** name the chain of refactorings pointing at Introduce Polymorphic Creation With Factory Method and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Introduce Polymorphic Creation With Factory Method, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** A conditional construction block the agent must scan to know which collaborator gets built for a given type code. Adding a variant requires the agent to enumerate every such construction site in scope and add a branch — Shotgun Surgery in static reasoning.

**Goal:** Each subclass's Factory Method is locally verifiable; the base algorithm has no construction-conditional for the agent to load. The agent's per-edit budget on a variant addition is one new subclass, not N edits to construction sites.

```js
// Before:
// Branching on a type code to decide which collaborator to construct.
class DocumentReader {
  constructor(format) {
    this.format = format;
  }
  read(text) {
    let parser;
    if (this.format === 'xml') {
      parser = new XmlParser();
    } else if (this.format === 'json') {
      parser = new JsonParser();
    } else if (this.format === 'csv') {
      parser = new CsvParser();
    } else {
      throw new Error(`unsupported format ${this.format}`);
    }
    return parser.parse(text);
  }
}

// After:
// Each subclass owns its createParser primitive; the base class is conditional-free.
class DocumentReader {
  read(text) {
    return this.createParser().parse(text);
  }
  createParser() {
    throw new Error('abstract: subclasses must implement createParser');
  }
}
class XmlReader extends DocumentReader {
  createParser() {
    return new XmlParser();
  }
}
class JsonReader extends DocumentReader {
  createParser() {
    return new JsonParser();
  }
}
class CsvReader extends DocumentReader {
  createParser() {
    return new CsvParser();
  }
}
```

_Example source: Illustrative example written for this site, adapted from Kerievsky's pattern description in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The book frames this as the polymorphic alternative to type-code-driven construction; this JavaScript version uses document readers and parsers, same Factory Method shape._

**Pressure:** Construction conditionals couple the base class to the full variant taxonomy; the agent must hold every variant in working memory to verify any edit to the base. Cross-variant invariants (e.g., that every parser implements `.parse`) are not statically enforceable when construction goes through type-code strings.

**Tradeoff:** Factory Method spreads creation across the inheritance hierarchy; the agent must traverse subclasses to know which concrete type a base-class call produces. Static call-graph analysis loses precision on the return type of `createParser()`.

**Relief:** Adding a new variant is one new subclass that overrides the factory hook; the base algorithm reads one virtual call instead of branching on a type code, and the algorithm's body stays constant in size as variants are added.

**Trap:** A hierarchy with one trivial Factory Method per subclass forces the agent to load the inheritance chain to know what a single base-class call returns. The pattern's context-cost gain materializes only when each Factory Method does non-trivial work — otherwise the indirection adds cost without proportional clarity.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Replace Constructor with Factory Function (refactorings)
