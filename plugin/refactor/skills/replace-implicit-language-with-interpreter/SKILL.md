---
name: replace-implicit-language-with-interpreter
description: Apply Replace Implicit Language With Interpreter when you see Primitive Obsession, Replace Primitive with Object, Substitute Algorithm. Each grammar node is one class the agent verifies independently.
---

# Apply: 21 — Replace Implicit Language With Interpreter

**Symptom:** String-DSL parsing and dispatch entangled in one method body the agent must trace per call. The grammar is implicit in regex patterns and conditionals; the agent cannot statically enumerate valid expressions or verify that all paths handle malformed input.

**Goal:** Each grammar node is one class the agent verifies independently. The composed expression tree is a statically-typed data structure the agent reads structurally; per-node tests pin per-node behaviour.

```js
// Before:
// A string-based DSL carries the filter; parsing and dispatch are coupled in one method.
class TaskFilter {
  matches(task, expression) {
    // expression like 'tag=urgent AND priority>3'
    const clauses = expression.split(' AND ');
    return clauses.every((clause) => {
      const equalsMatch = clause.match(/^(\w+)=(\S+)$/);
      if (equalsMatch) return task[equalsMatch[1]] === equalsMatch[2];
      const greaterMatch = clause.match(/^(\w+)>(\S+)$/);
      if (greaterMatch) return task[greaterMatch[1]] > Number(greaterMatch[2]);
      throw new Error(`unparseable clause: ${clause}`);
    });
  }
}

// After:
// Domain objects compose into an expression tree; each node knows how to evaluate itself.
class Equals {
  constructor(field, value) { this.field = field; this.value = value; }
  matches(task) { return task[this.field] === this.value; }
}
class GreaterThan {
  constructor(field, value) { this.field = field; this.value = value; }
  matches(task) { return task[this.field] > this.value; }
}
class And {
  constructor(left, right) { this.left = left; this.right = right; }
  matches(task) { return this.left.matches(task) && this.right.matches(task); }
}
class Or {
  constructor(left, right) { this.left = left; this.right = right; }
  matches(task) { return this.left.matches(task) || this.right.matches(task); }
}

const filter = new And(new Equals('tag', 'urgent'), new GreaterThan('priority', 3));
tasks.filter((task) => filter.matches(task));
```

_Example source: Illustrative example written for this site, faithful to Kerievsky's pattern shape in Refactoring to Patterns (Addison-Wesley, 2004), chapter 11. Per ADR-0004, the bookend contrasts the implicit string DSL with the explicit AST — the intermediate grammar-extraction steps live in the linked Fowler refactorings. The book uses a query-language example; this JavaScript version uses task-filtering predicates._

**Pressure:** Implicit DSLs defeat static analysis at the string boundary — the agent's verification cost spans both parser and evaluator. Adding a syntactic form requires the agent to coordinate parser, evaluator, and tests; misalignments between the three are silent and ship to runtime.

**Tradeoff:** Interpreter spreads a single conceptual query across multiple class files; the agent traverses the tree to know what an expression does. Static call-graph analysis loses precision on polymorphic `matches` calls — the agent must enumerate concrete node types.

**Relief:** Adding a new operator is one new class in the grammar hierarchy; the agent enumerates operators by listing the classes that implement the interface, and tests target evaluation against the typed AST instead of raw string parsing.

**Trap:** A grammar with many nodes representing fine-grained syntactic variations forces the agent to load a large hierarchy to reason about any expression. Per-node specialization (NumericEquals vs. StringEquals vs. DateEquals) can multiply file count without proportional reasoning gain.

**Triggered by:** Primitive Obsession (smells), Replace Primitive with Object (refactorings), Substitute Algorithm (refactorings)
