---
name: composite
description: Apply Composite when you see Repeated Switches, Replace Conditional with Polymorphism, Replace Type Code with Subclasses. A typed interface where adding a new node kind forces the type system to demand an implementation of every operation.
---

# Apply: 35 — Composite

**Announce first:** name the chain of refactorings pointing at Composite and that you're applying it before the next edit. The user reads the announcement as your contract.

**Symptom:** Untyped tree records the agent must reason about as discriminated unions enforced by convention, not by type. Every traversal is a switch the agent verifies for exhaustiveness; static analysis cannot prove no kind was forgotten.

**Goal:** A typed interface where adding a new node kind forces the type system to demand an implementation of every operation. The agent's edit-verify cycle on a new kind is bounded by the interface; static analysis returns complete results.

```js
// Before:
function totalSize(node) {
  if (node.type === 'file') {
    return node.bytes;
  } else if (node.type === 'directory') {
    let total = 0;
    for (const child of node.children) {
      total += totalSize(child);
    }
    return total;
  }
  throw new Error(`unknown node type: ${node.type}`);
}
function nameOf(node) {
  if (node.type === 'file' || node.type === 'directory') return node.name;
  throw new Error(`unknown node type: ${node.type}`);
}
// Every traversal repeats the if/else; new node types touch every function.

// After:
class FileNode {
  constructor(name, bytes) {
    this.name = name;
    this.bytes = bytes;
  }
  totalSize() { return this.bytes; }
}
class DirectoryNode {
  constructor(name, children) {
    this.name = name;
    this.children = children;
  }
  totalSize() {
    return this.children.reduce((sum, child) => sum + child.totalSize(), 0);
  }
}
// Client treats leaf and composite uniformly:
const root = new DirectoryNode('project', [
  new FileNode('README.md', 1024),
  new DirectoryNode('src', [new FileNode('index.js', 2048)]),
]);
const size = root.totalSize();
```

_Example source: Illustrative example written for this site in the spirit of Design Patterns (Gamma, Helm, Johnson, Vlissides, Addison-Wesley, 1994), chapter 4. The book's running example is a graphics editor's drawing primitives + groups; this JavaScript adaptation uses filesystem nodes (file + directory) because the leaf/composite uniformity is more recognizable and the recursive aggregation is easier to picture._

**Pressure:** Discriminated-record traversals scatter the kind-handling logic across every operation; the agent's reasoning load grows with operation count × kind count. Missed branches surface as runtime exceptions on paths the test suite did not happen to exercise.

**Tradeoff:** Uniform interfaces force the agent to recognize 'this operation is a no-op on leaves' or 'this throws on leaves' as patterns separate from the interface itself. Stack traces from a leaf rejecting add() require the agent to trace through the interface contract to understand why the rejection happened.

**Relief:** Per-kind edits scope to one class file; per-operation edits scope to adding one method across N classes (mechanical, scriptable). The composite traversal is a one-line reduce; recursion verification is local to the composite class.

**Trap:** Leaves implementing add()/remove() as throws turns the type system's promise of uniformity into a runtime trap. The agent reading the interface expects the operation to work; the runtime experience contradicts the static read. Prefer the discriminated-union form when leaf and composite diverge on more than two operations.

**Triggered by:** Repeated Switches (smells), Replace Conditional with Polymorphism (refactorings), Replace Type Code with Subclasses (refactorings)
