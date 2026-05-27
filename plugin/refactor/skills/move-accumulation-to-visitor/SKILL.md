---
name: move-accumulation-to-visitor
description: Apply Move Accumulation To Visitor when you see Divergent Change, Extract Class, Move Function. One file per operation; the agent verifies a Visitor in isolation.
---

# Apply: 14 — Move Accumulation To Visitor

**Symptom:** An operation's logic the agent must trace across N node classes to reconstruct what happens on a recursive call. The structure's source files are large because each one carries every operation; adding an operation requires the agent to coordinate edits across the full type hierarchy.

**Goal:** One file per operation; the agent verifies a Visitor in isolation. Node classes shrink to data + one accept method; the structure's complexity drops to its actual shape rather than the cumulative weight of every operation it has accumulated.

```js
// Before:
// Each operation (compute, print, depth) is a method on every node;
// adding an operation means editing every class.
class NumberExpr {
  constructor(value) { this.value = value; }
  compute() { return this.value; }
  print() { return String(this.value); }
  depth() { return 1; }
}
class AddExpr {
  constructor(left, right) { this.left = left; this.right = right; }
  compute() { return this.left.compute() + this.right.compute(); }
  print() { return '(' + this.left.print() + ' + ' + this.right.print() + ')'; }
  depth() { return 1 + Math.max(this.left.depth(), this.right.depth()); }
}
class MultiplyExpr {
  constructor(left, right) { this.left = left; this.right = right; }
  compute() { return this.left.compute() * this.right.compute(); }
  print() { return this.left.print() + ' * ' + this.right.print(); }
  depth() { return 1 + Math.max(this.left.depth(), this.right.depth()); }
}

// After:
// Nodes accept visitors; each operation is a visitor class.
// New operations land as new visitors; the node classes stay closed.
class NumberExpr {
  constructor(value) { this.value = value; }
  accept(visitor) { return visitor.visitNumber(this); }
}
class AddExpr {
  constructor(left, right) { this.left = left; this.right = right; }
  accept(visitor) { return visitor.visitAdd(this); }
}
class MultiplyExpr {
  constructor(left, right) { this.left = left; this.right = right; }
  accept(visitor) { return visitor.visitMultiply(this); }
}

class ComputeVisitor {
  visitNumber(n) { return n.value; }
  visitAdd(a) { return a.left.accept(this) + a.right.accept(this); }
  visitMultiply(m) { return m.left.accept(this) * m.right.accept(this); }
}

class PrintVisitor {
  visitNumber(n) { return String(n.value); }
  visitAdd(a) { return '(' + a.left.accept(this) + ' + ' + a.right.accept(this) + ')'; }
  visitMultiply(m) { return m.left.accept(this) + ' * ' + m.right.accept(this); }
}
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 8. Per ADR-0004, the bookend contrasts the accept/visit shape — not the intermediate steps. The book uses a parse-tree example with multiple accumulations; this JavaScript version uses an expression tree with Compute and Print visitors as the most legible bookend._

**Pressure:** Each operation × N node classes = N×M cells the agent must verify match for the operation to behave consistently across the structure. Cross-node invariants (every node implements compute, every node's compute is consistent with its print) are not statically enforceable.

**Tradeoff:** Visitor splits a single conceptual operation across two layers (accept + visit); the agent must follow the double dispatch to trace what runs for a given node + operation pair. Adding a node type requires the agent to edit every visitor — Shotgun Surgery shifts from operations to nodes.

**Relief:** Per-operation diff surface is one file the agent reads end-to-end. Static-analysis tools can verify each Visitor implements every visitX method (whereas the inline-method version had no such guarantee). Tests target Visitor classes directly.

**Trap:** A visitor hierarchy applied to an unstable node set forces the agent to chase a Shotgun Surgery across visitor files every time a node is added. Per-edit context cost goes up linearly with operation count when nodes change — the inverse of the pattern's intended cost shape.

**Triggered by:** Divergent Change (smells), Extract Class (refactorings), Move Function (refactorings)
