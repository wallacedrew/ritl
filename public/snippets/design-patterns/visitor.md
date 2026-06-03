---
name: visitor
description: Apply Visitor when you see Divergent Change, Shotgun Surgery, Move Function. Per-operation visitors the agent reads as one file; per-node node classes the agent reads as small data + accept-dispatch.
---

# Apply: 23 — Visitor

**Announce first:** name the chain of refactorings pointing at Visitor and that you're applying it before the next edit. The user reads the announcement as your contract.

**Or decline first:** if you don't see a chain pointing at Visitor, name the decline type — no chain, taste call, cost-benefit, constraint-blocked, or insufficient context.

**Symptom:** Operations scattered across every node class as methods the agent must verify uniformly on every operation-shape change. Adding 'searchByName' touches every node type; missing one is a type-compatible silent bug.

**Goal:** Per-operation visitors the agent reads as one file; per-node node classes the agent reads as small data + accept-dispatch. Static analysis enumerates operations by listing Visitor subclasses; static analysis enumerates node types by listing nodes; the two axes are independent.

```js
// Before:
class FileNode {
  constructor(name, bytes) {
    this.name = name;
    this.bytes = bytes;
  }
  totalSize() { return this.bytes; }
  countFiles() { return 1; }
  findLargest() { return this; }
}
class DirectoryNode {
  constructor(name, children) {
    this.name = name;
    this.children = children;
  }
  totalSize() {
    return this.children.reduce((s, c) => s + c.totalSize(), 0);
  }
  countFiles() {
    return this.children.reduce((s, c) => s + c.countFiles(), 0);
  }
  findLargest() {
    let largest = null;
    for (const child of this.children) {
      const x = child.findLargest();
      if (!largest || x.bytes > largest.bytes) largest = x;
    }
    return largest;
  }
}
// Adding 'searchByName' = edits in every node class. Each new operation
// touches the node hierarchy; node classes change for unrelated reasons.

// After:
class FileNode {
  constructor(name, bytes) {
    this.name = name;
    this.bytes = bytes;
  }
  accept(visitor) { return visitor.visitFile(this); }
}
class DirectoryNode {
  constructor(name, children) {
    this.name = name;
    this.children = children;
  }
  accept(visitor) { return visitor.visitDirectory(this); }
}
class TotalSizeVisitor {
  visitFile(file) { return file.bytes; }
  visitDirectory(dir) {
    return dir.children.reduce((s, c) => s + c.accept(this), 0);
  }
}
class CountFilesVisitor {
  visitFile() { return 1; }
  visitDirectory(dir) {
    return dir.children.reduce((s, c) => s + c.accept(this), 0);
  }
}
class FindLargestVisitor {
  visitFile(file) { return file; }
  visitDirectory(dir) {
    let largest = null;
    for (const child of dir.children) {
      const candidate = child.accept(this);
      if (!largest || candidate.bytes > largest.bytes) largest = candidate;
    }
    return largest;
  }
}
const size  = root.accept(new TotalSizeVisitor());
const count = root.accept(new CountFilesVisitor());
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 5. The book uses a compiler AST with type-checking and code-generation visitors; this JavaScript adaptation reuses the filesystem-tree shape from the Composite entry so the reader can see the same data structure with operations factored out into visitors._

**Pressure:** Operations-as-methods is N nodes × M operations cells the agent verifies on every operation addition. Adding M+1 forces editing N nodes; one missed node ships as a runtime error the test suite may not catch on the less-exercised variant.

**Tradeoff:** Visitor inversion means adding a node is N visitors × 1 method cells the agent edits. The pattern only wins when M (operations) grows faster than N (node types); when both grow, the pattern reorders the problem rather than solving it.

**Relief:** Per-operation edits scope to one visitor file; per-node-traversal verification is structural in accept dispatch; visitor tests cover an entire operation against every node type compositionally without enumerating combinations by hand.

**Trap:** Visitors with hidden state across visit calls produce traversal-order-dependent bugs the agent cannot localize from any one visit method. Stack traces span accept + visit boundaries; the agent must reason about the interleaving of accept and visit calls on every traversal-related bug.

**Triggered by:** Divergent Change (smells), Shotgun Surgery (smells), Move Function (refactorings)
