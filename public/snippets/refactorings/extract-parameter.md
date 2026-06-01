---
name: extract-parameter
description: Apply Extract Parameter when you see Duplicated Code, Parameterize Function, Extract Function. One method the agent reads once; callers supply the varying value at the call site.
---

# Apply: 73 — Extract Parameter

**Announce first:** name the chain of refactorings pointing at Extract Parameter and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Extract Parameter, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** N near-duplicate method definitions the agent must verify match on every edit. The single difference between them is mechanical; the rest is copy-pasted. The agent must re-read all N to verify a change in one was correctly propagated.

**Goal:** One method the agent reads once; callers supply the varying value at the call site. Verification of behaviour reduces from N×assertion to 1×assertion + parameter coverage tests.

```js
// Before:
// Three near-identical methods, differing only by which book field they search.
class BookSearch {
  constructor(repo) {
    this.repo = repo;
  }
  searchByAuthor(query) {
    return this.repo.where(book => book.author.toLowerCase().includes(query.toLowerCase()));
  }
  searchByTitle(query) {
    return this.repo.where(book => book.title.toLowerCase().includes(query.toLowerCase()));
  }
  searchByPublisher(query) {
    return this.repo.where(book => book.publisher.toLowerCase().includes(query.toLowerCase()));
  }
}

// After:
// One method; the varying field is a parameter.
class BookSearch {
  constructor(repo) {
    this.repo = repo;
  }
  searchBy(field, query) {
    return this.repo.where(book => book[field].toLowerCase().includes(query.toLowerCase()));
  }
}
```

_Example source: Illustrative example written for this site, adapted from Kerievsky's pattern description in Refactoring to Patterns (Addison-Wesley, 2004), chapter 6. The book frames Extract Parameter as the structural move that prepares a method for Form Template Method by isolating what varies between near-duplicate methods._

**Pressure:** Per-method duplication multiplies the agent's edit cost on every shared-logic change. The agent's static reasoning cannot guarantee that N copies of a closure stayed identical without re-inspecting each.

**Tradeoff:** A parameterized method obscures static call-graph analysis — the agent cannot tell from the call site alone which behaviour fires. Stringy parameters (`'author'`) defeat static type-checking; misspellings ship to runtime.

**Relief:** Shared logic lives at one method body the agent reads once; the parameter holds the per-call variation, and tests cover the variants through a table the agent reads as one block instead of N near-identical test methods.

**Trap:** Replacing N methods with a method that takes a stringy parameter pushes the type information out of the type system and into runtime. The agent must verify caller intent by tracing the literal across files, which costs more context than reading N distinct method names.

**Triggered by:** Duplicated Code (smells), Parameterize Function (refactorings), Extract Function (refactorings)
